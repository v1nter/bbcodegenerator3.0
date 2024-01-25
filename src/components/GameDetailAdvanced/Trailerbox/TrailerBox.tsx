'use client';

import css from './TrailerBox.module.css';

import type { Trailer } from '@prisma/client';
import type { GameData } from '@/app/lib/types';
import { SetStateAction, Dispatch } from 'react';

type Props = {
	game: GameData;
	trailer: Trailer;
	setGameDetail: Dispatch<SetStateAction<GameData>>;
	newTrailer?: Boolean;
	editMode: Boolean;
};
export default function Trailerbox({
	game,
	trailer,
	setGameDetail,
	newTrailer = false,
	editMode,
}: Props) {
	return (
		<div
			key={trailer.trailer_url}
			className={
				editMode
					? newTrailer
						? css.NewTrailerBox
						: css.OldTrailerBox
					: css.RegularTrailerBox
			}
		>
			{/* Input-Feld für Trailername */}
			{editMode && !newTrailer ? (
				<input
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

			{/* Button zum Hinzufügen/Entfernen des Trailers */}
			{editMode && (
				<button
					className={css.TrailerButton}
					onClick={() =>
						toggleTrailerStatus(
							trailer,
							game,
							newTrailer,
							editMode,
							setGameDetail
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

				{/* <button>Löschen</button> */}
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
	game: GameData,
	newTrailer: Boolean,
	editMode: Boolean,
	setGameDetail: Dispatch<SetStateAction<GameData>>
) {
	if (newTrailer) {
		// Handelt es sich um einen neuen Trailer, füge ihn dem Spiel hinzu
		const newGame: GameData = {
			...game,
			Trailer: [...game.Trailer, trailer],
		};

		setGameDetail(newGame);
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
