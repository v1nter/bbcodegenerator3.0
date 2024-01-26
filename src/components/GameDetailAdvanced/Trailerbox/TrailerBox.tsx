'use client';

import css from './TrailerBox.module.css';

import type { Trailer } from '@prisma/client';
import type { GameData } from '@/app/lib/types';
import { SetStateAction, Dispatch, useState } from 'react';

type Props = {
	game: GameData;
	trailer?: Trailer;
	setGameDetail: Dispatch<SetStateAction<GameData>>;
	newTrailer?: Boolean;
	emptyTrailer?: Boolean;
	editMode: Boolean;
};

// Falls kein Trailer übergeben wird, nutze den DummyTrailer
const dummyTrailer: Trailer = {
	trailer_id: 0,
	trailer_name: '',
	trailer_url: '',
	trailer_delta: true,
	trailer_date: new Date(),
	gameGame_id: 0,
};

export default function Trailerbox({
	game,
	trailer = dummyTrailer,
	setGameDetail,
	newTrailer = false,
	emptyTrailer = false,
	editMode,
}: Props) {
	const [newDummyTrailer, setNewDummyTrailer] = useState(dummyTrailer);

	return (
		<div
			key={trailer.trailer_url}
			// Legt die Rahmenfarbe der Trailerbox fest je nach Status
			// Regulär: Kein Rahmen
			// Bekannter Trailer: Grün
			// Neuer Trailer: Rot
			// Leere Trailerbox für manuelle Eingabe: Gelb
			className={
				editMode
					? newTrailer
						? css.NewTrailerBox
						: emptyTrailer
						? css.DummyTrailerBox
						: css.OldTrailerBox
					: css.RegularTrailerBox
			}
		>
			<div className={css.InputFields}>
				{/* Input-Feld für Trailername */}
				{editMode && !newTrailer && !emptyTrailer ? (
					<input
						placeholder="Trailername eingeben"
						className={css.TrailerName}
						type="text"
						value={trailer.trailer_name}
						onChange={(e) => {
							handleTrailerNameChange(
								e.target.value,
								trailer,
								game,
								setGameDetail
							);
						}}
					/>
				) : (
					<p className={css.TrailerName}>{trailer.trailer_name}</p>
				)}

				{editMode && emptyTrailer && (
					// DummyTrailer: Input-Feld für Trailer-Namen der leeren TrailerBox
					<input
						placeholder="Trailer Name eingeben"
						className={css.TrailerName}
						type="text"
						value={newDummyTrailer.trailer_name}
						onChange={(e) => {
							handleDummyTrailerChange(
								e.target.value,
								newDummyTrailer,
								'Name',
								setNewDummyTrailer
							);
						}}
					/>
				)}

				{editMode && emptyTrailer && (
					// DummyTrailer: Input-Feld für Trailer-URL der leeren TrailerBox
					<input
						placeholder="Trailer URL eingeben"
						className={css.TrailerUrl}
						type="text"
						value={newDummyTrailer.trailer_url}
						onChange={(e) => {
							handleDummyTrailerChange(
								e.target.value,
								newDummyTrailer,
								'URL',
								setNewDummyTrailer
							);
						}}
					/>
				)}
			</div>

			{/* Button zum Hinzufügen/Entfernen des Trailers */}
			{editMode && (
				<button
					className={css.TrailerButton}
					onClick={() =>
						toggleTrailerStatus(
							trailer,
							newDummyTrailer,
							game,
							newTrailer,
							editMode,
							emptyTrailer,
							setGameDetail,
							setNewDummyTrailer
						)
					}
				>
					Status ändern
				</button>
			)}

			<div className={css.TrailerButtons}>
				{/* // Checkbox für Delta */}
				<label htmlFor="Neu">Neu</label>
				<input
					disabled={!editMode}
					type="checkbox"
					id="Neu"
					checked={trailer.trailer_delta}
					onChange={(e) => {
						// Erstelle eine Kopie des Trailers mit geändertem Delta-Flag
						const newTrailer = {
							...trailer,
							trailer_delta: e.target.checked,
						};

						// Gehe das Trailerarray durch und ersetze den Trailer mit dem neu erstellten Trailer
						const newTrailers: Trailer[] = game.Trailer.map((trailer) => {
							if (trailer.trailer_id == newTrailer.trailer_id) {
								return newTrailer;
							} else {
								return trailer;
							}
						});

						// Kopiere das neue Trailerarray zurück nach gameDetails
						const newGame = {
							...game,
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
	trailer: Trailer,
	newDummyTrailer: Trailer,
	game: GameData,
	newTrailer: Boolean,
	editMode: Boolean,
	dummy: Boolean,
	setGameDetail: Dispatch<SetStateAction<GameData>>,
	setNewDummyTrailer: Dispatch<SetStateAction<Trailer>>
) {
	// Fügt einen Trailer hinzu oder entfernt ihn wieder

	if (newTrailer) {
		// Handelt es sich um einen neuen Trailer, füge ihn dem Spiel hinzu
		const newGame: GameData = {
			...game,
			Trailer: [...game.Trailer, trailer],
		};

		setGameDetail(newGame);
	} else if (dummy) {
		// Ansonsten handelt es sich um einen neuen Trailer, der manuell hinzugefügt werden soll
		const newTrailer = {
			...newDummyTrailer,
			gameGame_id: game.game_id,
		};

		const newGame: GameData = {
			...game,
			Trailer: [...game.Trailer, newTrailer],
		};

		setGameDetail(newGame);

		// Setze die DummyTrailerBox zurück
		setNewDummyTrailer(dummyTrailer);
	} else if (editMode) {
		// Ansonsten handelt es sich um einen alten Trailer, der entfernt werden soll
		const newTrailers = game.Trailer.filter(
			(t) => t.trailer_id != trailer.trailer_id
		);

		const newGame: GameData = {
			...game,
			Trailer: newTrailers,
		};

		setGameDetail(newGame);
	}
}

function handleTrailerNameChange(
	newName: string,
	trailer: Trailer,
	game: GameData,
	setGameDetail: Dispatch<SetStateAction<GameData>>
) {
	// Ändert den Namen eines bereits vorhandenen Trailers

	trailer.trailer_name = newName;

	const newTrailer: Trailer[] = game.Trailer.map((t) => {
		if (t.trailer_id == trailer.trailer_id) {
			return trailer;
		} else {
			return t;
		}
	});

	const newGame: GameData = {
		...game,
		Trailer: newTrailer,
	};

	setGameDetail(newGame);
}

function handleDummyTrailerChange(
	info: string,
	dummyTrailer: Trailer,
	infoType: string,
	setNewDummyTrailer: Dispatch<SetStateAction<Trailer>>
) {
	// Ändert Namen oder URL eines DummyTrailers

	if (infoType === 'URL') {
		const newDummyTrailer: Trailer = {
			...dummyTrailer,
			trailer_url: info,
		};

		setNewDummyTrailer(newDummyTrailer);
	} else if (infoType === 'Name') {
		const newDummyTrailer: Trailer = {
			...dummyTrailer,
			trailer_name: info,
		};

		setNewDummyTrailer(newDummyTrailer);
	}
}
