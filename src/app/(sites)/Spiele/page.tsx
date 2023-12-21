import { checkEnvironment } from '@/app/lib/checkEnvironment';
import triggerRevalidate from '@/app/lib/triggerRevalidate';
import { Game, Platform, Event } from '@prisma/client';
import GameList from '@/components/GameList/GameList';
import { Reducer, useReducer } from 'react';

export const dynamic = 'force-dynamic';
const host: string = checkEnvironment();

export default async function Games() {
	triggerRevalidate('/(sites)/Spiele');

	const response = await fetch(`${host}/api/Games/GetGames`);
	const data = (await response.json()) as (Game & { Platform: Platform[] })[];

	return <GameList games={data} />;
}
