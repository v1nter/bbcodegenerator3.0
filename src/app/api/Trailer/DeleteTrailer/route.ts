import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function POST(request: Request) {
	try {
		const res = await request.json();

		const result = await prisma.trailer.deleteMany({
			where: {
				gameGame_id: res.gameGame_id,
			},
		});

		return NextResponse.json({ result });
	} catch (error) {
		console.log(error);
	}
}
