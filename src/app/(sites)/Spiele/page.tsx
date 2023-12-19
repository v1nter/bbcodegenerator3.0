import { checkEnvironment } from '@/app/lib/checkEnvironment';
import triggerRevalidate from '@/app/lib/triggerRevalidate';
import { Game } from '@prisma/client';
import { Fragment } from 'react';
import css from './page.module.css';
import { RxUpdate } from 'react-icons/rx';

export const dynamic = 'force-dynamic';
const host: string = checkEnvironment();

export default async function Games() {
	triggerRevalidate('/(sites)/Spiele');

	const response = await fetch(`${host}/api/Games/GetGames`);
	const games = (await response.json()) as Game[];

	return (
		<Fragment>
			<h1>Spiele</h1>
			<div className={css.GamesWrapper}>
				{games.map((game) => (
					<div className={css.GameInfos} key={game.game_id}>
						<div>
							<table className={css.InfoTable}>
								<tbody>
									<tr>
										<td className={css.InfoTableValue}>{game.game_name}</td>
										<td className={css.InfoTableValue}>
											<button className={css.UpdateBtn}>
												<RxUpdate className={css.BtnIcon} />
											</button>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className={css.GameArtworkContainer}>
							<img src={game.game_keyart} className={css.GameArtwork} />
						</div>
					</div>
				))}
			</div>
		</Fragment>
	);
}
