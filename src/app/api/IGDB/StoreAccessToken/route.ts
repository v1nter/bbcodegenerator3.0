import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function POST(request: NextRequest) {
	const accesstoken = request.nextUrl.searchParams.get('accesstoken') as string;

	try {
		const result = await prisma.iGDB.create({
			data: {
				accessToken: accesstoken,
			},
		});

		return NextResponse.json({ result });
	} catch (error) {
		console.log(error);
	}
}
