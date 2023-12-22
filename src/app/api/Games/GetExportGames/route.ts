import prisma from '@/prisma/prisma';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
	const games = await prisma.game.findMany({
		include: {
			Platform: true,
			Trailer: true,
			Event: true,
		},
		orderBy: [{ game_name: 'asc' }],
	});

	return Response.json(games);
}
