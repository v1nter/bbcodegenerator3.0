import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function POST(request: Request) {
	try {
		const res = await request.json();

		if (res.platform_id == 0) {
			const result = await prisma.platform.create({
				data: {
					platform_name: res.platform_name,
					platform_image: res.platform_image,
					platform_type: res.platform_type,
				},
			});

			return NextResponse.json({ result });
		} else {
			const result = await prisma.platform.update({
				where: {
					platform_id: res.platform_id,
				},
				data: {
					platform_name: res.platform_name,
					platform_image: res.platform_image,
					platform_type: res.platform_type,
				},
			});
			return NextResponse.json({ result });
		}
	} catch (error) {
		console.log(error);
	}
}
