import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export function GET(request: NextRequest) {
	const secret = request.nextUrl.searchParams.get('secret');
	const path = request.nextUrl.searchParams.get('path');

	if (secret !== process.env.REVALIDATE_SECRET) {
		return NextResponse.json({ message: 'Wrong secret' }, { status: 401 });
	}

	if (!path) {
		return NextResponse.json({ message: 'Missing path' }, { status: 400 });
	}

	revalidatePath(path, 'page');

	return NextResponse.json({
		message: `Cache for path ${path} cleared`,
		now: new Date().toTimeString(),
	});
}
