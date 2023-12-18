import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function POST(request: Request) {
	try {
		const res = await request.json();

		const result = await prisma.platform.delete({
			where: {
				platform_id: res.platform_id,
			},
		});

		return NextResponse.json({ result });
	} catch (error) {
		console.log(error);
	}
}
