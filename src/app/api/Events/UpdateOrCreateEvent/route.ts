import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { revalidateTag } from 'next/cache';

export async function POST(request: Request) {
	const res = await request.json();

	const result = await prisma.event.upsert({
		where: {
			event_id: res.event_id,
		},
		update: {
			event_name: res.event_name,
			event_album: res.event_album,
			event_is_current: res.event_is_current,
			event_mainPost: res.event_mainPost,
			event_updatePost: res.event_updatePost,
		},
		create: {
			event_name: res.event_name,
			event_album: res.event_album,
			event_is_current: res.event_is_current,
			event_mainPost: res.event_mainPost,
			event_updatePost: res.event_updatePost,
		},
	});

	revalidateTag('Events');

	return NextResponse.json({ result });
}
