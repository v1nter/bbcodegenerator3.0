import { checkEnvironment } from '@/app/lib/checkEnvironment';
import triggerRevalidate from '@/app/lib/triggerRevalidate';
import GameDetail from '@/components/GameDetail/GameDetail';
import { Game } from '@prisma/client';

type Props = {
	params: {
		id: string;
	};
};

export const dynamic = 'force-dynamic';
const host = checkEnvironment();

export default async function GameDetails({ params }: Props) {
	triggerRevalidate('/(sites)/Spiele/[id]');

	const response = await fetch(`${host}/api/Games/GetGameDetail/${params.id}`);
	const data = (await response.json()) as Game;

	return <GameDetail game={data} />;
}
