import type { Configuration } from "webpack"
import { merge } from "webpack-merge"
import createBaseConfig from "./webpack.common"
import TerserPlugin from "terser-webpack-plugin"
import CssMinimizerPlugin from "css-minimizer-webpack-plugin"
import ESLintPlugin from "eslint-webpack-plugin"
import path from "path"

process.env.NODE_ENV = "production"

const workingDirectory = process.cwd()
const src = path.resolve(workingDirectory, "src", "renderer")

const config: Configuration = {
	mode: "production",
	target: "web",
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
						options: { context: src },
					},
				],
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules|\.test.tsx?|\.worker\.ts$/,
				use: ["babel-loader", { loader: "ts-loader", options: { context: src } }],
			},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: ["babel-loader"],
			},
		],
	},
	plugins: [new ESLintPlugin({ context: src, extensions: ["js", "jsx", "ts", "tsx"] })],
}

export default merge(createBaseConfig(), config)
