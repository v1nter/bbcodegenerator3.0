import { Fragment, StrictMode } from 'react';
import css from './page.module.css';
import { checkEnvironment } from './lib/checkEnvironment';

import { Game, Platform } from '@prisma/client';

const host = checkEnvironment();
export const dynamic = 'force-dynamic';

export default async function Home() {
	const response = await fetch(`${host}/api/Games/GetGames`);
	const data = (await response.json()) as (Game & { Platform: Platform[] })[];

	return (
		<StrictMode>
			<Fragment>
				<div className={css.HomeWrapper}>
					<h1>BBCodeGenerator 3.0</h1>

					<div className={css.CoverWrapper}>
						{data.map((game: Game) => (
							<img key={game.game_id} src={handleKeyartURL(game.game_keyart)} />
						))}
					</div>
				</div>
			</Fragment>
		</StrictMode>
	);
}

function handleKeyartURL(url: string) {
	const insert = 't_cover_big';
	const remove = 't_cover_big_2x';

	const newURL = url.replace(remove, insert);

	return newURL;
}
