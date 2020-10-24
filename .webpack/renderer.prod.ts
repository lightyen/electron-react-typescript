import type { Configuration } from "webpack"
import { merge } from "webpack-merge"
import createBaseConfig from "./webpack.common"
import path from "path"

import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin"
import TerserPlugin from "terser-webpack-plugin"
import CssMinimizerPlugin from "css-minimizer-webpack-plugin"
import ESLintPlugin from "eslint-webpack-plugin"

process.env.NODE_ENV = "production"

const workingDirectory = process.cwd()
const src = path.resolve(workingDirectory, "src", "renderer")
const tsConfigPath = path.resolve(src, "tsconfig.json")

const config: Configuration = {
	mode: "production",
	target: "web",
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
				parallel: true,
			}),
			new CssMinimizerPlugin(),
		],
	},
	module: {
		rules: [
			{
				test: /\.worker\.ts$/,
				exclude: /node_modules/,
				use: [
					"worker-loader",
					"babel-loader",
					{
						loader: "ts-loader",
						options: { context: src, happyPackMode: true },
					},
				],
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules|\.test.tsx?|\.worker\.ts$/,
				use: ["babel-loader", { loader: "ts-loader", options: { context: src, happyPackMode: true } }],
			},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: ["babel-loader"],
			},
		],
	},
	plugins: [
		new ESLintPlugin({ context: src, extensions: ["js", "jsx", "ts", "tsx"] }),
		new ForkTsCheckerWebpackPlugin({
			typescript: {
				configFile: tsConfigPath,
				diagnosticOptions: {
					semantic: true,
					syntactic: true,
				},
			},
		}),
	],
}

export default merge(createBaseConfig(), config)
