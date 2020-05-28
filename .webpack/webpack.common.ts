import packageJSON from "../package.json"

import path from "path"
import { EnvironmentPlugin, ExtendedAPIPlugin } from "webpack"

// Plugins
import HtmlWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import WebpackBarPlugin from "webpackbar"
import TsPathsResolvePlugin from "ts-paths-resolve-plugin"

import type { Configuration, Plugin, Loader } from "webpack"

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

	const plugins: Plugin[] = [
		new WebpackBarPlugin({ color: "#41f4d0", name: "Electron Renderer" }),
		new EnvironmentPlugin({
			NODE_ENV: "development",
			PUBLIC_URL: "",
			APP_NAME: packageJSON.name,
			TAILWIND_CONFIG: JSON.stringify(require(path.resolve(workingDirectory, "tailwind.config"))),
		}),
		new MiniCssExtractPlugin({
			filename: join_network(outputCSS, "[name].[contenthash:8].css"),
			chunkFilename: join_network(outputCSS, "[name].[contenthash:8].chunk.css"),
		}),
		new HtmlWebpackPlugin({
			inject: false,
			filename: "index.html",
			title: packageJSON.name,
			minify: false,
			template: path.join(src, "template", "index.pug"),
			favicon: path.join(workingDirectory, "assets", "images", "favicon.ico"),
			isDevelopment,
		}),
	]

	if (!isDevelopment) {
		plugins.push(new ExtendedAPIPlugin())
	}

	/**
	 * @type {import("webpack").Loader}
	 * See [style-loader]{@link https://github.com/webpack-contrib/style-loader} and [mini-css-extract-plugin]{@link https://github.com/webpack-contrib/mini-css-extract-plugin}.
	 */
	const styleLoader: Loader = {
		loader: isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
		options: {
			...(!isDevelopment && { publicPath: path.relative(path.join(publicPath, outputCSS), publicPath) }),
		},
	}

	return {
		target: "web",
		devtool: "inline-source-map",
		plugins,
		// NOTE: https://webpack.js.org/configuration/resolve/
		resolve: {
			extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
			plugins: [new TsPathsResolvePlugin({ configFile: path.resolve(src, "tsconfig.json") })],
		},
		entry: {
			index: path.join(src, "index.tsx"),
		},
		output: {
			path: dist,
			filename: join_network(outputJS, "[name].[hash:8].js"),
			chunkFilename: join_network(outputJS, "[name].[hash:8].chunk.js"),
			publicPath,
		},

		module: {
			rules: [
				{
					test: /\.pug$/,
					include: /template/,
					use: [
						{
							loader: "pug-loader",
							options: { pretty: true },
						},
					],
				},
				{
					test: /\.worker\.ts$/,
					exclude: /node_modules/,
					use: [
						{ loader: "worker-loader" },
						{ loader: "babel-loader" },
						{ loader: "ts-loader", options: { happyPackMode: true } },
					],
				},
				{
					test: /\.tsx?$/,
					exclude: /node_modules|\.test.tsx?|\.worker\.ts$/,
					use: [
						{
							loader: "cache-loader",
							options: { cacheDirectory: path.resolve(".cache") },
						},
						{ loader: "thread-loader" },
						{ loader: "babel-loader" },
						{ loader: "ts-loader", options: { happyPackMode: true } },
					],
				},
				{
					test: /\.jsx$/,
					use: [{ loader: "babel-loader" }],
				},
				{
					test: /\.(png|jpe?g|gif|svg|ico)$/i,
					use: [
						{
							loader: "url-loader",
							options: {
								name: join_network("assets", "images", "[name].[ext]?[hash:8]"),
								limit: 8192,
							},
						},
					],
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
								name: "[name].[ext]?[hash:8]",
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
				{
					exclude: /node_modules/,
					test: /\.less$/,
					use: [
						styleLoader,
						{
							loader: "css-loader",
							options: {
								url: true,
								modules: true,
								camelCase: "only",
								localIdentName: "[local]-[hash:base64:6]",
								importLoaders: 2,
							},
						},
						"postcss-loader",
						"less-loader",
					],
				},
				{
					exclude: /node_modules/,
					test: /\.s(a|c)ss$/,
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
						{
							loader: "sass-loader",
							options: {
								sourceMap: true,
							},
						},
					],
				},
				// For node_modules:
				{
					include: /node_modules/,
					test: /.css$/,
					use: [styleLoader, "css-loader", "postcss-loader"],
				},
				{
					include: /node_modules/,
					test: /\.less$/,
					use: [styleLoader, "css-loader", "postcss-loader", "less-loader"],
				},
				{
					include: /node_modules/,
					test: /\.s(a|c)ss$/,
					use: [styleLoader, "css-loader", "postcss-loader", "sass-loader"],
				},
			],
		},
	}
}
