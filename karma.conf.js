// Set Environemnt
process.env.BABEL_ENV = 'test';

const webpackEnv = { test: true };
const webpackConfig = require('./webpack.config.babel');

// Configuration
module.exports = config => {
	config.set({
		basePath: '',

		frameworks: ['chai', 'mocha'],

		files: [
			'app/src/**/*.test.js',
			'app/src/**/!(*.test|*.stub).js'
		],

		exclude: ['app/src/bootstrap.js'],

		preprocessors: {
			'app/src/**/*.test.js': ['webpack'],
			'app/src/**/!(*.test|*.stub).js': ['webpack']
		},

		webpack: webpackConfig,

		webpackMiddleware: { noInfo: true },

		reporters: ['progress', 'coverage'],

		coverageReporter: {
			check: {
				global: {
					statements: 11,
					branches: 0,
					functions: 0,
					lines: 11
				}
			},

			reporters: [
				{
					type: 'lcov',
					dir: 'coverage/',
					subdir: '.'
				},
				{
					type: 'json',
					dir: 'coverage/',
					subdir: '.'
				},
				{
					type: 'text-summary'
				},
			]
		},

		plugins: [
      require("karma-webpack")
    ],

		port: 9876,

		colors: true,

		logLevel: config.LOG_INFO,

		autoWatch: false,

		browsers: ['Chrome'],

		singleRun: true,

		concurrency: Infinity
	});
};
