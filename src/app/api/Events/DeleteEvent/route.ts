import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
	try {
		const res = await request.json();

		const result = await prisma.event.delete({
			where: {
				event_id: res.event_id,
			},
		});

		revalidatePath('/Events');

		return NextResponse.json({ result });
	} catch (error) {
		console.log(error);
	}
}
