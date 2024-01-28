'use client';

import { Event, Trailer } from '@prisma/client';
import type { GameData } from '@/app/lib/types';
import { Fragment } from 'react';
import css from './ExportComponent.module.css';
import triggerRevalidate from '@/app/lib/triggerRevalidate';
import {
	BBCODE_TABLE_TOP,
	BBCODE_TABLE_BOTTOM,
	BBCODE_EMPTY_ROW,
	BBCODE_TABLE_HEADER,
	BBCODE_END_ROW,
} from '@/app/lib/bbCode';

// type GameData = Game & { Platform: Platform[] } & {
// 	Trailer: Trailer[];
// } & { Event: Event };

type Props = {
	games: GameData[];
	event: Event; // Wird benötigt, um den zugehörigen Forenthread zu öffnen
};
export default function ExportComponent({ games, event }: Props) {
	// triggerRevalidate('/(sites)/Export/');

	return (
		<Fragment>
			<h1>Export</h1>

			<div className={css.ExportWrapper}>
				<div className={css.MainTable}>
					<table className={css.Table}>
						<caption>
							Hauptexport{' '}
							<button
								className={css.Postbtn}
								onClick={() => handlePostMain(games, event)}
							>
								Post
							</button>
						</caption>
						<thead>
							<tr>
								<td>Spiel</td>
								<td>Trailer</td>
							</tr>
						</thead>
						<tbody>
							{games.map((game) => (
								<tr key={game.game_id} className={css.gameRow}>
									<td className={css.gameRow}>{game.game_name}</td>
									<td>
										<table>
											<tbody>
												{game.Trailer.map((trailer) => (
													<tr key={trailer.trailer_url}>
														<td>{trailer.trailer_name}</td>
													</tr>
												))}
											</tbody>
										</table>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className={css.DeltaTable}>
					<table className={css.Table}>
						<caption>
							Deltaexport{' '}
							<button
								className={css.Postbtn}
								onClick={() => handlePostDelta(games, event)}
							>
								Post
							</button>
						</caption>
						<thead>
							<tr>
								<td>Spiel</td>
								<td>Trailer</td>
							</tr>
						</thead>
						<tbody>
							{games
								.filter((game) => game.game_delta == true)!
								.map((game) => (
									<tr key={game.game_id} className={css.gameRow}>
										<td className={css.gameRow}>{game.game_name}</td>
										<td>
											<table>
												<tbody>
													{game.Trailer.map((trailer) => (
														<tr key={trailer.trailer_url}>
															<td>{trailer.trailer_name}</td>
														</tr>
													))}
												</tbody>
											</table>
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</div>
		</Fragment>
	);
}

function handlePostMain(games: GameData[], event: Event) {
	const bbCode = createBBCode(games);

	navigator.clipboard.writeText(bbCode).then(() => {
		const w = window.open(
			`https://forum.gamespodcast.de/posting.php?mode=edit&${event.event_mainPost}`,
			'_blank'
		);
		if (w) {
			w.focus();
		}
	});
}

function handlePostDelta(games: GameData[], event: Event) {
	const bbCode = createBBCode(
		games.filter((game) => game.game_delta == true),
		true
	);

	navigator.clipboard
		.writeText(bbCode)
		.then(() => {
			const w = window.open(
				`https://forum.gamespodcast.de/posting.php?mode=reply&${event.event_updatePost}`,
				'_blank'
			);
			if (w) {
				w.focus();
			}
		})
		.then(() => handleDeleteDeltaFlags(games));
}

function handleDeleteDeltaFlags(games: GameData[]) {
	games.map((game) => {
		// Gehe alle Spiele durch und ändere die Delta-Flag auf False
		if (game.game_delta == true) {
			// Gehe alle Trailer durch und ändere die Delta-Flag auf False
			const newTrailers: Trailer[] = game.Trailer.map((trailer) => {
				if (trailer.trailer_delta == true) {
					return {
						...trailer,
						trailer_delta: false,
					};
				} else {
					return trailer;
				}
			});

			// Speichere das Spiel in der DB

			const updateGame: GameData = {
				...game,
				game_delta: false,
				Trailer: newTrailers,
			};

			handleSaveGame(updateGame);
		}
	});
}

async function handleSaveGame(game: GameData) {
	const result = await fetch(`/api/Games/UpdateOrCreateGame`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(game),
	});

	return result;
}

function createBBCode(games: GameData[], delta = false) {
	let bbCode = BBCODE_TABLE_TOP;
	bbCode += BBCODE_TABLE_HEADER;

	games.forEach((game) => {
		bbCode += `[tr][table=0][align=left][img]${handleKeyart(
			game.game_keyart
		)}[/img][/align][/table]`;
		// bbCode += `[table=0][align=left]${BBCODE_EMPTY_ROW}[/align][/table]`;
		bbCode += `[table=0][align=left][u]${game.game_name}[/u]\n\n`;
		bbCode += `→ ${game.game_release_date}\n`;
		bbCode += `→ ${game.game_description}\n[/align][/table]`;
		// bbCode += `[table=0][align=left]${BBCODE_EMPTY_ROW}[/align][/table]`;

		if (game.Trailer.length > 0) {
			bbCode += `[table=0][align=left]`;
			game.Trailer.sort((a, b) => {
				if (a.trailer_delta && !b.trailer_delta) {
					return -1; // a comes before b
				} else if (!a.trailer_delta && b.trailer_delta) {
					return 1; // a comes after b
				} else {
					return 0; // a and b have the same trailer_delta value
				}
			}).forEach((trailer) => {
				if (delta && trailer.trailer_delta) {
					bbCode += `[color=#FF0000]NEU:[/color][url=https://www.youtube.com/watch?v=${trailer.trailer_url}]${trailer.trailer_name}[/url]\n`;
				} else {
					bbCode += `[url=https://www.youtube.com/watch?v=${trailer.trailer_url}]${trailer.trailer_name}[/url]\n`;
				}
			});
			bbCode += `[/align][/table]`;
		} else {
			bbCode += `[table=0][align=left] [/align][/table]`;
		}

		// bbCode += `[table=0][align=left]${BBCODE_EMPTY_ROW}[/align][/table]`;
		bbCode += `[table=0][align=left]`;
		game.Platform.forEach((platform) => {
			bbCode += `[img]${platform.platform_image}[/img]\n`;
		});
		bbCode += `[/align][/table][/tr]`;
		// bbCode += BBCODE_END_ROW;
	});

	bbCode += BBCODE_TABLE_BOTTOM;

	return bbCode;
	// }
}

function handleKeyart(url: string) {
	const remove = 't_cover_big_2x';
	const insert = 't_cover_big';

	const newURL = url.replace(remove, insert);

	return newURL;
}
