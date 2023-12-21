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

	console.log('Access Token: ' + accessToken.access_token);
}
