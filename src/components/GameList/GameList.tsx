'use client';

// https://images.igdb.com/igdb/image/upload/t_cover_big/nocover.png

import { Fragment, useEffect, useState } from 'react';
import css from './GameList.module.css';
import { Game, Platform } from '@prisma/client';
import { RxUpdate } from 'react-icons/rx';
import Link from 'next/link';
import triggerRevalidate from '@/app/lib/triggerRevalidate';
import { useDebouncedValue } from '@/app/lib/useDebouncedValue';

type GameData = Game & { Platform: Platform[] };

type Props = {
	games: GameData[];
};

export const dynamic = 'force-dynamic';

export default function GameList({ games }: Props) {
	const [gameState, setGameState] = useState(games);
	const [filter, setFilter] = useState('');
	const debouncedFilter = useDebouncedValue(filter, 600);

	// triggerRevalidate('/(sites)/Spiele/');

	useEffect(() => {
		async function fetchGames() {
			if (!debouncedFilter) {
				const response = await fetch(`/api/Games/GetGames?filter=`);
				const data = (await response.json()) as GameData[];
				setGameState(data);
			} else {
				const response = await fetch(
					`/api/Games/GetGames?filter=${debouncedFilter}`
				);
				const data = (await response.json()) as GameData[];
				setGameState(data);
			}
		}

		fetchGames();
	}, [debouncedFilter]);

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
						value={filter}
						onChange={(e) => setFilter(e.target.value)}
					></input>
					<button className={css.ResetBtn} onClick={() => setFilter('')}>
						Reset
					</button>
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
									handleUpdateFlag(game);
									const updateGameState = changeUpdateFlag(game, gameState);
									setGameState(updateGameState);
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
	return;
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
