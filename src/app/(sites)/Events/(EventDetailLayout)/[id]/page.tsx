import prisma from '@/prisma/prisma';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';

type Props = {
	params: {
		id: string;
	};
};

type Event = {
	name: string;
	album: string;
	currentEvent: boolean;
	mainPost: string;
	updatePost: string;
};

export default async function EventDetail({ params }: Props) {
	const event = await prisma.event.findUnique({
		where: { event_id: parseInt(params.id) },
	});

	// const event = await getEvent(params.id);

	if (event === null) {
		notFound();
	}

	const dbEvent: Event = {
		name: event.event_name,
		album: event.event_album,
		currentEvent: event.event_is_current,
		mainPost: event.event_mainPost,
		updatePost: event.event_updatePost,
	};

	// const [newEvent, setNewEvent] = useState(dbEvent);

	return (
		<Fragment>
			<h1>{event.event_name}</h1>
			{/* <table>
				<tbody>
					<tr>
						<td>Name:</td>
						<td>
							<input
								type="text"
								name="event_album"
								defaultValue={dbEvent.name}
							/>
						</td>
					</tr>
					<tr>
						<td>Album:</td>
						<td>
							<input
								type="text"
								name="event_album"
								defaultValue={dbEvent.album}
							/>
						</td>
					</tr>
					<tr>
						<td>Aktuelles Event:</td>
						<td>
							<input
								type="checkbox"
								name="event_is_current"
								defaultChecked={dbEvent.currentEvent}
							/>
						</td>
					</tr>
					<tr>
						<td>Hauptpost:</td>
						<td>
							<input
								type="text"
								name="event_mainPost"
								defaultValue={dbEvent.mainPost}
							/>
						</td>
					</tr>
					<tr>
						<td>Updatepost:</td>
						<td>
							<input
								type="text"
								name="event_updatePost"
								defaultValue={dbEvent.updatePost}
							/>
						</td>
					</tr>
				</tbody>
			</table> */}
		</Fragment>
	);
}
