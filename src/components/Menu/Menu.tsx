import { Fragment } from 'react';
import css from './Menu.module.css';

export default function Menu() {
	return (
		<Fragment>
			<div className={css.Menu}>
				<div className={css.Headline}>BBCode Generator 3.0</div>
				<div className={css.Navbar}>
					<div className={css.MenuItem}>Spiele</div>
					<div className={css.MenuItem}>Reihenupdate</div>
					<div className={css.MenuItem}>Export</div>
					<div className={css.MenuItem}>Events</div>
					<div className={css.MenuItem}>Plattformen</div>
				</div>
			</div>
		</Fragment>
	);
}
