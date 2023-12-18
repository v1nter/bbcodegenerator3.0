import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function POST(request: Request) {
	try {
		const res = await request.json();

		const result = await prisma.platform.upsert({
			where: {
				platform_id: res.platform_id,
			},
			update: {
				platform_name: res.platform_name,
				platform_image: res.platform_image,
				platform_type: res.platform_type,
			},
			create: {
				platform_name: res.platform_name,
				platform_image: res.platform_image,
				platform_type: res.platform_type,
			},
		});

		return NextResponse.json({ result });
	} catch (error) {
		console.log(error);
	}
}
