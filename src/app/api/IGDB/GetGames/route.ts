import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	const client_id = process.env.IGDB_CLIENT_ID as string;
	const auth = 'Bearer 06yz5sr23il4qcck2iral0qr2lhak8'; // Der Einfachhalt halber erstmal hardcoded. Muss eigentlich aus der DB ausgelesen und regelmäßig refreshed werden

	const game = request.nextUrl.searchParams.get('game') as string;

	const headersList = {
		'Client-ID': client_id,
		Authorization: auth,
		'Content-Type': 'text/plain',
	};

	const bodyContent = `search "${game}";\nfields name, release_dates.human, cover.url, platforms.name, videos.name, videos.video_id;`;

	const response = await fetch('https://api.igdb.com/v4/games', {
		method: 'POST',
		body: bodyContent,
		headers: headersList,
	});

	const data = await response.json();

	return NextResponse.json(data);
}
