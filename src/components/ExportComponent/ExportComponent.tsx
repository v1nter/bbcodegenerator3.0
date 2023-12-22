'use client';

import { Game, Platform, Trailer, Event } from '@prisma/client';
import { Fragment } from 'react';
import css from './ExportComponent.module.css';
import triggerRevalidate from '@/app/lib/triggerRevalidate';
import {
	BBCODE_TABLE_TOP,
	BBCODE_TABLE_BOTTOM,
	BBCODE_EMPTY_ROW,
	BBCODE_TABLE_HEADER,
} from '@/app/lib/bbCode';

type GameData = Game & { Platform: Platform[] } & {
	Trailer: Trailer[];
} & { Event: Event };

type Props = {
	games: GameData[];
	event: Event;
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
	const bbCode = createBBCode(games, true);

	navigator.clipboard.writeText(bbCode).then(() => {
		const w = window.open(
			`https://forum.gamespodcast.de/posting.php?mode=reply&t=10337${event.event_updatePost}`,
			'_blank'
		);
		if (w) {
			w.focus();
		}
	});
}

function createBBCode(games: GameData[], delta = false) {
	if (delta) {
		let bbCode = 'Delta';
		return bbCode;
	} else {
		let bbCode = BBCODE_TABLE_TOP;
		bbCode = bbCode.concat(BBCODE_TABLE_HEADER);

		games.map((game) => {
			bbCode = bbCode.concat(
				`[tr][table=0][align=left][img]${handleKeyart(
					game.game_keyart
				)}[/img][/align][/table]`
			);
			bbCode = bbCode.concat('[table=0][align=left] [/align][/table]');
			bbCode =
				bbCode.concat(`[table=0][align=left][u]${game.game_name}[/u][/align][/table]
			[table=0][align=left] [/align][/table]`);

			game.Trailer.map((trailer) => {
				bbCode = bbCode.concat(
					`[table=0][align=left][url=https://www.youtube.com/watch?v=${trailer.trailer_url}]${trailer.trailer_name}[/url]`
				);
				// bbCode = bbCode.concat(BBCODE_EMPTY_ROW);
				bbCode = bbCode.concat('[/align][/table]');
			});
		});

		bbCode = bbCode.concat(BBCODE_TABLE_BOTTOM);

		return bbCode;
	}
}

function handleKeyart(url: string) {
	const remove = 't_cover_big_2x';
	const insert = 't_cover_big';

	const newURL = url.replace(remove, insert);

	return newURL;
}
