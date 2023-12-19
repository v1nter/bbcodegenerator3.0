import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function POST(request: Request) {
	try {
		const res = await request.json();

		if (res.event_id == 0) {
			const result = await prisma.event.create({
				data: {
					event_name: res.event_name,
					event_album: res.event_album,
					event_is_current: res.event_is_current,
					event_mainPost: res.event_mainPost,
					event_updatePost: res.event_updatePost,
				},
			});

			return NextResponse.json({ result });
		} else {
			const result = await prisma.event.update({
				where: {
					event_id: res.event_id,
				},
				data: {
					event_name: res.event_name,
					event_album: res.event_album,
					event_is_current: res.event_is_current,
					event_mainPost: res.event_mainPost,
					event_updatePost: res.event_updatePost,
				},
			});

			return NextResponse.json({ result });
		}
	} catch (error) {
		console.log(error);
	}
}
