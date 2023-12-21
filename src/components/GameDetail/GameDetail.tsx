'use client';
import { Fragment, useEffect, useState } from 'react';
import css from './GameDetail.module.css';
import { useRouter } from 'next/navigation';

import { Game } from '@prisma/client';
import triggerRevalidate from '@/app/lib/triggerRevalidate';

type combinedGame = GameData & { videos: Video[] } & {
	release_dates: ReleaseDate[];
} & { platforms: Platform[] } & { cover: Cover };

type Props = {
	game: Game;
};

type Video = {
	name: string;
	video_id: string;
};

type ReleaseDate = {
	human: string;
};

type Platform = {
	name: string;
};

type Cover = {
	url: string;
};

type GameData = {
	name: string;
};

export const dynamic = 'force-dynamic';

export default function GameDetail({ game }: Props) {
	const [gameDetail, setGameDetail] = useState(game);
	const [trailerState, setTrailerState] = useState<Array<Video>>([]);
	const [trigger, setTrigger] = useState(0);
	const router = useRouter();

	// triggerRevalidate('(sites)/Spiele/[id]');

	useEffect(() => {
		async function fetchGameDetails() {
			if (trigger > 0) {
				const response = await fetch(
					`/api/IGDB/GetGame?game=${gameDetail.game_name}`,
					{
						method: 'POST',
					}
				);

				const gameData = (await response.json()) as combinedGame[];

				gameData[0].videos.map((video: Video) => {
					const newVideo: Video = {
						name: video.name,
						video_id: video.video_id,
					};

					console.log(newVideo);

					setTrailerState([...trailerState, newVideo]);
					console.log(trailerState);
				});

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
			<div className={css.ControlPanel}>
				<div className={css.DeleteContainer}>
					<button
						className={css.DeleteBtn}
						onClick={() =>
							handleDelete(gameDetail).then(() => router.push('/Spiele'))
						}
					>
						Löschen
					</button>
				</div>
				<div className={css.TitleContainer}>
					<h1 className={css.Title}>{gameDetail.game_name}</h1>
				</div>
				<div className={css.SaveContainer}>
					<button
						className={css.Savebtn}
						onClick={() =>
							handleSave(gameDetail).then(() => router.push('/Spiele'))
						}
					>
						Speichern
					</button>
				</div>
			</div>
			<div className={css.GameDetailWrapper}>
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

async function handleDelete(game: Game) {
	const result = await fetch(`/api/Games/DeleteGame`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(game),
	});

	return result;
}
