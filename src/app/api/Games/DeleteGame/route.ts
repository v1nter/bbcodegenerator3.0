import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function POST(request: Request) {
	try {
		const res = await request.json();

		const result = await prisma.game.delete({
			where: {
				game_id: res.game_id,
			},
		});

		return NextResponse.json({ result });
	} catch (error) {
		console.log(error);
	}
}
