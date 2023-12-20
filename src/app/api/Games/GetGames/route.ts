import prisma from '@/prisma/prisma';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
	const filter = request.nextUrl.searchParams.get('filter') as string;

	if (request.nextUrl.searchParams.get('filter') != null) {
		const games = await prisma.game.findMany({
			where: {
				game_name: { contains: filter, mode: 'insensitive' },
			},
			include: {
				Platform: true,
				Trailer: true,
				Event: true,
			},
			orderBy: [{ game_name: 'asc' }],
		});

		return Response.json(games);
	} else {
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
}
