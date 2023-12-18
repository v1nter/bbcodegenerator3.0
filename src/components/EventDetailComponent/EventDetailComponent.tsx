'use client';

import { FormEvent, Fragment, useEffect, useState } from 'react';
import { type Event } from '@prisma/client';
import css from './EventDetailComponent.module.css';
import { useRouter } from 'next/navigation';

type Props = {
	event: Event;
};

export const dynamic = 'force-dynamic';

export default function EventDetail({ event }: Props) {
	const [eventData, setEventData] = useState(event);
	const router = useRouter();

	useEffect(() => {
		if (!event.event_id) {
			console.log('Keine Event ID');

			const newEvent: Event = {
				event_name: '',
				event_album: '',
				event_is_current: true,
				event_mainPost: '',
				event_updatePost: '',
				event_id: 0,
			};

			setEventData(newEvent);
		}
	}, []);

	return (
		<Fragment>
			{<h1>{event.event_id ? event.event_name : 'Neues Event anlegen'}</h1>}
			<form
				onSubmit={(e) => {
					handleSave(eventData, e);
					router.refresh();
				}}
			>
				<table>
					<tbody>
						<tr>
							<td>Name:</td>
							<td>
								<input
									type="text"
									name="event_name"
									value={eventData.event_name || ''}
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
									value={eventData.event_album || ''}
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
									checked={eventData.event_is_current || false}
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
									value={eventData.event_mainPost || ''}
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
									value={eventData.event_updatePost || ''}
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
								<button
									onClick={() => {
										handleDelete(eventData);
										router.replace('/Events');
									}}
								>
									Löschen
								</button>
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
		const result = await fetch(`/api/Events/UpdateOrCreateEvent`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(event),
			next: { tags: ['Events'], revalidate: 0 },
		});
	} catch (error) {
		alert(error);
	}
}

async function handleDelete(event: Event) {
	const result = await fetch(`/api/Events/DeleteEvent`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(event),
		next: { tags: ['Events'], revalidate: 0 },
	});
}
