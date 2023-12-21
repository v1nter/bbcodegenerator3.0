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

				const newGame = {
					...gameDetail,
					game_keyart: gameData[0].cover.url,
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
				</div>
				<div className={css.GameInfoWrapper}>
					<div className={css.ArtworkContainer}>
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
								<tr>
									<td>
										<button onClick={() => setTrigger(trigger + 1)}>
											Update
										</button>
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

function handleCoverURL(url: string) {}
