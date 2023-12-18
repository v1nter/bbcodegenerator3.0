import prisma from '@/prisma/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
	const events = await prisma.event.findMany({
		orderBy: [{ event_is_current: 'desc' }],
	});

	return Response.json(events);
}
