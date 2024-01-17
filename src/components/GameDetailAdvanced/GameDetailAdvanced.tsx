'use client';
import type { GameData, IGDBGameData, IGDBPlatform } from '@/app/lib/types';
import { Fragment, useEffect, useState } from 'react';
import css from './GameDetailAdvanced.module.css';
import { Platform, Trailer } from '@prisma/client';
import { useRouter } from 'next/navigation';

import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa';
import triggerRevalidate from '@/app/lib/triggerRevalidate';
import Select from 'react-select';

type Props = {
	game: GameData;
	platforms: Platform[];
};

export const dynamic = 'force-dynamic';

export default function GameDetailAdvanced({ game, platforms }: Props) {
	const [gameDetail, setGameDetail] = useState(game); // Beinhaltet die Daten des Spiels aus DB => wird (ggf. modifiziert) auch wieder in DB gespeichert
	const [trigger, setTrigger] = useState(0); // Trigger zum Nachladen von Daten per API
	const [newGameDetail, setNewGameDetail] = useState<GameData[]>([]); // Speichert die Spieldaten der IGDB-API
	const [selectedGame, setSelectedGame] = useState(0); // Merkt sich, welches IGDB-Spiel via Pfeiltasten ausgewählt wurde
	const [maxSelectedGame, setMaxSelectedGame] = useState(0); // Höchster Index des IGDB-Arrays
	const [editMode, setEditMode] = useState(false); // Edit-Mode: Im Edit-Mode ändert sich die Anzeige und die Datenquelle
	const router = useRouter();

	triggerRevalidate('(sites)/Spiele/[id]');

	useEffect(() => {
		if (trigger > 0) {
			// Soll nicht beim ersten Laden der Komponente ausgelöst werden, daher der Trigger

			// ############################
			// #
			// # Holt sich die neuen Spiele bei IGDB, die zum Suchbegriff passen
			// # und speichert sie als Array in newGameDetail
			// #
			// ############################
			const fetchGames = async () => {
				try {
					const newGames = await fetchGamesFromIGDB(gameDetail, platforms);
					setNewGameDetail(newGames);

					if (newGames.length > 0) {
						setMaxSelectedGame(newGames.length - 1);
					}

					// ############################
					// #
					// # Wenn in der DB zu diesem Spiel bereits eine IGDB-ID steht, setze SelectedGame auf
					// # genau diesen Index des newGameDetail-Arrays, weil man idR kein neues Spiel auswählen,
					// # sondern nur noch genau dieses Spiel editieren möchte
					// #
					// ############################

					const startIndex = newGames.findIndex(
						(game) => game.game_igdb_id === gameDetail.game_igdb_id
					);

					// -1 => Kein Index gefunden => Startindex bleibt 0
					// Fall tritt idR ein, wenn zum ersten Mal ein Spiel von IGDB abgerufen wird
					if (startIndex != -1) {
						setSelectedGame(startIndex);
					}

					// Wenn noch keine IGDB-ID vorhanden ist, ist auch noch kein Keyart vorhanden
					// => Setze das Keyart für gameDetails auf das Keyart des ersten geladenen
					// Spiels (selectedGame == 0)
					// => Notwendig, damit beim Speichern OHNE vorheriges durchschalten durch
					// die geladenen Spiele trotzdem ein Keyart gespeichert wird
					//
					// => Gleiches gilt für die IGDB-ID
					if (startIndex == -1) {
						const newGame: GameData = {
							...gameDetail,
							game_keyart: newGames[selectedGame].game_keyart,
							game_igdb_id: newGames[selectedGame].game_igdb_id,
						};

						setGameDetail(newGame);
					}
				} catch (error) {
					console.error('Error fetching games:', error);
					setNewGameDetail([]); // Handle error
				}
			};

			fetchGames().then(() => setEditMode(true));
		}
	}, [trigger]);

	// ################
	// #
	// # Array mit allen aktuellen Plattformen des Spiels
	// #
	// ###############
	const currentPlatforms = gameDetail.Platform.map((platform) => ({
		value: platform.platform_id,
		label: platform.platform_name,
	}));

	// ###################
	// #
	// # Array mit allen Plattformen zum befüllen des MultiSelect
	// #
	// ###################

	const allPlatforms = platforms.map((platform) => ({
		value: platform.platform_id,
		label: platform.platform_name,
	}));

	return (
		<Fragment>
			<div className={css.GameDetailWrapper}>
				{/* ###########################################################################
                #
                # Steuerleiste mit Spieletitel und den Buttons für Löschen und Edit/Save
                #
                ########################################################################### */}

				<div className={css.ControlPanel}>
					<div className={css.TitleContainer}>
						{/* Zeige im Edit-Mode den Titel des aktuell gewählten IGDB-Datensatzes an */}
						{!editMode ? (
							<h1 className={css.Title}>{game.game_name}</h1>
						) : (
							<h1 className={css.Title}>
								{newGameDetail[selectedGame].game_name}
							</h1>
						)}
					</div>
					<div className={css.BtnContainer}>
						<div>
							<button
								onClick={() =>
									handleDeleteGame(gameDetail).then(() =>
										router.push('/Spiele')
									)
								}
							>
								Löschen
							</button>
						</div>
						<div className={css.EmptyDiv}></div>
						<div>
							{!editMode ? (
								<button
									onClick={() => {
										setTrigger(trigger + 1);
									}}
								>
									Edit
								</button>
							) : (
								<button
									onClick={() => {
										handleSaveGame(gameDetail).then(() => setEditMode(false));
									}}
								>
									Speichern
								</button>
							)}
						</div>
					</div>
				</div>

				{/* ############################################################################
                #
                # Artwork und Buttons zum Spiele durchschalten im Edit-Mode 
                # Buttons werden nur im Edit-Mode angezeigt, wenn Daten von IGDB nachgeladen wurden
				# Es wird ein neues mögliches Spiel von IGDB ausgewählt, das Artwork angepasst
				# und die IGDB-ID in gameDetail überschrieben
                # 
                ########################################################################### */}

				<div className={css.DetailContainer}>
					<div className={css.ArtworkContainer}>
						{editMode && (
							<button
								className={css.SelectGameBtn}
								onClick={() => {
									const newSelectedGame = handleSelectGame(
										'prev',
										selectedGame,
										maxSelectedGame
									);
									setSelectedGame(newSelectedGame);

									const newGame: GameData = {
										...gameDetail,
										game_keyart: newGameDetail[newSelectedGame].game_keyart,
										game_igdb_id: newGameDetail[newSelectedGame].game_igdb_id,
									};

									setGameDetail(newGame);
								}}
							>
								<FaArrowAltCircleLeft />
							</button>
						)}

						{/* ######################################## 
                        # 
                        # Zeige im Edit-Mode das Artwork aus dem IGDB-Datensatz 
                        # 
                        ####################################### */}

						{!editMode ? (
							<img src={gameDetail.game_keyart} className={css.Artwork} />
						) : (
							<img
								src={newGameDetail[selectedGame].game_keyart}
								className={css.Artwork}
							/>
						)}
						{editMode && (
							<button
								className={css.SelectGameBtn}
								onClick={() => {
									const newSelectedGame = handleSelectGame(
										'next',
										selectedGame,
										maxSelectedGame
									);
									setSelectedGame(newSelectedGame);

									const newGame = {
										...gameDetail,
										game_keyart: newGameDetail[newSelectedGame].game_keyart,
										game_igdb_id: newGameDetail[newSelectedGame].game_igdb_id,
									};

									setGameDetail(newGame);
								}}
							>
								<FaArrowAltCircleRight />
							</button>
						)}
					</div>
					<div className={css.InfoContainer}>
						<table>
							<tbody>
								{/* ###################################
								# 
								# Release Date 
								# 
								################################### */}
								<tr>
									<td>Release:</td>
									<td>
										<input
											disabled={!editMode}
											type="text"
											className={css.InfoInput}
											value={gameDetail.game_release_date}
											onChange={(e) => {
												const newGame = {
													...gameDetail,
													game_release_date: e.target.value,
												};

												setGameDetail(newGame);
											}}
										></input>
									</td>
								</tr>
								{editMode && (
									<tr>
										<td></td>
										<td>
											<input
												type="text"
												className={css.InfoInput}
												value={newGameDetail[selectedGame].game_release_date}
												onChange={(e) => {
													const newGame = {
														...newGameDetail[selectedGame],
														game_release_date: e.target.value,
													};

													// setNewGameDetail(newGame);
												}}
											></input>
										</td>
									</tr>
								)}
								{/* ###################################
								# 
								# Plattformen
								# 
								################################### */}
								<tr>
									<td>Plattformen:</td>
									<td>
										<Select
											isDisabled={!editMode}
											options={allPlatforms}
											isMulti
											defaultValue={currentPlatforms}
											instanceId={'platforms'}
											onChange={(e) => {
												const newPlatforms: Platform[] = e.map(
													(selectedPlatform) => ({
														platform_id: selectedPlatform.value,
														platform_name: selectedPlatform.label,
														platform_image: platforms.find(
															(platform) =>
																platform.platform_id == selectedPlatform.value
														)!.platform_image,
														platform_type: platforms.find(
															(platform) =>
																platform.platform_id == selectedPlatform.value
														)!.platform_type,
													})
												);

												const newGame = {
													...gameDetail,
													Platform: newPlatforms,
												};

												setGameDetail(newGame);
											}}
										/>
									</td>
								</tr>
								{editMode && (
									<tr>
										<td></td>
										<td>
											<Select
												options={allPlatforms}
												isMulti
												value={newGameDetail[selectedGame].Platform.map(
													(platform) => ({
														value: platform.platform_id,
														label: platform.platform_name,
													})
												)}
												instanceId={'platforms'}
											/>
										</td>
									</tr>
								)}
								{/* ###################################
								# 
								# Beschreibung
								# 
								################################### */}
								<tr>
									<td>Beschreibung:</td>
									<td>
										<input
											disabled={!editMode}
											type="text"
											className={css.InfoInput}
											value={gameDetail.game_description}
											onChange={(e) => {
												const newGame = {
													...gameDetail,
													game_description: e.target.value,
												};

												setGameDetail(newGame);
											}}
										></input>
									</td>
								</tr>
								{/* ###################################
								# 
								# Export Ja/Nein
								# 
								################################### */}
								<tr>
									<td>Kein Export:</td>
									<td className={css.tdCentered}>
										<input
											disabled={!editMode}
											type="checkbox"
											checked={gameDetail.game_no_export}
											onChange={(e) => {
												const newGame = {
													...gameDetail,
													game_no_export: e.target.checked,
												};

												setGameDetail(newGame);
											}}
										></input>
									</td>
								</tr>
								<tr>
									<td>&nbsp;</td>
								</tr>
								{/* ########################### 
								# 
								# IGDB-Alias 
								#
								########################### */}
								<tr>
									<td>IGDB Alias</td>
									<td>
										<input
											disabled={!editMode}
											className={css.InfoInput}
											type="text"
										></input>
									</td>
								</tr>
								{/* ########################### 
								# 
								# IGDB-ID 
								#
								########################### */}
								<tr>
									<td>IGDB ID:</td>
									<td>
										<input
											disabled
											readOnly
											type="text"
											className={css.InfoInput}
											value={gameDetail.game_igdb_id}
										></input>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className={css.TrailerContainer}>
						Dies ist der Trailercontainer
						{gameDetail.Trailer.map((trailer) => (
							<section>{trailer.trailer_name}</section>
						))}
					</div>
					{editMode && (
						<div className={css.NewTrailerContainer}>
							Hier kommen die Trailer von IGDB
							{newGameDetail[selectedGame].Trailer.map((trailer) => (
								<section>{trailer.trailer_name}</section>
							))}
						</div>
					)}
				</div>
			</div>
		</Fragment>
	);
}

function handleSelectGame(dir: string, index: number, maxIndex: number) {
	// #######################
	// #
	// # Schaltet das angezeigte Spiel durch
	// #
	// #######################

	if (dir == 'prev') {
		if (index > 0) {
			return index - 1;
		} else {
			return maxIndex;
		}
	} else {
		if (index < maxIndex) {
			return index + 1;
		} else {
			return 0;
		}
	}
}

async function fetchGamesFromIGDB(
	gameDetail: GameData,
	platformData: Platform[]
) {
	// ##############################
	// #
	// # Sucht bei IGDB nach allen Datensätzen mit dem Spieletitel
	// # und gibt sie als Array zurück
	// #
	// ##############################

	const response = await fetch(
		`/api/IGDB/GetGames?game=${gameDetail.game_name}`,
		{
			method: 'POST',
		}
	);

	const newGameData = (await response.json()) as IGDBGameData[];

	const newGames: GameData[] = newGameData.map((fetchedgame) => {
		// #######################
		// #
		// # .map() über alle IGDBGameData-Objekte von der API
		// # und ergänze sie zu einem Array aus GameData[]-Objekten
		// #
		// #######################

		const gameName = fetchedgame.name;
		const igdbID = fetchedgame.id;
		const keyartURL = handleKeyartURL(fetchedgame);
		const releaseDate = handleDate(fetchedgame);
		const newTrailer: Trailer[] = handleIGDBTrailer(
			fetchedgame,
			gameDetail.game_id
		);

		console.log(newTrailer);

		const gamePlatforms = handlePlatforms(fetchedgame, platformData);

		const newGame: GameData = {
			...gameDetail,
			game_name: gameName,
			game_igdb_id: igdbID,
			game_keyart: keyartURL,
			game_release_date: releaseDate,
			game_update: false,
			Trailer: newTrailer,
			Platform: gamePlatforms as Platform[],
		};

		return newGame;
	});

	return newGames;
}

function handlePlatforms(fetchedgame: IGDBGameData, platformData: Platform[]) {
	// Überprüfe, ob überhaupt eine Platform mitgegeben wird
	if (!fetchedgame.platforms?.length) {
		return [
			{
				platform_id: 0,
				platform_name: 'Keine Platform',
				platform_image: 'Kein Bild',
				platform_type: 'PC',
			},
		];
	}

	// Gehe alle Plattformen durch
	const selectedPlatforms = fetchedgame.platforms
		.map((platform) => {
			// Überprüfe, ob die Plattform schon in der DB ist (= relevant ist)
			if (platformData.find((p) => p.platform_name === platform.name)) {
				// Ergänze das IGDB-Objekt mit den Daten aus der DB zu eimem Plattform-Objekt
				return {
					platform_name: platform.name,
					platform_id: platformData.find(
						(p) => p.platform_name === platform.name
					)!.platform_id,
					platform_image: platformData.find(
						(p) => p.platform_name === platform.name
					)!.platform_image,
					platform_type: platformData.find(
						(p) => p.platform_name === platform.name
					)!.platform_type,
				};
			}
		})
		// Filtere undefinied (das waren die nicht-relevante Plattformen)
		.filter((platform) => platform !== undefined);

	return selectedPlatforms;
}

function handleKeyartURL(game: IGDBGameData) {
	// #######################################
	// #
	// # IGDB API liefert immer nur die kleinste Version des Bildes,
	// # daher hier Anpassung der URL auf ein hochauflösendes Bild
	// # oder Rückgabe des Default-Covers
	// #
	// #######################################

	const remove = 't_thumb';
	const insert = 't_cover_big_2x';

	try {
		const newURL = game.cover.url.replace(remove, insert);
		return newURL;
	} catch {
		return 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/nocover.png';
	}
}

function handleDate(game: IGDBGameData) {
	// ###################################
	// #
	// # Releasedatum in deutsches Format ändern
	// #
	// ###################################

	try {
		const releaseDate = game.release_dates.find(() => true)!.human;
		try {
			// Versuche, in deutsches Format zu ändern
			const newDate = new Date(releaseDate);

			return newDate.toLocaleDateString('de-DE');
		} catch {
			// Wenn das nicht klappt, gib Originalformat zurück
			return releaseDate;
		}
	} catch {
		// Wenn kein Datum geliefert wird, gebe To be announced zurück
		return 'TBA';
	}
}

function handleIGDBTrailer(game: IGDBGameData, game_id: number) {
	// ###########################
	// #
	// # Erstellt ein Trailerobjekt zur Weiterverarbeitung und ordnet es über
	// # gameGame_id dem Spiel in der DB zu
	// #
	// ###########################

	try {
		const trailers: Trailer[] = game.videos.map((trailer) => {
			return {
				trailer_id: 0,
				trailer_name: trailer.name,
				trailer_url: trailer.video_id,
				trailer_delta: true,
				trailer_date: new Date(),
				gameGame_id: game_id,
			};
		});

		return trailers;
	} catch {
		const trailers: Trailer[] = [];
		return trailers;
	}
}

async function handleSaveGame(game: GameData) {
	// ####################################
	// #
	// # Speichere ein Spiel in der DB
	// #
	// ####################################

	const updateGame: GameData = {
		...game,
		game_delta: true,
		game_update: false,
	};

	const result = await fetch(`/api/Games/UpdateOrCreateGame`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(updateGame),
	});

	return result;
}

async function handleDeleteGame(game: GameData) {
	// ####################
	// #
	// # Entferne Spiel aus DB
	// #
	// ####################

	const result = await fetch(`/api/Games/DeleteGame`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(game),
	});

	return result;
}
