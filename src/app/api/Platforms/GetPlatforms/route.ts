import prisma from '@/prisma/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
	const platforms = await prisma.platform.findMany({
		orderBy: [{ platform_name: 'asc' }],
	});

	return Response.json(platforms);
}
