import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function POST(request: Request) {
	try {
		const res = await request.json();

		if (res.trailer_id == 0) {
			const result = await prisma.trailer.create({
				data: {
					trailer_name: res.trailer_name,
					trailer_url: res.trailer_url,
					trailer_date: res.trailer_date,
					trailer_delta: res.trailer_delta,
					gameGame_id: res.gameGame_id,
				},
			});
			return NextResponse.json({ result });
		} else {
			const result = await prisma.trailer.update({
				where: {
					trailer_id: res.trailer_id,
				},
				data: {
					trailer_name: res.trailer_name,
					trailer_url: res.trailer_url,
					trailer_date: res.trailer_date,
					trailer_delta: res.trailer_delta,
					gameGame_id: res.gameGame_id,
				},
			});

			return NextResponse.json({ result });
		}
	} catch (error) {
		console.log('error');
	}
}
