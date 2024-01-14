import triggerRevalidate from '@/app/lib/triggerRevalidate';
import prisma from '@/prisma/prisma';

type Props = {
	params: {
		id: string;
	};
};

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: Props) {
	triggerRevalidate('(sites)/Spiele/[id]');
	triggerRevalidate('/api/Games/GetGameDetail/[id]');

	const game = await prisma.game.findUnique({
		where: { game_id: parseInt(params.id) },
		include: {
			Platform: true,
			Trailer: true,
			Event: true,
		},
	});

	return Response.json(game);
}
