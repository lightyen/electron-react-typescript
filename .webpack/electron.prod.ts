import { CleanWebpackPlugin } from "clean-webpack-plugin"
import WebpackBarPlugin from "webpackbar"
import TsPathsResolvePlugin from "ts-paths-resolve-plugin"
import type { Configuration, Plugin } from "webpack"
import path from "path"

process.env.NODE_ENV = "production"

function createBaseConfig(): Configuration {
	const workingDirectory = process.cwd()
	const src = path.resolve(workingDirectory, "src", "main")
	const dist = path.resolve(workingDirectory, "dist")
	const tsconfigPath = path.resolve(src, "tsconfig.json")

	const plugins: Plugin[] = [
		new WebpackBarPlugin({ name: "Electron Main", color: "blue", profile: true }),
		new CleanWebpackPlugin({
			verbose: true,
			cleanOnceBeforeBuildPatterns: ["**/*"],
		}),
	]

	return {
		mode: "production",
		entry: {
			index: path.join(src, "index.ts"),
		},
		output: {
			path: dist,
			filename: "main.js",
		},
		target: "electron-main",
		devtool: "inline-source-map",
		module: {
			rules: [
				{
					test: /\.ts$/,
					exclude: /node_modules/,
					use: [{ loader: "ts-loader", options: { context: path.resolve(src), configFile: tsconfigPath } }],
				},
				{
					test: /\.node$/,
					use: "node-loader",
				},
				{
					enforce: "pre",
					test: /\.(js|ts)$/,
					exclude: /node_modules/,
					loader: "eslint-loader",
				},
			],
		},
		resolve: {
			extensions: [".ts", ".js", ".json"],
			plugins: [new TsPathsResolvePlugin({ configFile: tsconfigPath })],
		},
		plugins,
	}
}

const config: Configuration = {
	mode: "production",

	plugins: [
		new CleanWebpackPlugin({
			verbose: true,
			cleanOnceBeforeBuildPatterns: ["**/*"],
		}),
	],
}

export default createBaseConfig()
