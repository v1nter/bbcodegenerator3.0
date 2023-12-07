import Wrapper from '@/components/Wrapper/Wrapper';
import { StrictMode } from 'react';
import { HelmetProvider } from 'react-helmet-async';

export default function Home() {
	return (
		<StrictMode>
			<Wrapper />
		</StrictMode>
	);
}
