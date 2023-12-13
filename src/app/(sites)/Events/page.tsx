import prisma from '@/prisma/prisma';
import { Fragment } from 'react';
import css from './page.module.css';
import { FaCheck } from 'react-icons/fa6';
import Link from 'next/link';

export default async function Events() {
	const events = await prisma.event.findMany({
		orderBy: [{ event_is_current: 'desc' }],
	});

	return (
		<Fragment>
			<h1>Events</h1>
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
