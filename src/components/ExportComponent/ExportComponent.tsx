import { Game, Platform, Trailer, Event } from '@prisma/client';
import { Fragment } from 'react';
import css from './ExportComponent.module.css';

type GameData = Game & { Platform: Platform[] } & {
	Trailer: Trailer[];
} & { Event: Event };

type Props = {
	games: GameData[];
};
export default function ExportComponent({ games }: Props) {
	return (
		<Fragment>
			<h1>Export</h1>

			<div className={css.ExportWrapper}>
				<div className={css.MainTable}>
					<table className={css.Table}>
						<caption>Hauptexport</caption>
						<thead>
							<tr>
								<td>Spiel</td>
								<td>Trailer</td>
							</tr>
						</thead>
						<tbody>
							{games.map((game) => (
								<tr key={game.game_id}>
									<td>{game.game_name}</td>
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
					<table>
						<caption>Deltaexport</caption>
						<thead>
							<tr>
								<td>Spiel</td>
								<td>Trailer</td>
							</tr>
						</thead>
						<tbody>
							{/* {games.find((game: GameData) => ((game.game_delta == true))).map((game) => (
								<tr key={game.game_id}>
									<td>{game.game_name}</td>
								</tr>
							))} */}
						</tbody>
					</table>
				</div>
			</div>
		</Fragment>
	);
}
