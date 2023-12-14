export const checkEnvironment = () => {
	if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
		return 'http://localhost:3000';
	} else if (process.env.ENVIRONMENT === 'PRODUCTION') {
		return 'https://bbcodegenerator.vercel.app/';
	} else {
		return 'error';
	}
};
