import { merge } from "webpack-merge"
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer"
import base from "./webpack.common"

export default merge(base(), {
	mode: "development",
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
				use: ["babel-loader", { loader: "ts-loader", options: { happyPackMode: true } }],
			},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: ["thread-loader", "babel-loader"],
			},
		],
	},
	plugins: [
		new BundleAnalyzerPlugin({
			analyzerMode: "server",
			analyzerHost: "127.0.0.1",
			analyzerPort: 0,
			reportFilename: "report.html",
			defaultSizes: "parsed",
			openAnalyzer: true,
			generateStatsFile: false,
			statsFilename: "stats.json",
			statsOptions: null,
			logLevel: "info",
		}),
	],
})
