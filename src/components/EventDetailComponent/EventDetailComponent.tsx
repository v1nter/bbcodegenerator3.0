'use client';

import { FormEvent, Fragment, useState } from 'react';
import { type Event } from '@prisma/client';
import css from './EventDetailComponent.module.css';
import prisma from '@/prisma/prisma';

type Props = {
	event: Event;
};

export default function EventDetail({ event }: Props) {
	const [eventData, setEventData] = useState(event);

	// const UpdateOrCreateEvent = async (formData: FormData) => {
	// 	'use server';

	// 	formData.get('event_name');

	// 	prisma.event.upsert({
	// 		where: {
	// 			event_id: event.event_id,
	// 		},
	// 		update: {
	// 			event_name: event.event_name,
	// 			event_album: event.event_album,
	// 			event_is_current: event.event_is_current,
	// 			event_mainPost: event.event_mainPost,
	// 			event_updatePost: event.event_updatePost,
	// 		},
	// 		create: {
	// 			event_name: event.event_name,
	// 			event_album: event.event_album,
	// 			event_is_current: event.event_is_current,
	// 			event_mainPost: event.event_mainPost,
	// 			event_updatePost: event.event_updatePost,
	// 		},
	// 	});
	// };

	return (
		<Fragment>
			<h1>{eventData.event_name}</h1>
			<form
				onSubmit={(e) => {
					handleSave(eventData, e);
				}}
			>
				{/* <form action={UpdateOrCreateEvent}> */}
				<table>
					<tbody>
						<tr>
							<td>Name:</td>
							<td>
								<input
									type="text"
									name="event_name"
									value={eventData.event_name}
									onChange={(e) => {
										const newEvent = {
											...eventData,
											event_name: e.target.value,
										};

										setEventData(newEvent);
									}}
								/>
							</td>
						</tr>
						<tr>
							<td>Album:</td>
							<td>
								<input
									type="text"
									name="event_album"
									value={eventData.event_album}
									onChange={(e) => {
										const newEvent = {
											...eventData,
											event_album: e.target.value,
										};

										setEventData(newEvent);
									}}
								/>
							</td>
						</tr>
						<tr>
							<td>Aktuelles Event:</td>
							<td className={css.tdCentered}>
								<input
									type="checkbox"
									name="event_is_current"
									checked={eventData.event_is_current}
									onChange={(e) => {
										const newEvent = {
											...eventData,
											event_is_current: e.target.checked,
										};

										setEventData(newEvent);
									}}
								/>
							</td>
						</tr>
						<tr>
							<td>Hauptpost:</td>
							<td>
								<input
									type="text"
									name="event_mainPost"
									value={eventData.event_mainPost}
									onChange={(e) => {
										const newEvent = {
											...eventData,
											event_mainPost: e.target.value,
										};

										setEventData(newEvent);
									}}
								/>
							</td>
						</tr>
						<tr>
							<td>Updatepost:</td>
							<td>
								<input
									type="text"
									name="event_updatePost"
									value={eventData.event_updatePost}
									onChange={(e) => {
										const newEvent = {
											...eventData,
											event_updatePost: e.target.value,
										};

										setEventData(newEvent);
									}}
								/>
							</td>
						</tr>
						<tr>
							<td></td>
							<td>
								<button type="submit">Speichern</button>
							</td>
						</tr>
					</tbody>
				</table>
			</form>
		</Fragment>
	);
}

async function handleSave(event: Event, e: FormEvent) {
	e.preventDefault();

	try {
		await fetch('/api/Events/UpdateOrCreateEvent', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(event),
			next: { revalidate: 10 },
		});
	} catch (error) {
		console.log('catch');

		console.error(error);
	}
}
