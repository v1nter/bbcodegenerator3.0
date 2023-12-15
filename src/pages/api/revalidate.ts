import { checkEnvironment } from '@/app/lib/checkEnvironment';
import { NextApiRequest, NextApiResponse } from 'next';

const pathFromEnvironment: string = checkEnvironment();
// ${pathFromEnvironment}/api/revalidate?path=/&secret=#ZzppmA9@AdW386iALps

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.query.secret !== process.env.REVALIDATE_SECRET) {
		return res.status(401).json({
			message: 'Invalid Token',
		});
	}

	const path = req.query.path as string;
	await res.revalidate(path);

	return res.json({ revalidated: true });
}
