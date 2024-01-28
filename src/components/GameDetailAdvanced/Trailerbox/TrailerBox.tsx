'use client';

import css from './TrailerBox.module.css';

import type { Trailer } from '@prisma/client';
import type { GameData } from '@/app/lib/types';
import { SetStateAction, Dispatch, useState, useEffect } from 'react';

type Props = {
	gameDetail: GameData;
	newGameDetail: GameData[];
	selectedGame: number;
	trailer?: Trailer;
	setGameDetail: Dispatch<SetStateAction<GameData>>;
	setNewGameDetail: Dispatch<SetStateAction<GameData[]>>;
	isNewTrailer: Boolean;
	isDummyTrailer: Boolean;
	isEditMode: Boolean;
};

// Falls kein Trailer übergeben wird, nutze den DummyTrailer
const dummy: Trailer = {
	trailer_id: 0,
	trailer_name: '',
	trailer_url: '',
	trailer_delta: true,
	trailer_date: new Date(),
	gameGame_id: 0,
};

export default function TrailerBox({
	gameDetail,
	newGameDetail,
	selectedGame,
	trailer = dummy,
	setGameDetail,
	setNewGameDetail,
	isNewTrailer,
	isDummyTrailer,
	isEditMode,
}: Props) {
	const [trailerDetail, setTrailerDetail] = useState(trailer);

	// const [dummyDetail, setDummyDetail] = useState(dummy);

	useEffect(() => {
		// trailer kommt von außen.
		// => Wenn trailer sich ändert, muss auch Trailer-Detail aktualisiert werden
		setTrailerDetail(trailer);
	}, [trailer]);

	return (
		<div
			// key={trailerDetail.trailer_url}
			// Legt die Rahmenfarbe der Trailerbox fest je nach Status
			// Regulär: Kein Rahmen
			// Bekannter Trailer: Grün
			// Neuer Trailer: Rot
			// Leere Trailerbox für manuelle Eingabe: Gelb
			className={
				isNewTrailer && isDummyTrailer
					? css.DummyTrailerBox
					: isNewTrailer && !isDummyTrailer
					? css.NewTrailerBox
					: isEditMode
					? css.OldTrailerBox
					: css.RegularTrailerBox
			}
		>
			<div className={css.InputFields}>
				{/* Input-Feld für Trailername */}
				{isEditMode ? (
					<input
						placeholder="Trailername eingeben"
						className={css.TrailerName}
						type="text"
						value={trailerDetail.trailer_name}
						onChange={(e) => {
							handleTrailerChange(
								e.target.value,
								trailerDetail,
								'Name',
								setTrailerDetail,
								gameDetail,
								setGameDetail,
								newGameDetail,
								selectedGame,
								setNewGameDetail,
								isNewTrailer
							);
						}}
					/>
				) : (
					<p className={css.TrailerName}>{trailerDetail.trailer_name}</p>
				)}

				{isEditMode && isDummyTrailer && (
					// DummyTrailer: Input-Feld für Trailer-URL der leeren TrailerBox
					<input
						placeholder="Trailer URL eingeben"
						className={css.TrailerUrl}
						type="text"
						value={trailerDetail.trailer_url}
						onChange={(e) => {
							handleTrailerChange(
								e.target.value,
								trailerDetail,
								'URL',
								setTrailerDetail,
								gameDetail,
								setGameDetail,
								newGameDetail,
								selectedGame,
								setNewGameDetail,
								isNewTrailer
							);
						}}
					/>
				)}
			</div>

			{/* Button zum Hinzufügen/Entfernen des Trailers */}
			{isEditMode && (
				<button
					className={css.TrailerButton}
					onClick={() =>
						toggleTrailerStatus(
							trailerDetail,
							gameDetail,
							isNewTrailer,
							isDummyTrailer,
							isEditMode,
							setTrailerDetail,
							setGameDetail
						)
					}
				>
					Status ändern
				</button>
			)}

			<div className={css.TrailerButtons}>
				{/* // Checkbox für Delta */}
				<label htmlFor="Neu">Neuer Trailer</label>
				<input
					disabled={Boolean(!isEditMode || isNewTrailer || isDummyTrailer)}
					type="checkbox"
					id="Neu"
					checked={trailerDetail.trailer_delta}
					onChange={(e) => {
						// Erstelle eine Kopie des Trailers mit geändertem Delta-Flag
						const newTrailer = {
							...trailerDetail,
							trailer_delta: e.target.checked,
						};

						// Gehe das Trailerarray durch und ersetze den Trailer mit dem neu erstellten Trailer
						const newTrailers: Trailer[] = gameDetail.Trailer.map((trailer) => {
							if (trailer.trailer_url === newTrailer.trailer_url) {
								return newTrailer;
							} else {
								return trailer;
							}
						});

						// Kopiere das neue Trailerarray zurück nach gameDetails
						const newGame = {
							...gameDetail,
							Trailer: newTrailers,
						};

						setGameDetail(newGame);
					}}
				/>
			</div>

			<iframe
				className={css.Trailer}
				src={`https://www.youtube.com/embed/${trailer.trailer_url}`}
				title="YouTube video player"
			></iframe>
		</div>
	);
}

function toggleTrailerStatus(
	trailerDetail: Trailer,
	game: GameData,
	isNewTrailer: Boolean,
	isDummyTrailer: Boolean,
	isEditMode: Boolean,
	setTrailerDetail: Dispatch<SetStateAction<Trailer>>,
	setGameDetail: Dispatch<SetStateAction<GameData>>
) {
	// Fügt einen Trailer hinzu oder entfernt ihn wieder

	if (isNewTrailer || isDummyTrailer) {
		// Handelt es sich um einen neuen Trailer, füge ihn dem Spiel hinzu

		const newTrailer = {
			...trailerDetail,
			gameGame_id: game.game_id,
		};

		const newGame: GameData = {
			...game,
			Trailer: [...game.Trailer, newTrailer],
		};

		setGameDetail(newGame);

		if (isDummyTrailer) {
			setTrailerDetail(dummy);
		}
	} else if (isEditMode) {
		// Ansonsten handelt es sich um einen alten Trailer, der entfernt werden soll
		const newTrailers = game.Trailer.filter(
			(t) => t.trailer_id != trailerDetail.trailer_id
		);

		const newGame: GameData = {
			...game,
			Trailer: newTrailers,
		};

		setGameDetail(newGame);
	}
}

function handleTrailerChange(
	info: string,
	trailerDetail: Trailer,
	infoType: string,
	setTrailerDetail: Dispatch<SetStateAction<Trailer>>,
	gameDetail: GameData,
	setGameDetail: Dispatch<SetStateAction<GameData>>,
	newGameDetail: GameData[],
	selectedGame: number,
	setNewGameDetail: Dispatch<SetStateAction<GameData[]>>,
	isNewTrailer: Boolean
) {
	// Ändert Namen oder URL eines Trailers

	if (infoType === 'URL') {
		// Die URL kann nur bei einem DummyTrailer geändert werden,
		// daher müssen nicht die von außen stammenden Daten aus game
		// geändert werden

		const newTrailer: Trailer = {
			...trailerDetail,
			trailer_url: info,
		};

		setTrailerDetail(newTrailer);
	} else if (infoType === 'Name') {
		// Dreigeteilte Logik:
		// 1. Bei einem DummyTrailer wird nur der lokate State geupdated
		//
		// 2. Handelt es sich um einen Trailer von IGDB, so werden die Daten von außen
		// an die TrailerBox geliefert. => Es muss auch newGameDetail geändert werden,
		// der von außen kommt.
		//
		// 3. Handelt es sich um einen Trailer aus der DB, so werden die daten von außen
		// an die TrailerBox geliefert => Es muss gameDetail geändert werden, der von außen
		// kommt

		const newTrailer: Trailer = {
			...trailerDetail,
			trailer_name: info,
		};

		if (trailerDetail.gameGame_id === 0) {
			// Ist die game_id === 0, ist es ein DummyTrailer und nur der lokale State muss
			// überschrieben werden.
			setTrailerDetail(newTrailer);
		} else if (trailerDetail.gameGame_id !== 0 && isNewTrailer === true) {
			// Wenn es sich um einen Trailer aus IGDB handelt, muss der Name in newGameDetail geändert werden

			const trailers: Trailer[] = newGameDetail[selectedGame].Trailer.filter(
				(trailer) =>
					!gameDetail.Trailer.some(
						(existingTrailer) =>
							existingTrailer.trailer_url === trailer.trailer_url
					)
			).map((t) => {
				if (t.trailer_url === newTrailer.trailer_url) {
					return newTrailer;
				} else {
					return t;
				}
			});
			// console.log(trailers);

			const newGame: GameData = {
				...newGameDetail[selectedGame],
				Trailer: trailers,
			};

			const newGames: GameData[] = newGameDetail.map((g) => {
				if (g.game_id === newGame.game_id) {
					return newGame;
				} else {
					return g;
				}
			});

			setNewGameDetail(newGames);
		} else if (trailerDetail.gameGame_id !== 0 && isNewTrailer === false) {
			// Wenn es sich um einen Trailer aus der DB handelt, muss der Name in gameDetail geändert werden

			const newGame = {
				...gameDetail,
				Trailer: gameDetail.Trailer.map((t) => {
					if (t.trailer_id === trailerDetail.trailer_id) {
						return newTrailer;
					} else {
						return t;
					}
				}),
			};

			setGameDetail(newGame);
		}
	}
}
