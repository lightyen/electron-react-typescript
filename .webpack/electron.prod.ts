import { CleanWebpackPlugin } from "clean-webpack-plugin"
import WebpackBarPlugin from "webpackbar"
import type { Configuration, Plugin } from "webpack"
import packageJSON from "../package.json"
import path from "path"

process.env.APP_NAME = packageJSON.name
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

	function convertPathsToAliases(configPath: string) {
		const config = require(configPath)
		const basePath = path.dirname(configPath)
		let ret: { [key: string]: string } = {}
		const options = config.compilerOptions
		if (options) {
			const paths = config.compilerOptions.paths
			if (paths) {
				for (const k of Object.keys(paths)) {
					ret[path.dirname(k)] = path.dirname(path.join(basePath, options.baseUrl, paths[k][0]))
				}
			}
		}
		return ret
	}

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
		devtool: "source-map",
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
			],
		},
		resolve: {
			extensions: [".ts", ".js", ".json"],
			alias: {
				...convertPathsToAliases(tsconfigPath),
			},
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
