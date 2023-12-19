import { checkEnvironment } from '@/app/lib/checkEnvironment';
import triggerRevalidate from '@/app/lib/triggerRevalidate';
import { Game, Platform, GamePlatform } from '@prisma/client';
import { Fragment } from 'react';
import css from './page.module.css';
import Link from 'next/link';
import { RxUpdate } from 'react-icons/rx';

export const dynamic = 'force-dynamic';
const host: string = checkEnvironment();

export default async function Games() {
	triggerRevalidate('/(sites)/Spiele');

	const response = await fetch(`${host}/api/Games/GetGames`);
	// const test = await fetch(`${host}/api/Games/GetGames`);

	// console.log(await test.json());

	const games = (await response.json()) as Game[];

	return (
		<Fragment>
			<h1>Spiele</h1>
			<div className={css.GamesWrapper}>
				{games.map((game) => (
					<div className={css.GameInfos} key={game.game_id}>
						<div className={css.GameInfoTableContainer}>
							<table className={css.InfoTable}>
								<tbody>
									<tr>
										<td className={css.InfoTableValue}>{game.game_name}</td>
									</tr>
									<tr className={css.InfoTableValueExtended}>
										<td className={css.InfoTableValue}>
											{game.game_release_date}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className={css.GameArtworkContainer}>
							<button className={css.UpdateBtn}>
								<RxUpdate className={css.ButtonIcon} /> Update
							</button>
							<Link className={css.GameArtWorkLink} href="/Spiele">
								<img src={game.game_keyart} className={css.GameArtwork} />
							</Link>
						</div>
					</div>
				))}
			</div>
		</Fragment>
	);
}
