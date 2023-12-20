'use client';

import { Fragment, useState } from 'react';
import css from './GameList.module.css';
import { Game, Platform } from '@prisma/client';
import { RxUpdate } from 'react-icons/rx';
import Link from 'next/link';
import triggerRevalidate from '@/app/lib/triggerRevalidate';
import { useRouter } from 'next/navigation';

type GameData = Game & { Platform: Platform[] };

type Props = {
	games: GameData[];
};

export const dynamic = 'force-dynamic';

export default function GameList({ games }: Props) {
	const [gameState, setGameState] = useState(games);
	const router = useRouter();

	// console.log(JSON.stringify(gameState));

	triggerRevalidate('/(sites)/Spiele/');

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
				{gameState.map((game) => (
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
													<li key={platform.platform_id}>
														{platform.platform_name}
													</li>
												))}
											</ul>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className={css.GameArtworkContainer}>
							<button
								className={
									game.game_update ? css.UpdateBtnActive : css.UpdateBtnInactive
								}
								onClick={() => {
									const updateGameState = changeUpdateFlag(game, gameState);
									setGameState(updateGameState);

									handleUpdateFlag(game);
									// router.refresh();
								}}
							>
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

async function handleUpdateFlag(game: GameData) {
	const updateToggle = !game.game_update;

	const updateGame = {
		...game,
		game_update: updateToggle,
	};

	const result = await fetch(`/api/Games/UpdateOrCreateGame`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(updateGame),
	});

	triggerRevalidate('/(sites)/Spiele/');
}

function changeUpdateFlag(game: GameData, gameState: GameData[]) {
	const thisGame = gameState.find(
		(obj) => obj.game_id === game.game_id
	) as GameData;

	const updateGame = {
		...thisGame,
		game_update: !thisGame.game_update,
	};

	const updateGameState = gameState.map((obj) =>
		obj.game_id === updateGame.game_id ? updateGame : obj
	);

	return updateGameState;
}
