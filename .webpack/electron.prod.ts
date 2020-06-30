import { CleanWebpackPlugin } from "clean-webpack-plugin"
import WebpackBarPlugin from "webpackbar"
import TsPathsResolvePlugin from "ts-paths-resolve-plugin"
import type { Configuration, Plugin, Compiler } from "webpack"
import { ExternalsPlugin } from "webpack"
import merge from "webpack-merge"
import createBaseConfig from "./webpack.common"
import TerserPlugin from "terser-webpack-plugin"
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin"
import path from "path"

process.env.NODE_ENV = "production"

class ExNodeTargetPlugin implements Plugin {
	apply(compiler: Compiler) {
		new ExternalsPlugin("commonjs", "sharp")
	}
}

const mainConfig = (function (): Configuration {
	const workingDirectory = process.cwd()
	const src = path.resolve(workingDirectory, "src", "main")
	const dist = path.resolve(workingDirectory, "dist")
	const tsconfigPath = path.resolve(src, "tsconfig.json")
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
					test: /\.(js|ts)$/,
					exclude: /node_modules/,
					use: [
						{
							loader: "ts-loader",
							options: {
								context: src,
								compilerOptions: {
									allowJs: true,
								},
							},
						},
					],
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
		plugins: [
			new WebpackBarPlugin({ name: "Electron Main", color: "blue", profile: true }),
			new CleanWebpackPlugin({
				verbose: true,
				cleanOnceBeforeBuildPatterns: ["**/*"],
			}),
			new ExNodeTargetPlugin(),
		],
	}
})()

const rendererConfig = (function (): Configuration {
	return merge(createBaseConfig(), {
		mode: "production",
		externals: ["lodash"],
		stats: {
			children: false,
			modules: false,
			entrypoints: false,
		},
		performance: {
			hints: "warning",
			maxEntrypointSize: 10 << 20, // Make it bigger in electron?
			maxAssetSize: 10 << 20,
			assetFilter: filename => {
				const ext = path.extname(filename)
				return ext === "css" || ext === ".js"
			},
		},
		optimization: {
			minimizer: [
				new TerserPlugin({
					sourceMap: true,
					parallel: true,
				}),
				new OptimizeCSSAssetsPlugin(),
			],
		},
		module: {
			rules: [
				{
					enforce: "pre",
					test: /\.(jsx?|tsx?)$/,
					exclude: /node_modules/,
					loader: "eslint-loader",
				},
				{
					test: /\.worker\.ts$/,
					exclude: /node_modules/,
					use: [
						"worker-loader",
						"babel-loader",
						{
							loader: "ts-loader",
							options: { context: path.join(process.cwd(), "src", "renderer") },
						},
					],
				},
				{
					test: /\.tsx?$/,
					exclude: /node_modules|\.test.tsx?|\.worker\.ts$/,
					use: [
						"babel-loader",
						{
							loader: "ts-loader",
							options: {
								context: path.join(process.cwd(), "src", "renderer"),
								compilerOptions: {
									allowJs: true,
								},
							},
						},
					],
				},
				{
					test: /\.jsx?$/,
					use: ["babel-loader"],
				},
			],
		},
		plugins: [
			new CleanWebpackPlugin({
				cleanOnceBeforeBuildPatterns: ["**/*", "!main.js"],
				cleanAfterEveryBuildPatterns: ["assets"],
			}),
		],
	})
})()

export default [mainConfig, rendererConfig]
