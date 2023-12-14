import prisma from '@/prisma/prisma';
import { notFound } from 'next/navigation';
import EventDetailComponent from '@/components/EventDetailComponent/EventDetailComponent';
import type { Event } from '@prisma/client';

type Props = {
	params: {
		id: string;
	};
};

export const dynamic = 'force-dynamic';

export default async function EventDetail({ params }: Props) {
	const event: Event = (await getEventDetail(params.id)) as Event;

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
