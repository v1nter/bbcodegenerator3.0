import prisma from '@/prisma/prisma';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';

type Props = {
	params: {
		id: string;
	};
};
export default async function EventDetail({ params }: Props) {
	const event = await prisma.event.findUnique({
		where: { event_id: parseInt(params.id) },
	});

	if (event === null) {
		notFound();
	}

	return (
		<Fragment>
			<h1>{event.event_name}</h1>
			<table>
				<tbody>
					<tr>
						<td>Album:</td>
						<td>{event.event_album}</td>
					</tr>
					<tr>
						<td>Aktuelles Event:</td>
						<td>{event.event_is_current.toString()}</td>
					</tr>
					<tr>
						<td>Hauptpost:</td>
						<td>{event.event_mainPost}</td>
					</tr>
					<tr>
						<td>Updatepost:</td>
						<td>{event.event_updatePost}</td>
					</tr>
				</tbody>
			</table>
		</Fragment>
	);
}
