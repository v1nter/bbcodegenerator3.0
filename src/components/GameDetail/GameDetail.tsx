'use client';
import { Fragment, useEffect, useState } from 'react';
import css from './GameDetail.module.css';

import { Game } from '@prisma/client';

type Props = {
	game: Game;
};
export default function GameDetail({ game }: Props) {
	const [gameDetail, setGameDetail] = useState(game);
	const [trigger, setTrigger] = useState(0);

	useEffect(() => {
		async function fetchGameDetails() {
			if (trigger > 0) {
				const response = await fetch(
					`/api/IGDB/GetGame?game=${gameDetail.game_name}`,
					{
						method: 'POST',
					}
				);

				const gameData = await response.json();

				const keyartURL = handleKeyartURL(gameData[0].cover.url);
				const releaseDate = handleDate(gameData[0].release_dates[0].human);

				const newGame = {
					...gameDetail,
					game_keyart: keyartURL,
					game_release_date: releaseDate,
				};

				setGameDetail(newGame);
			}
		}

		fetchGameDetails();
	}, [trigger]);

	return (
		<Fragment>
			<div className={css.GameDetailWrapper}>
				<div className={css.TitleContainer}>
					<h1 className={css.Title}>{gameDetail.game_name}</h1>
					<button
						className={css.Savebtn}
						onClick={() => handleSave(gameDetail)}
					>
						Speichern
					</button>
				</div>
				<div className={css.GameInfoWrapper}>
					<div className={css.ArtworkContainer}>
						<button
							className={css.IGDBbtn}
							onClick={() => setTrigger(trigger + 1)}
						>
							IGDB
						</button>
						<img src={gameDetail.game_keyart} className={css.Artwork} />
					</div>
					<div className={css.GameInfoTable}>
						<table>
							<tbody>
								<tr>
									<td>Release Date</td>
									<td>
										<input
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
								<tr>
									<td>Keyart</td>
									<td>
										<input
											type="text"
											className={css.InfoInput}
											value={gameDetail.game_keyart}
											onChange={(e) => {
												const newGame = {
													...gameDetail,
													game_keyart: e.target.value,
												};

												setGameDetail(newGame);
											}}
										></input>
									</td>
								</tr>
								<tr>
									<td>Beschreibung</td>
									<td>
										<input
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
								<tr>
									<td>Kein Export</td>
									<td className={css.tdCentered}>
										<input
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
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</Fragment>
	);
}

function handleKeyartURL(url: string) {
	const remove = 't_thumb';
	const insert = 't_cover_big_2x';

	const newURL = url.replace(remove, insert);

	return newURL;
}

function handleDate(date: string) {
	try {
		const newDate = new Date(date);

		return newDate.toLocaleDateString('de-DE');
	} catch {
		return date;
	}
}

async function handleSave(game: Game) {
	const result = await fetch(`/api/Games/UpdateOrCreateGame`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(game),
	});

	return result;
}
