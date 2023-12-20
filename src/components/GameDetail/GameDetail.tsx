'use client';
import { Fragment } from 'react';
import css from './GameDetail.module.css';

import { Game } from '@prisma/client';

type Props = {
	game: Game;
};
export default function GameDetail({ game }: Props) {
	return (
		<Fragment>
			<div className={css.GameDetailWrapper}>
				<div className={css.Title}>
					<h1>{game.game_name}</h1>
				</div>
				<div className={css.ArtworkContainer}>
					<img src={game.game_keyart} className={css.Artwork} />
				</div>
			</div>
		</Fragment>
	);
}
