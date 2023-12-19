import { checkEnvironment } from '@/app/lib/checkEnvironment';
import triggerRevalidate from '@/app/lib/triggerRevalidate';
import PlatformDetailComponent from '@/components/PlatformDetailComponent/PlatformDetailComponent';
import { Platform } from '@prisma/client';

checkEnvironment;

type Props = {
	params: {
		id: string;
	};
};

export const dynamic = 'force-dynamic';
const host = checkEnvironment();

export default async function PlatformDetail({ params }: Props) {
	if (params.id === 'neu') {
		const platform = {} as Platform;

		return <PlatformDetailComponent platform={platform} />;
	} else {
		triggerRevalidate('/(sites)/Plattformen/[id]');

		const response = await fetch(
			`${host}/api/Platforms/GetPlatformDetail/${params.id}`
		);

		const platform = (await response.json()) as Platform;

		return <PlatformDetailComponent platform={platform} />;
	}
}
