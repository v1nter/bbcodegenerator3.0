import { Fragment, ReactNode } from 'react';
import css from './layout.module.css';

type Props = {
	children: ReactNode;
};
export default function layout({ children }: Props) {
	return (
		<Fragment>
			<main className={css.siteLayout}>{children}</main>
		</Fragment>
	);
}
