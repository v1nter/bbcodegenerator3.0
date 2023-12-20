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

	const response2 = await fetch(`${host}/api/Games/GetGames`);
	console.log(await response2.json());

	// const response3 = await fetch(`${host}/api/Games/GetGames`);
	// const platforms = await response3.json();

	// console.log(
	// 	platforms[0].Platform.map((obj: Platform) => console.log(obj.platform_name))
	// );

	const data = (await response.json()) as Game[];
	// const data = (await response.json()) as (Game | Platform)[];

	return <GameList games={data} />;
}
