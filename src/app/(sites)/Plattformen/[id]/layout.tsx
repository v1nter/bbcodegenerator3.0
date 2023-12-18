import Link from 'next/link';
import { Fragment, ReactNode } from 'react';
import css from './layout.module.css';

type Props = {
	children: ReactNode;
};
export default function layout({ children }: Props) {
	return (
		<Fragment>
			<main>{children}</main>
			<br />
			<p>
				<Link className={css.Link} href="\Plattformen">
					Zurück zu den Plattformen
				</Link>
			</p>
		</Fragment>
	);
}
