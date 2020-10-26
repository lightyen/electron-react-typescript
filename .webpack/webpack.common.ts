import packageJSON from "../package.json"

import path from "path"
import { EnvironmentPlugin } from "webpack"

// Plugins
import HtmlWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import WebpackBarPlugin from "webpackbar"
import TsPathsResolvePlugin from "ts-paths-resolve-plugin"

import type { Configuration } from "webpack"

// NOTE: 關閉 webpack 要求 donate 訊息
process.env.DISABLE_OPENCOLLECTIVE = "true"

export default function (): Configuration {
	const outputCSS = "css"
	const outputJS = "js"
	const publicPath = "./"

	const workingDirectory = process.cwd()
	const src = path.resolve(workingDirectory, "src", "renderer")
	const dist = path.resolve(workingDirectory, "dist")
	const isDevelopment = process.env.NODE_ENV === "development"

	const join_network = (...args: string[]) => path.join(...args).replace(path.sep, "/")

	/**
	 * @type {import("webpack").Loader}
	 * See [style-loader]{@link https://github.com/webpack-contrib/style-loader} and [mini-css-extract-plugin]{@link https://github.com/webpack-contrib/mini-css-extract-plugin}.
	 */
	const styleLoader = {
		loader: isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
		options: {
			...(!isDevelopment && { publicPath: path.relative(path.join(publicPath, outputCSS), publicPath) }),
		},
	}

	return {
		plugins: [
			new WebpackBarPlugin({ color: "#41f4d0", name: "Electron Renderer" }),
			new EnvironmentPlugin({
				NODE_ENV: "development",
				PUBLIC_URL: "",
				APP_NAME: packageJSON.name,
				TAILWIND_CONFIG: JSON.stringify(require(path.resolve(workingDirectory, "tailwind.config"))),
			}),
			new MiniCssExtractPlugin({
				filename: join_network(outputCSS, "[name].css?[contenthash:8]"),
				chunkFilename: join_network(outputCSS, "[name].chunk.css?[contenthash:8]"),
			}),
			new HtmlWebpackPlugin({
				inject: true,
				title: packageJSON.name,
				minify: true,
				template: path.join(src, "index.ejs"),
				isDevelopment,
			}),
		],
		// NOTE: https://webpack.js.org/configuration/resolve/
		resolve: {
			extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
			plugins: [new TsPathsResolvePlugin({ tsConfigPath: path.resolve(src, "tsconfig.json") })],
		},
		entry: {
			index: path.join(src, "index.tsx"),
		},
		output: {
			path: dist,
			filename: join_network(outputJS, "[name].js?[fullhash:8]"),
			chunkFilename: join_network(outputJS, "[name].js?.[fullhash:8]"),
			publicPath,
		},
		module: {
			rules: [
				{
					test: /\.(png|jpe?g|gif|ico)$/i,
					use: [
						{
							loader: "url-loader",
							options: {
								name: join_network("assets", "images", "[name].[ext]?[fullhash:8]"),
								limit: 8192,
							},
						},
					],
				},
				{
					test: /\.svg$/i,
					use: ["babel-loader", "@svgr/webpack"],
				},
				{
					test: /\.ya?ml$/,
					use: "js-yaml-loader",
				},
				{
					test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
					use: [
						{
							loader: "file-loader",
							options: {
								name: "[name].[ext]?[fullhash:8]",
								outputPath: join_network("assets", "fonts"),
							},
						},
					],
				},
				// For user space:
				{
					exclude: /node_modules/,
					test: /\.css$/,
					use: [
						styleLoader,
						{
							loader: "css-loader",
							options: {
								url: true,
								sourceMap: true,
							},
						},
						"postcss-loader",
					],
				},
				// For node_modules:
				{
					include: /node_modules/,
					test: /.css$/,
					use: [styleLoader, "css-loader", "postcss-loader"],
				},
			],
		},
	}
}
