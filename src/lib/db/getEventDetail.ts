import prisma from '@/prisma/prisma';

export default async function getEventDetail(id: string) {
	const event = await prisma.event.findUnique({
		where: { event_id: parseInt(id) },
	});

	return event;
}
