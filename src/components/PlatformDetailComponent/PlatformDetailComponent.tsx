'use client';

import triggerRevalidate from '@/app/lib/triggerRevalidate';
import { Platform, PlatformType } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { FormEvent, Fragment, useEffect, useState } from 'react';

type Props = {
	platform: Platform;
};

export const dynamic = 'force-dynamic';

export default function PlatformDetail({ platform }: Props) {
	const [platformData, setPlatformData] = useState(platform);
	const router = useRouter();

	useEffect(() => {
		if (!platform.platform_id) {
			const newPlatform: Platform = {
				platform_name: '',
				platform_image: '',
				platform_type: 'Console',
				platform_id: 0,
			};

			setPlatformData(newPlatform);
		}
	}, []);

	return (
		<Fragment>
			<h1>
				{platform.platform_id
					? platform.platform_name
					: 'Neue Plattform anlegen'}
			</h1>
			<form
				onSubmit={(e) => {
					handleSave(platformData, e);
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
									name="platform_name"
									value={platformData.platform_name || ''}
									onChange={(e) => {
										const newPlatform = {
											...platformData,
											platform_name: e.target.value,
										};

										setPlatformData(newPlatform);
									}}
								/>
							</td>
						</tr>
						<tr>
							<td>Icon:</td>
							<td>
								<input
									type="text"
									name="platform_image"
									value={platformData.platform_image || ''}
									onChange={(e) => {
										const newPlatform = {
											...platformData,
											platform_image: e.target.value,
										};

										setPlatformData(newPlatform);
									}}
								/>
							</td>
						</tr>
						<tr>
							<td>Typ:</td>
							<td>
								<select
									name="platform_type"
									value={platformData.platform_type || 'Console'}
									onChange={(e) => {
										const newPlatform = {
											...platformData,
											platform_type: e.target.value as PlatformType,
										};

										setPlatformData(newPlatform);
									}}
								>
									<option value="Console">Konsole</option>
									<option value="PC">PC</option>
									<option value="Mobile">Mobile</option>
									<option value="VR">VR</option>
								</select>
							</td>
						</tr>
						<tr>
							<td></td>
							<td>
								<button type="submit">Speichern</button>
								<button
									onClick={() => {
										handleDelete(platformData).then(() =>
											router.replace('/Plattformen')
										);
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

async function handleSave(platform: Platform, e: FormEvent) {
	e.preventDefault();

	try {
		const result = await fetch(`/api/Platforms/UpdateOrCreatePlatform`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(platform),
		});
	} catch (error) {
		alert(error);
	}

	triggerRevalidate('/(sites)/Plattformen/[id]');
}

async function handleDelete(platform: Platform) {
	const result = await fetch(`/api/Platforms/DeletePlatform`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(platform),
	});

	triggerRevalidate('/(sites)/Plattformen/[id]');
}
