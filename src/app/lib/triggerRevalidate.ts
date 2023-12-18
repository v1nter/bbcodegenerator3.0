import { checkEnvironment } from './checkEnvironment';

export default async function triggerRevalidate(path: string) {
	const host = checkEnvironment();

	const revalidate = await fetch(
		`${host}/api/Revalidate/?secret=${process.env.REVALIDATE_SECRET}&path=${path}`
	);

	return;
}
