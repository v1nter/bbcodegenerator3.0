import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { checkEnvironment } from '@/app/lib/checkEnvironment';
// import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
	try {
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

		// revalidatePath('/Events');
		// revalidatePath('/Events/[id]', 'page');
		// revalidatePath(`/Events/${res.event_id}`, 'page');

		const pathFromEnvironment: string = checkEnvironment();

		const revalidate = await fetch(
			`${pathFromEnvironment}/api/revalidate?path=/Events&secret=${process.env.REVALIDATE_SECRET}`
		);

		return NextResponse.json({ result });
	} catch (error) {
		console.log(error);
	}
}
