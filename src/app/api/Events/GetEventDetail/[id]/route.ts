import prisma from '@/prisma/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';

type Props = {
	params: {
		id: string;
	};
};

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: Props) {
	revalidatePath('/Events');
	revalidatePath(`/Events/${params.id}`, 'page');
	revalidateTag('Events');

	const event = await prisma.event.findUnique({
		where: { event_id: parseInt(params.id) },
	});

	return Response.json(event);
}
