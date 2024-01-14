import { checkEnvironment } from '@/app/lib/checkEnvironment';
import type { GameData } from '@/app/lib/types';
import GameDetail from '@/components/GameDetail/GameDetail';
import GameDetailAdvanced from '@/components/GameDetailAdvanced/GameDetailAdvanced';
import { Platform } from '@prisma/client';

type Props = {
	params: {
		id: string;
	};
};

export const dynamic = 'force-dynamic';
const host = checkEnvironment();

export default async function GameDetails({ params }: Props) {
	const revalidate = await fetch(
		`${host}/api/Revalidate/?secret=${process.env.REVALIDATE_SECRET}&path=/(sites)/Spiele/[ID]`
	);

	const gameResponse = await fetch(
		`${host}/api/Games/GetGameDetail/${params.id}`
	);
	const gameData = (await gameResponse.json()) as GameData;

	const platformResponse = await fetch(`${host}/api/Platforms/GetPlatforms`);
	const platformData = (await platformResponse.json()) as Platform[];

	// const platforms = platformData.map((platform) => ({
	// 	value: platform.platform_id,
	// 	label: platform.platform_name,
	// }));

	return <GameDetailAdvanced game={gameData} platforms={platformData} />;
	// return <GameDetail game={data} />;
}
