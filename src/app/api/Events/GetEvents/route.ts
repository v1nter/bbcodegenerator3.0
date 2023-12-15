import prisma from '@/prisma/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const events = await prisma.event.findMany({
		orderBy: [{ event_is_current: 'desc' }],
	});

	return Response.json(events);
}
