'use client';
import type { GameData, IGDBGameData, IGDBPlatform } from '@/app/lib/types';
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';
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

// Todo:
// 01. game.game_delta: Es darf nicht immer game_delta = true gesetzt werden, sondern nur dann, wenn sich was geändert hat
// 		=> Bei jeder Änderung an gameDetail eine Hilfsfunktion aufrufen, die game.game_delta auf true setzt
// 02. Trailer löschen
// 03. Eine leere Trailerbox einbauen, in die Trailername + Trailer-URL eingetragen werden können. Dazu Speichern-Button
// 04. Trailer ignorieren einbauen
// 05. Ist Trailer-Delta korrekt eingebaut?
// 06. Kein Export einbauen
// 07. Buttons mit CSS stylen
// 08. Speichern mit Reihenupdate einbauen
// 09. Buttons zum Übernehmen der IGDB-Daten einbauen
// 10. Select-Boxen mit CSS Stylen
// 11. game_descriptions automatisch mit /n Zeilenumbrüchen ergänzen, um die Beschreibung nicht zu breit werden zu lassen
// 12. Trailernamen anpassbar machen
// -------------------------------------
// Sicherstellen, dass stets nur ein Event aktuell ist
// Delta impementieren inkl. Änderung des Status nach dem Posten
// Funktion implementieren, die Spiele aus vergangenen Events in das aktuelle Event holt
// Überall Revalidate überprüfen
// Kommentieren, Kommentieren, Kommentiere
// Refactoring überall da, wo in HTML komplexe Funktionen aufgerufen werden
// Imgur
// Warum werden in der Spieleliste immer kurz alle Spiele angezeigt?

export default function GameDetailAdvanced({ game, platforms }: Props) {
	const [gameDetail, setGameDetail] = useState(game); // Beinhaltet die Daten des Spiels aus DB => wird (ggf. modifiziert) auch wieder in DB gespeichert
	const [trigger, setTrigger] = useState(0); // Trigger zum Nachladen von Daten per API
	const [newGameDetail, setNewGameDetail] = useState<GameData[]>([]); // Enthält die Spieldaten der IGDB-API
	const [selectedGame, setSelectedGame] = useState(0); // Merkt sich, welches IGDB-Spiel via Pfeiltasten ausgewählt wurde
	const [maxSelectedGame, setMaxSelectedGame] = useState(0); // Höchster Index des IGDB-Arrays
	const [editMode, setEditMode] = useState(false); // Edit-Mode: Im Edit-Mode ändert sich die Anzeige und die Datenquelle
	const router = useRouter();

	triggerRevalidate('(sites)/Spiele/[id]');

	useEffect(() => {
		/* #region Lädt Spieldaten von IGDB und speichert sie in newGameDetail */

		if (trigger > 0) {
			// ############################
			// #
			// # Holt sich die neuen Spiele bei IGDB, die zum Suchbegriff passen
			// # und speichert sie als Array in newGameDetail
			// # Soll nicht beim ersten Laden der Komponente ausgelöst werden, daher der Trigger
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

		/* #endregion */
	}, [trigger]);

	// # Array mit allen aktuellen Plattformen des Spiels (=gameDetail)
	const currentPlatforms = gameDetail.Platform.map((platform) => ({
		value: platform.platform_id,
		label: platform.platform_name,
	}));

	// # Array mit allen Plattformen zum befüllen des MultiSelect
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
					{/* #region ControlPanel */}

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
										handleSaveGame(gameDetail)
											.then(() => setEditMode(false))
											.then(() => handleSaveTrailer(gameDetail))
											.then(() => router.push('/Spiele'));
									}}
								>
									Speichern
								</button>
							)}
						</div>
					</div>

					{/* #endregion */}
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
								// Button zum zurückschalten
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
								// Button zum vorschalten
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
				</div>
				{/* ###################################
				#
				# Trailer 
				# 
				################################### */}
				<div className={css.TrailerContainer}>
					{/* // Zeige alle Trailer an, die sich im gameDetail befinden */}

					{gameDetail.Trailer.map((trailer) => (
						<div key={trailer.trailer_url} className={css.TrailerBox}>
							<p className={css.TrailerName}>{trailer.trailer_name}</p>
							<div className={css.TrailerButtons}>
								<button>Löschen</button>
							</div>
							<iframe
								className={css.Trailer}
								src={`https://www.youtube.com/embed/${trailer.trailer_url}`}
								title="YouTube video player"
							></iframe>
						</div>
					))}
				</div>
				{editMode && (
					// Zeige alle Trailer an, die sich im newGameDetail befinden
					// außer denen, die bereits in gameDetail vorhanden sind

					<div className={css.NewTrailerContainer}>
						{newGameDetail[selectedGame].Trailer.filter(
							(trailer) =>
								!gameDetail.Trailer.some(
									(existingTrailer) =>
										existingTrailer.trailer_url === trailer.trailer_url
								)
						).map((trailer) => (
							<div key={trailer.trailer_url} className={css.TrailerBox}>
								<p className={css.TrailerName}>{trailer.trailer_name}</p>
								<div className={css.TrailerButtons}>
									<button
										onClick={() =>
											handleAddTrailer(trailer, gameDetail, setGameDetail)
										}
									>
										Übernehmen
									</button>
									<button>Ignorieren</button>
								</div>
								<iframe
									className={css.Trailer}
									src={`https://www.youtube.com/embed/${trailer.trailer_url}`}
									title="YouTube video player"
								></iframe>
							</div>
						))}
					</div>
				)}
			</div>
		</Fragment>
	);
}

function handleSelectGame(dir: string, index: number, maxIndex: number) {
	// #######################
	// #
	// # Schaltet durch die Spiele, die von IGDB geladen wurden
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
	// #######################
	// #
	// # Füllt das <Select>-Element mit den Plattformen von IGDB
	// #
	// #######################

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

		if (releaseDate === 'TBD') {
			return 'TBA';
		}

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
	// # Erstellt ein Array aus Trailerobjekten
	// # Daten werden geliefert von IGDB
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

	console.log(game);

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

function handleAddTrailer(
	trailer: Trailer,
	gameDetail: GameData,
	setGameDetail: Dispatch<SetStateAction<GameData>>
) {
	// ########################
	// #
	// # Wird per Button aufgerufen und fügt IGDB Trailer dem gameDetail-Objekt hinzu
	// #
	// ########################

	const newGame: GameData = {
		...gameDetail,
		Trailer: [...gameDetail.Trailer, trailer],
	};

	setGameDetail(newGame);
}

function handleSaveTrailer(game: GameData) {
	game.Trailer.map((trailer) => saveTrailer(trailer));
}

async function saveTrailer(trailer: Trailer) {
	// Speichere Trailer aus gameDetail in der DB
	const result = await fetch(`/api/Trailer/UpdateOrCreateTrailer`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(trailer),
	});
}
