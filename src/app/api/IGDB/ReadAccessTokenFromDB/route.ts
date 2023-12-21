import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function GET(request: NextRequest) {
	try {
		const result = await prisma.iGDB.findFirst();

		return NextResponse.json({ result });
	} catch (error) {
		console.log(error);
	}
}
