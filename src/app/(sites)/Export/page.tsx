import { checkEnvironment } from '@/app/lib/checkEnvironment';
import ExportComponent from '@/components/ExportComponent/ExportComponent';
import { Game, Platform, Trailer, Event } from '@prisma/client';
import css from './page.module.css';

export const dynamic = 'force-dynamic';
const host: string = checkEnvironment();

type GameData = Game & { Platform: Platform[] } & {
	Trailer: Trailer[];
} & { Event: Event };

export default async function page() {
	const response = await fetch(`${host}/api/Games/GetExportGames`);
	const data = (await response.json()) as GameData[];

	return <ExportComponent games={data} />;
}
