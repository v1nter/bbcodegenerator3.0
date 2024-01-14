import Link from 'next/link';
import { Fragment, ReactNode } from 'react';
import css from './layout.module.css';

type Props = {
	children: ReactNode;
};
export default function layout({ children }: Props) {
	return (
		<Fragment>
			<main className={css.main}>{children}</main>
			<br />
			<p>
				<Link className={css.Link} href="\Spiele">
					Zurück zu den Spielen
				</Link>
			</p>
		</Fragment>
	);
}
