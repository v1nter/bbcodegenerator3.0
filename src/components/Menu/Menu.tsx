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
				<div className={css.Navbar}>
					{menuItems.map((item) => (
						<div className={css.MenuItem} key={item.id}>
							<object className={css.MenuIcon} data={`/Icons/${item.icon}`} />
							<a className={css.Link} href={item.to}>
								{item.name}
							</a>
						</div>
					))}
				</div>
			</div>
		</Fragment>
	);
}
