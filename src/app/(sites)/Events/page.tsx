import { Fragment } from 'react';
import css from './page.module.css';
import { FaCheck } from 'react-icons/fa6';
import Link from 'next/link';
import type { Event } from '@prisma/client';
import { checkEnvironment } from '@/app/lib/checkEnvironment';
// import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function Events() {
	const pathFromEnvironment: string = checkEnvironment();

	const revalidate = await fetch(
		`${pathFromEnvironment}/api/revalidate?path=/Events&secret=${process.env.REVALIDATE_SECRET}`
	);

	const response = await fetch(`${pathFromEnvironment}/api/Events/GetEvents`, {
		cache: 'reload',
	});

	const events = (await response.json()) as Event[];

	return (
		<Fragment>
			<h1>Events</h1>
			<div className={css.newEvent}>
				<Link className={css.Link} href={'/Events/neu'}>
					Neues Event anlegen
				</Link>
			</div>
			<div className={css.TableWrapper}>
				<table className={css.EventTable}>
					<thead>
						<tr>
							<th className={css.EventTableHeader}>Event</th>
							<th className={css.EventTableHeader}>Aktuelles Event</th>
						</tr>
					</thead>
					<tbody>
						{events.map((event) => (
							<tr key={event.event_id}>
								<td>
									<Link className={css.Link} href={`/Events/${event.event_id}`}>
										{event.event_name}
									</Link>
								</td>
								<td className={css.tdCentered}>
									{event.event_is_current ? <FaCheck /> : ''}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</Fragment>
	);
}
