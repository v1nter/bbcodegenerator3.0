import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { platform } from 'os';
import { Platform } from '@prisma/client';

export async function POST(request: Request) {
	try {
		const res = await request.json();

		if (res.game_id == 0) {
			const result = await prisma.game.create({
				data: {
					game_name: res.game_name,
					game_keyart: res.game_keyart,
					game_description: res.game_description,
					game_release_date: res.game_release_date,
					game_delta: res.game_delta,
					game_hidden: res.game_hidden,
					game_update: res.game_update,
					game_no_export: res.game_no_export,
					eventEvent_id: res.eventEvent_id,
				},
			});
			return NextResponse.json({ result });
		} else {
			// Finde alle Plattformen, die derzeit verbunden sind
			const currentGame = await prisma.game.findUnique({
				where: { game_id: res.game_id },
				include: { Platform: true },
			});

			// Sammle potentielle Plattformen zum trennen
			const disconnectPlatforms =
				currentGame?.Platform.map((p) => ({
					platform_id: p.platform_id,
				})) || [];

			const result = await prisma.game.update({
				where: {
					game_id: res.game_id,
				},
				data: {
					game_name: res.game_name,
					game_keyart: res.game_keyart,
					game_description: res.game_description,
					game_release_date: res.game_release_date,
					game_delta: res.game_delta,
					game_hidden: res.game_hidden,
					game_update: res.game_update,
					game_no_export: res.game_no_export,
					game_igdb_id: res.game_igdb_id,

					Platform: {
						// Entferne alten Verbindungen
						disconnect: disconnectPlatforms,

						// Aktualisiere mit den neuen Verbindungen
						connect: res.Platform.map((platform: Platform) => {
							return { platform_id: platform.platform_id };
						}),
					},
				},
			});

			return NextResponse.json({ result });
		}
	} catch (error) {
		console.log(error);
	}
}
