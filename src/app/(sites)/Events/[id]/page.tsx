import { notFound } from 'next/navigation';
import EventDetailComponent from '@/components/EventDetailComponent/EventDetailComponent';
import type { Event } from '@prisma/client';
import { checkEnvironment } from '@/app/lib/checkEnvironment';
import triggerRevalidate from '@/app/lib/triggerRevalidate';

type Props = {
	params: {
		id: string;
	};
};

export const dynamic = 'force-dynamic';
const host = checkEnvironment();

export default async function EventDetail({ params }: Props) {
	if (params.id === 'neu') {
		const event = {} as Event;

		return <EventDetailComponent event={event} />;
	} else {
		triggerRevalidate('/(sites)/Events/[id]');

		const response = await fetch(
			`${host}/api/Events/GetEventDetail/${params.id}`
		);

		const event = (await response.json()) as Event;

		if (event === null || event == undefined) {
			notFound();
		}

		return <EventDetailComponent event={event} />;
	}
}
