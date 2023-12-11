import Menu from '../Menu/Menu';
import css from './Header.module.css';

export default function Header() {
	return (
		<header className={css.siteHeader}>
			<Menu headline={'BBCodeGenerator 3.0'} />
		</header>
	);
}
