import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function POST(request: Request) {
	try {
		const res = await request.json();

		const result = await prisma.event.delete({
			where: {
				event_id: res.event_id,
			},
		});

		return NextResponse.json({ result });
	} catch (error) {
		console.log(error);
	}
}
