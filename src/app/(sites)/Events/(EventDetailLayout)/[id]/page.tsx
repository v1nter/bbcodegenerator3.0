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

export default async function EventDetail({ params }: Props) {
	if (params.id === 'neu') {
		const event = {} as Event;

		return <EventDetailComponent event={event} />;
	} else {
		const pathFromEnvironment: string = checkEnvironment();

		const revalidate = await fetch(
			`${pathFromEnvironment}/api/revalidate?path=/Events/${params.id}&secret=${process.env.REVALIDATE_SECRET}`
		);

		noStore();
		const response = await fetch(
			`${pathFromEnvironment}/api/Events/GetEventDetail/${params.id}`,
			{
				cache: 'reload',
			}
		);
		revalidatePath('/');

		const event = (await response.json()) as Event;

		if (event === null || event == undefined) {
			notFound();
		}

		return <EventDetailComponent event={event} />;
	}
}
