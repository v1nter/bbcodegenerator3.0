import Footer from '../Footer/Footer';
import Menu from '../Menu/Menu';
import css from './Wrapper.module.css';
Footer;

export default function Wrapper() {
	return (
		<div className={css.siteWrapper}>
			<nav className={css.siteHeader}>
				<Menu headline={'BBCodeGenerator 3.0'} />
			</nav>
			<div className={css.siteContent}></div>
			<div className={css.siteFooter}>
				<Footer />
			</div>
		</div>
	);
}
