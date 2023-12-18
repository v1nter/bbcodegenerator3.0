import Link from 'next/link';
import { Fragment } from 'react';
import css from './page.module.css';
export default function page() {
	<Fragment>
		<h1>Events</h1>
		<div className={css.newPlatform}>
			<Link className={css.Link} href={'/Platform/neu'}>
				Neue Plattform anlegen
			</Link>
		</div>
		<div className={css.TableWrapper}>
			<table>
				<thead></thead>
				<tbody></tbody>
			</table>
		</div>
	</Fragment>;
}
