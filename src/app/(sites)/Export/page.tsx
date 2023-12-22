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
	const responseGames = await fetch(`${host}/api/Games/GetExportGames`);
	const games = (await responseGames.json()) as GameData[];

	const responseEvent = await fetch(`${host}/api/Events/GetCurrentEvent`);
	const event = (await responseEvent.json()) as Event;

	return <ExportComponent games={games} event={event} />;
}
