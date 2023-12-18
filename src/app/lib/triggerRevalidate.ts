import { checkEnvironment } from './checkEnvironment';

export default async function triggerRevalidate(path: string) {
	const host = checkEnvironment();

	const revalidate = await fetch(
		`${host}/api/Revalidate/?secret=${process.env.REVALIDATE_SECRET}&path=${path}`
	);

	console.log('-------------------');
	console.log('Revalidate:');
	console.log(revalidate.status);
	console.log(revalidate.statusText);
	console.log(revalidate.url);

	return;
}
