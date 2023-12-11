import css from './Footer.module.css';

export default function Footer() {
	return (
		<footer className={css.siteFooter}>
			<small>&copy; {new Date().getFullYear()}</small>
		</footer>
	);
}
