import { checkEnvironment } from '@/app/lib/checkEnvironment';
import triggerRevalidate from '@/app/lib/triggerRevalidate';
import { Game, Platform } from '@prisma/client';
import { Fragment } from 'react';
import css from './page.module.css';
import Link from 'next/link';
import { RxUpdate, RxMagnifyingGlass } from 'react-icons/rx';
import GameList from '@/components/GameList/GameList';

export const dynamic = 'force-dynamic';
const host: string = checkEnvironment();

export default async function Games() {
	triggerRevalidate('/(sites)/Spiele');

	const response = await fetch(`${host}/api/Games/GetGames`);
	const test = await fetch(`${host}/api/Games/GetGames`);

	console.log(await test.json());

	const games = (await response.json()) as Game[];

	return <GameList games={games} />;
}
