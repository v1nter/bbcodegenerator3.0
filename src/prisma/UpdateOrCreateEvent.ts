import type { Event } from '@prisma/client';
import prisma from './prisma';
import { NextResponse } from 'next/server';

export async function UpdateOrCreateEvent(event: Event) {
	'use server';
	console.log('???');

	const update = await prisma.event.upsert({
		where: {
			event_id: event.event_id,
		},
		update: {
			event_name: event.event_name,
			event_album: event.event_album,
			event_is_current: event.event_is_current,
			event_mainPost: event.event_mainPost,
			event_updatePost: event.event_updatePost,
		},
		create: {
			event_name: event.event_name,
			event_album: event.event_album,
			event_is_current: event.event_is_current,
			event_mainPost: event.event_mainPost,
			event_updatePost: event.event_updatePost,
		},
	});

	return NextResponse.json({ update });
}
