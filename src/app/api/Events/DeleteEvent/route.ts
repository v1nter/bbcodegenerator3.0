import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { checkEnvironment } from '@/app/lib/checkEnvironment';

export async function POST(request: Request) {
	try {
		const res = await request.json();

		const result = await prisma.event.delete({
			where: {
				event_id: res.event_id,
			},
		});

		const pathFromEnvironment: string = checkEnvironment();

		const revalidate = await fetch(
			`${pathFromEnvironment}/api/revalidate?path=/Events&secret=${process.env.REVALIDATE_SECRET}`
		);

		return NextResponse.json({ result });
	} catch (error) {
		console.log(error);
	}
}
