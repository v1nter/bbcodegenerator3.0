import prisma from '@/prisma/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
	const events = await prisma.event.findFirst({
		where: { event_is_current: true },
	});

	return Response.json(events);
}
