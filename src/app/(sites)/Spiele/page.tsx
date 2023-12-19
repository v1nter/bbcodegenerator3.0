import { checkEnvironment } from '@/app/lib/checkEnvironment';
import triggerRevalidate from '@/app/lib/triggerRevalidate';
import { Game, Platform } from '@prisma/client';
import { Fragment } from 'react';
import css from './page.module.css';
import Link from 'next/link';
import { RxUpdate, RxMagnifyingGlass } from 'react-icons/rx';

export const dynamic = 'force-dynamic';
const host: string = checkEnvironment();

export default async function Games() {
	triggerRevalidate('/(sites)/Spiele');

	const response = await fetch(`${host}/api/Games/GetGames`);
	const test = await fetch(`${host}/api/Games/GetGames`);

	console.log(await test.json());

	const games = (await response.json()) as Game[];

	return (
		<Fragment>
			<div className={css.ControlPanel}>
				<div className={css.TitleContainer}>
					<h1 className={css.Title}>Spiele</h1>
				</div>
				<div className={css.FilterContainer}>
					<input
						type="text"
						className={css.Filter}
						placeholder={'Filter...'}
					></input>
					<button className={css.ResetBtn}>Reset</button>
				</div>
				<div className={css.EmptyContainer}></div>
			</div>
			<div className={css.GamesWrapper}>
				{games.map((game) => (
					<div className={css.GameInfos} key={game.game_id}>
						<div className={css.GameInfoTableContainer}>
							<table className={css.InfoTable}>
								<tbody>
									<tr>
										<td className={css.GameName}>{game.game_name}</td>
									</tr>
									<tr className={css.Extended}>
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
