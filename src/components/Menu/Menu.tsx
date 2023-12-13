'use client';

import { Fragment, useEffect, useState } from 'react';
import css from './Menu.module.css';
import { menuItems } from './menu.config';
import { RxHamburgerMenu } from 'react-icons/rx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
	headline: string;
};

export default function Menu({ headline }: Props) {
	const [menu, toggleMenu] = useState(false);
	const pathname = usePathname();

	useEffect(() => toggleMenu(false), [pathname, toggleMenu]);

	return (
		<Fragment>
			<div className={css.Menu}>
				<div className={css.Headline}>
					<img src="/Icon.bmp" alt="" width="32" height="32" />
					{headline}
				</div>
				<div className={css.DesktopNavbar}>{createMenuItems()}</div>
				<div className={css.MobileWrapper}>
					<button className={css.MenuButton} onClick={() => toggleMenu(!menu)}>
						<RxHamburgerMenu />
					</button>
					{menu && <div className={css.MobileNavbar}>{createMenuItems()}</div>}
				</div>
			</div>
		</Fragment>
	);
}

function createMenuItems() {
	return menuItems.map((item) => (
		<Link key={item.id} className={css.Link} href={item.to}>
			<div className={css.MenuItem}>
				{<item.icon size={22} className={css.MenuIcon} />}
				{item.name}
			</div>
		</Link>
	));
}
