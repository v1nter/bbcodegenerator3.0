'use client';
import { Fragment, useState } from 'react';
import css from './GameDetail.module.css';

import { Game } from '@prisma/client';

type Props = {
	game: Game;
};
export default function GameDetail({ game }: Props) {
	const [gameDetail, setGameDetail] = useState(game);

	return (
		<Fragment>
			<div className={css.GameDetailWrapper}>
				<div className={css.Title}>
					<h1>{game.game_name}</h1>
				</div>
				<div className={css.GameInfoWrapper}>
					<div className={css.ArtworkContainer}>
						<img src={game.game_keyart} className={css.Artwork} />
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
										></input>
									</td>
								</tr>
								<tr>
									<td>Kein Export</td>
									<td className={css.tdCentered}>
										<input
											type="checkbox"
											checked={gameDetail.game_no_export}
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
