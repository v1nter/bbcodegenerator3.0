import { checkEnvironment } from '@/app/lib/checkEnvironment';
import triggerRevalidate from '@/app/lib/triggerRevalidate';
import { Platform } from '@prisma/client';

checkEnvironment;

type Props = {
	params: {
		id: string;
	};
};

export const dynamic = 'force-dynamic';
const host = checkEnvironment();

export default async function page({ params }: Props) {
	triggerRevalidate('/(sites)/Plattformen/[id]');

	const response = await fetch(
		`${host}/api/Platforms/GetPlatformDetail/${params.id}`
	);

	const platform = (await response.json()) as Platform;

	return <div>{platform.platform_name}</div>;
}
