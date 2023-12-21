import { checkEnvironment } from '@/app/lib/checkEnvironment';
import { igdb_getAccessToken } from '@/app/lib/fetchIGDB';
import triggerRevalidate from '@/app/lib/triggerRevalidate';
import GameDetail from '@/components/GameDetail/GameDetail';
import { Game, Platform, Event, Trailer } from '@prisma/client';

type Props = {
	params: {
		id: string;
	};
};

type GameData = Game & { Platform: Platform[] } & {
	Trailer: Trailer[];
} & { Event: Event };

export const dynamic = 'force-dynamic';
const host = checkEnvironment();

export default async function GameDetails({ params }: Props) {
	triggerRevalidate('/(sites)/Spiele/[id]');

	const response = await fetch(`${host}/api/Games/GetGameDetail/${params.id}`);
	const data = (await response.json()) as GameData;

	return <GameDetail game={data} />;
}
