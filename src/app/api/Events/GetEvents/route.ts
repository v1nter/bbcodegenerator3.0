import prisma from '@/prisma/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
	revalidatePath('/Events');
	revalidateTag('Events');

	const events = await prisma.event.findMany({
		orderBy: [{ event_is_current: 'desc' }],
	});

	return Response.json(events);
}
