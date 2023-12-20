'use client';

import { Fragment } from 'react';
import css from './GameList.module.css';
import { Game, Platform } from '@prisma/client';
import { RxUpdate } from 'react-icons/rx';
import Link from 'next/link';

type Props = {
	games: (Game & { Platform: Platform[] })[];
};
export default function GameList({ games }: Props) {
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
										<td className={css.ExtendedCol}>
											<ul className={css.ExtendetList}>
												<li>{game.game_release_date}</li>
											</ul>
											<ul className={css.ExtendetList}>
												{game.Platform.map((platform) => (
													<li>{platform.platform_name}</li>
												))}
											</ul>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className={css.GameArtworkContainer}>
							<button className={css.UpdateBtn}>
								<RxUpdate className={css.ButtonIcon} /> Update
							</button>
							<Link
								className={css.GameArtWorkLink}
								href={`/Spiele/${game.game_id}`}
							>
								<img src={game.game_keyart} className={css.GameArtwork} />
							</Link>
						</div>
					</div>
				))}
			</div>
		</Fragment>
	);
}
