import WebpackBarPlugin from "webpackbar"
import TsPathsResolvePlugin from "ts-paths-resolve-plugin"
import type { Configuration, Compiler } from "webpack"
import { ExternalsPlugin } from "webpack"
import ESLintPlugin from "eslint-webpack-plugin"
import path from "path"

process.env.NODE_ENV = "production"

class ExternalsVendorPlugin {
	externals: Record<string, string>
	constructor(...deps: string[]) {
		this.externals = {}
		for (const dep of deps) {
			this.externals[dep] = dep
		}
	}
	apply(compiler: Compiler) {
		new ExternalsPlugin("commonjs", this.externals).apply(compiler)
	}
}

const workingDirectory = process.cwd()
const src = path.resolve(workingDirectory, "src", "main")
const dist = path.resolve(workingDirectory, "dist")
const tsConfigPath = path.resolve(src, "tsconfig.json")

const config: Configuration = {
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
		],
	},
	resolve: {
		extensions: [".ts", ".js", ".json"],
		plugins: [new TsPathsResolvePlugin({ tsConfigPath })],
	},
	plugins: [
		new ESLintPlugin({ context: src, extensions: ["js", "jsx", "ts", "tsx"] }),
		new WebpackBarPlugin({ name: "Electron Main", color: "blue", profile: true }),
		new ExternalsVendorPlugin("leveldown"),
	],
}

export default config
