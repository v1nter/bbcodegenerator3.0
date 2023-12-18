import Link from 'next/link';
import { Fragment } from 'react';
import css from './page.module.css';
import triggerRevalidate from '@/app/lib/triggerRevalidate';
import type { Platform } from '@prisma/client';
import { checkEnvironment } from '@/app/lib/checkEnvironment';
import { platform } from 'os';

export const dynamic = 'force-dynamic';
const host: string = checkEnvironment();

export default async function page() {
	triggerRevalidate('/(sites)/Plattformen');

	const response = await fetch(`${host}/api/Platforms/GetPlatforms`);

	const platforms = (await response.json()) as Platform[];

	return (
		<Fragment>
			<h1>Plattformen</h1>
			<div className={css.newPlatform}>
				<Link className={css.Link} href={'/Plattformen/neu'}>
					Neue Plattform anlegen
				</Link>
			</div>
			<div className={css.TableWrapper}>
				<table className={css.PlatformTable}>
					<thead>
						<tr>
							<th className={css.PlatformTableHeader}>Plattform</th>
							<th className={css.PlatformTableHeader}>Icon</th>
						</tr>
					</thead>
					<tbody>
						{platforms.map((platform) => (
							<tr key={platform.platform_id}>
								<td>
									<Link
										className={css.Link}
										href={`/Plattformen/${platform.platform_id}`}
									>
										{platform.platform_name}
									</Link>
								</td>
								<td className={css.tdCentered}>
									<img src={platform.platform_image} />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</Fragment>
	);
}
