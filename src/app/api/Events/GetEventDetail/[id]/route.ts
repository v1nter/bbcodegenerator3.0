import prisma from '@/prisma/prisma';
import { NextResponse } from 'next/server';

type Props = {
	params: {
		id: string;
	};
};

export async function GET(request: Request, { params }: Props) {
	const event = await prisma.event.findUnique({
		where: { event_id: parseInt(params.id) },
	});

	return NextResponse.json(event);
}
