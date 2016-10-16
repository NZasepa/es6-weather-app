const { resolve } = require('path');
const webpack = require('webpack');
const validate = require('webpack-validator');
const OfflinePlugin = require('offline-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { getIfUtils, removeEmpty } = require('webpack-config-utils');

module.exports = env => {
	if (!env) {
		const env = {};
	}

	console.log(env);
	const { ifProduction, ifNotProduction } = getIfUtils(env);

	const config = validate({
		context: resolve('app/src'),

		entry: {
			app: './bootstrap.js'
		},

		output: {
			fileName: ifProduction('bundle.[name].[chunkhash].js', 'bundle.[name].js'),
			path: resolve('app/dist'),
			pathInfo: ifNotProduction()
		},

		devTool: ifProduction('source-map', 'eval'),

		module: {
			preLoaders: [
				{
					test: /\.js$/,
					loader: 'jshint',
					exclude: /node_modules/
				}
			],
			loaders: [
				{
					test: /\.js$/,
					loaders: ['babel'],
					exclude: /node_modules/
				},
				{
					test: /\.css$/,
					loader: ExtractTextPlugin.extract({
						fallbackLoader: 'style',
						loader: 'css!scss!autoprefixer'
					})
				},
				{
					test: /\.(png|jpg|woff|woff2|eot|ttf|otf)/,
					loader: 'url-loader'
				},
	      {
					test: /\.svg/,
					loader: 'file?name=/img/[hash].[ext]?'
				},
			]
		},

		plugins: removeEmpty([
			new ProgressBarPlugin(),

			new ExtractTextPlugin(ifProduction('styles.[name].[chunkhash].css', 'styles.[name].css')),

			ifProduction(new InlineManifestWebpackPlugin()),

			ifProduction(new webpack.optimize.CommonsChunkPlugin({
				names: ['vendor', 'manifest']
			})),

			new HtmlWebpackPlugin({
				template: './index.html',
				inject: 'head'
			}),

			new OfflinePlugin(),

			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: ifProduction('"production"', '"development"')
				}
			})
		])
	});

	if (env.debug) {
		console.log(config);
	}

	return config;
};

// let path = require('path');
// let webpack = require('webpack');
// let HtmlWebpackPlugin = require('html-webpack-plugin');
// let ExtractTextPlugin = require('extract-text-webpack-plugin');
//
// // Extract Instances
// let extractCSS = new ExtractTextPlugin('assets/css/[name].css');
//
// var config = {
//   entry: [
// 		'./app/src/assets/style.scss',
// 		'./app/src/main',
// 		'webpack-dev-server/client?http://localhost:8080'
// 	],
//
//   output: {
// 	  path: 'app/dist/',
//     filename: 'bundle.js'
//   },
//
// 	devTool: 'source-map',
//
// 	module: {
// 		preLoaders: [
// 			{
// 				test: /\.js$/,
// 				include: path.join(__dirname, 'app/src/'),
// 				loader: 'jshint'
// 			}
// 		],
// 		loaders: [
// 			{
// 				test: /\.html$/,
// 				include: path.join(__dirname, 'app/src/'),
// 				loader: 'html'
// 			},
// 			{
// 				test: /\.js$/,
// 				include: path.join(__dirname, 'app/src/'),
// 				exclude: /(node_modules|tmp)/,
// 				loader: 'babel-loader',
// 				query: {
// 					presets: ["es2015"]
// 				}
// 			},
//       {
// 				test: /\.css$/,
// 				loader: "style-loader!css-loader"
// 			},
//       {
// 				test: /\.(png|jpg|woff|woff2|eot|ttf|otf)/,
// 				loader: 'url-loader'
// 			},
//       {
// 				test: /\.svg/,
// 				loader: 'file?name=/img/[hash].[ext]?'
// 			},
// 			{
// 				test: /\.scss$/,
// 				include: path.join(__dirname, 'app/src/'),
// 				loaders: extractCSS.extract(['css', 'sass'])
// 			},
// 		]
// 	},
//
// 	plugins: [
// 		new HtmlWebpackPlugin({
// 			title: 'Weather App',
// 			filename: 'index.html',
// 			template: './app/src/index.html'
// 		}),
// 		extractCSS
// 	],
//
// 	resolve: {
//     extensions: ['', '.js', '.json']
//   },
//
// 	htmlLoader: {
//     ignoreCustomFragments: [/\{\{.*?}}/],
//     root: path.resolve(__dirname, 'app/src/assets'),
//     attrs: ['img:src', 'link:href']
//   },
//
// 	jshint: {
// 		esversion: 6
// 	},
//
// 	devServer: {
// 		contentBase: './app/src'
// 	},
//
// 	debug: true
// };
//
// module.exports = config;
