import { HotModuleReplacementPlugin } from "webpack"
import webpackMerge from "webpack-merge"
import createBaseConfig from "./webpack.common"
import type { Configuration } from "webpack"
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin"
import path from "path"

const defaultPort = 3000
process.env.NODE_ENV = "development"

const config: Configuration = {
	mode: "development",
	stats: {
		children: false,
		modules: false,
		entrypoints: false,
	},
	performance: {
		hints: false,
		assetFilter: filename => {
			return filename.endsWith(".css") || filename.endsWith(".js")
		},
	},
	module: {
		rules: [
			{
				test: /\.worker\.ts$/,
				exclude: /node_modules/,
				use: ["worker-loader", "babel-loader", { loader: "ts-loader", options: { happyPackMode: true } }],
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules|\.test.tsx?|\.worker\.ts$/,
				use: [
					{
						loader: "cache-loader",
						options: { cacheDirectory: path.resolve(".cache") },
					},
					"thread-loader",
					"babel-loader",
					{ loader: "ts-loader", options: { happyPackMode: true } },
				],
			},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: ["thread-loader", "babel-loader"],
			},
		],
	},
	resolve: {
		alias: {
			"react-dom": "@hot-loader/react-dom",
		},
	},
	plugins: [
		new HotModuleReplacementPlugin(),
		new ForkTsCheckerWebpackPlugin({
			typescript: {
				configFile: path.join(process.cwd(), "src", "renderer", "tsconfig.json"),
			},
			eslint: {
				files: path.join(process.cwd(), "src", "**/*"),
			},
		}),
	],
	devServer: {
		hot: true,
		compress: true,
		open: false,
		host: "localhost",
		port: defaultPort,
		public: `localhost:${defaultPort}`,
		publicPath: "/",
		clientLogLevel: "none",
		contentBase: false,
		noInfo: true,
		historyApiFallback: true,
	},
}

export default webpackMerge(createBaseConfig(), config)
