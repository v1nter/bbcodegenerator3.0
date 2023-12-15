import prisma from '@/prisma/prisma';
import { notFound } from 'next/navigation';
import EventDetailComponent from '@/components/EventDetailComponent/EventDetailComponent';
import type { Event } from '@prisma/client';
import { checkEnvironment } from '@/app/lib/checkEnvironment';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
type Props = {
	params: {
		id: string;
	};
};

export const dynamic = 'force-dynamic';
// export const fetchCache = 'force-no-store';
// export const revalidate = 0;

export default async function EventDetail({ params }: Props) {
	// const event: Event = (await getEventDetail(params.id)) as Event;

	const pathFromEnvironment: string = checkEnvironment();

	const revalidate = await fetch(
		`${pathFromEnvironment}/api/revalidate?path=/Events/${params.id}&secret=${process.env.REVALIDATE_SECRET}`
	);

	noStore();
	const response = await fetch(
		`${pathFromEnvironment}/api/Events/GetEventDetail/${params.id}`,
		{
			cache: 'reload',
			// next: { revalidate: 0 },
		}
	);
	revalidatePath('/');

	const event = (await response.json()) as Event;

	if (event === null || event == undefined) {
		notFound();
	}

	return <EventDetailComponent event={event} />;
}

async function getEventDetail(id: string) {
	const event = await prisma.event.findUnique({
		where: { event_id: parseInt(id) },
	});

	return event;
}
