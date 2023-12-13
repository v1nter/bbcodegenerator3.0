import prisma from '@/prisma/prisma';

export default async function getEvent(id: string) {
	return await prisma.event.findUnique({
		where: { event_id: parseInt(id) },
	});
}
