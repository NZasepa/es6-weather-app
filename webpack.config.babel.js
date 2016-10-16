const path = require('path');
const webpack = require('webpack');
const validate = require('webpack-validator');
const OfflinePlugin = require('offline-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const { getIfUtils, removeEmpty } = require('webpack-config-utils');

const webpackConfiguration = env => {
	const { ifProduction, ifNotProduction } = getIfUtils(env);

	const config = validate({
		context: path.join(__dirname, 'app/src'),

		entry: {
			app: './bootstrap.js'
		},

		output: {
			filename: ifProduction('bundle.[name].[chunkhash].js', 'bundle.[name].js'),
			path: path.join(__dirname, 'app/dist'),
			pathinfo: ifNotProduction()
		},

		devtool: ifProduction('source-map', 'eval'),

		resolve: {
	    extensions: [ '', '.js', '.es6', '.css', '.scss' ]
	  },

		postcss: [
			autoprefixer({
				browsers: [ 'last 2 versions' ]
			})
		],

		module: {
			preLoaders: [
				{
					test: /\.(js|es6)$/,
					loader: 'jshint',
					exclude: /node_modules/
				}
			],
			loaders: [
				{
					test: /\.(js|es6)$/,
					loader: 'babel-loader',
					exclude: /node_modules/
				},
				{
					test: /\.(scss|css)$/,
					loader: ExtractTextPlugin.extract('style', 'css?module&localIdentName=[hash:base64:5]!sass')
				},
				{
					test: /\.(png|jpg|jpeg|gif|woff)$/,
					loader: 'url?limit=8192'
				},
				{
					test: /\.(otf|eot|ttf)$/,
					loader: "file?prefix=font/"
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

module.exports = webpackConfiguration(process.env);

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
