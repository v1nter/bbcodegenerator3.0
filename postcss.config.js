const OpenProps = require('open-props');

module.exports = {
	plugins: [
		'postcss-import',
		['cssnano', { preset: 'default' }],
		[
			'postcss-preset-env',
			{
				features: {
					'custom-properties': false,
				},
			},
		],
	],
};
