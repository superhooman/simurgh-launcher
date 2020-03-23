const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
	target: 'electron-renderer',
	entry: './app/src/entry.js',
	devServer: {
		contentBase: path.join(__dirname, '/app'),
		compress: true,
		port: 9000
	},
	output: {
		path: path.join(__dirname, '/app/build'),
		publicPath: 'build/',
		filename: 'bundle.js'
	},
	plugins: [new MiniCssExtractPlugin()],
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader'
			},
			{
				test: /\.css$/,
				loader: [MiniCssExtractPlugin.loader, 'css-loader']
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				loader: 'file-loader',
				query: {
					name: '[name].[ext]?[hash]'
				}
			}
		]
	}

};
