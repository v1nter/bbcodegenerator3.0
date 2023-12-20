import { checkEnvironment } from '@/app/lib/checkEnvironment';
import triggerRevalidate from '@/app/lib/triggerRevalidate';
import { Game, Platform, Event } from '@prisma/client';
import { Fragment } from 'react';
import css from './page.module.css';
import Link from 'next/link';
import { RxUpdate, RxMagnifyingGlass } from 'react-icons/rx';
import GameList from '@/components/GameList/GameList';

export const dynamic = 'force-dynamic';
const host: string = checkEnvironment();

type GameData = {
	game: Game;
	platforms: Platform[];
	event: Event;
};

export default async function Games() {
	triggerRevalidate('/(sites)/Spiele');

	const response = await fetch(`${host}/api/Games/GetGames`);
	const data = (await response.json()) as (Game & { Platform: Platform[] })[];

	return <GameList games={data} />;
}
