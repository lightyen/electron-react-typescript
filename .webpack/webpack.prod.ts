// @ts-check
import webpackMerge from "webpack-merge"
import createBaseConfig from "./webpack.common"
import type { Configuration, Plugin } from "webpack"

import { CleanWebpackPlugin } from "clean-webpack-plugin"
import TerserPlugin from "terser-webpack-plugin"
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin"
import path from "path"

process.env.NODE_ENV = "production"

const plugins: Plugin[] = [
	new CleanWebpackPlugin({
		cleanOnceBeforeBuildPatterns: ["**/*", "!main.js"],
		cleanAfterEveryBuildPatterns: ["assets"],
	}),
]

const config: Configuration = {
	mode: "production",
	externals: ["lodash"],
	stats: {
		children: false,
		modules: false,
		entrypoints: false,
	},
	performance: {
		hints: "warning",
		maxEntrypointSize: 1 << 20, // Maybe bigger in electron application?
		maxAssetSize: 1 << 20,
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
	resolve: {
		alias: {},
	},
	plugins,
}

export default webpackMerge(createBaseConfig(), config)