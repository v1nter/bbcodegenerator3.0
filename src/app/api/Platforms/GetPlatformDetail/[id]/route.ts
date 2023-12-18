import triggerRevalidate from '@/app/lib/triggerRevalidate';
import prisma from '@/prisma/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';
triggerRevalidate;

type Props = {
	params: {
		id: string;
	};
};

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: Props) {
	console.log(params.id);

	triggerRevalidate('/Plattformen/[id]');
	triggerRevalidate('/api/Platforms/GetPlatformsDetail/[id]');

	const platform = await prisma.platform.findUnique({
		where: { platform_id: parseInt(params.id) },
	});

	return Response.json(platform);
}
