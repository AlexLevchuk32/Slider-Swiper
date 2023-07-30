'use strict';
const config = {
	// mode: 'development',
	mode: 'production',
	entry: {
		main: './src/js/main.js',

		// Для многостраничного сайта
		// index: './src/js/index.js',
		// contacts: './src/js/contacts.js',
		// about: './src/js/about.js',
	},
	output: {
		filename: '[name].min.js',
	},
	watch: true,
	module: {},
};

module.exports = config;
