import { access } from 'fs';
import { checkEnvironment } from './checkEnvironment';

export async function igdb_getAccessToken() {
	const client_id = process.env.IGDB_CLIENT_ID;
	const client_secret = process.env.IGDB_CLIENT_SECRET;

	const response = await fetch(
		`https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`,
		{
			method: 'POST',
		}
	);

	const accessToken = await response.json();

	igdb_storeAccessToken(accessToken.access_token);
}

async function igdb_storeAccessToken(accessToken: string) {
	const host = checkEnvironment();
	const response = await fetch(
		`${host}/api/IGDB/StoreAccessToken?accesstoken=${accessToken}`,
		{
			method: 'POST',
			body: accessToken,
		}
	);
}

export async function igdb_readAccessTokenFromDB() {
	const host = checkEnvironment();

	const response = await fetch(`${host}/api/IGDB/ReadAccessTokenFromDB`);

	return response;
}
