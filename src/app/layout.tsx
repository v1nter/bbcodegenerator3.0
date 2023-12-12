import type { Metadata } from 'next';
import '/css/style.css';
import css from './layout.module.css';
import Footer from '@/components/Footer/Footer';
import { Play } from 'next/font/google';
import { Share_Tech_Mono } from 'next/font/google';
import Header from '@/components/Header/Header';

// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'BBCodeGenerator 3.0',
	icons: [{ url: '/favicon.ico' }],
	// description: 'Generated by create next app',
};

// Layout.tsx ist der Einstiegspunkt der Next.js-Anwendung.
// Im Body wird App/page.tsx als Home aufgerufen.
// Routing erfolgt per Folder: Wird ein Order "Spiele" angelegt, entsteht
// eine Route /Spiele. Im Ordner muss dann eine entsprechende page.tsx liegen.

// Einbinden der Schriftart
const fontStyles = Play({
	weight: ['400', '700'],
	subsets: ['latin-ext'],
	variable: '--font-1',
});
// const fontStyles = Share_Tech_Mono({
// 	weight: ['400'],
// 	subsets: ['latin'],
// 	variable: '--font-1',
// });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="de">
			<body className={`${css.siteWrapper} ${fontStyles.variable}`}>
				<Header />
				<div className={css.siteContent}>{children}</div>
				{<Footer />}
			</body>
		</html>
	);
}
