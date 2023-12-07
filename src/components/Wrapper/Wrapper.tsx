import Footer from '../Footer/Footer';
import Menu from '../Menu/Menu';
import css from './Wrapper.module.css';
Footer;

export default function Wrapper() {
	return (
		<div className={css.siteWrapper}>
			<div className={css.siteHeader}>
				<Menu />
			</div>
			<div className={css.siteContent}></div>
			<div className={css.siteFooter}>
				<Footer />
			</div>
		</div>
	);
}
