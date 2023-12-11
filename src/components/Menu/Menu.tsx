import { Fragment } from 'react';
import css from './Menu.module.css';
import { menuItems } from './menu.config';
import Image from 'next/image';

type Props = {
	headline: string;
};

export default function Menu({ headline }: Props) {
	return (
		<Fragment>
			<div className={css.Menu}>
				<div className={css.Headline}>
					<img src="/Icon.bmp" loading="eager" />
					{headline}
				</div>
				<div className={css.Navbar}>{createMenuItems()}</div>
			</div>
		</Fragment>
	);
}

function createMenuItems() {
	return menuItems.map((item) => (
		<a className={css.Link} href={item.to}>
			<div className={css.MenuItem} key={item.id}>
				{<item.icon size={22} className={css.MenuIcon} />}

				{item.name}
			</div>
		</a>
	));
}
