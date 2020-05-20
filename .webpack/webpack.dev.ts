import { HotModuleReplacementPlugin } from "webpack"
import webpackMerge from "webpack-merge"
import createBaseConfig from "./webpack.common"
import type { Configuration } from "webpack"

const defaultPort = 3000
process.env.NODE_ENV = "development"

const config: Configuration = {
	mode: "development",
	stats: {
		children: false,
		modules: false,
		entrypoints: false,
	},
	performance: {
		hints: false,
		assetFilter: filename => {
			return filename.endsWith(".css") || filename.endsWith(".js")
		},
	},
	resolve: {
		alias: {
			"react-dom": "@hot-loader/react-dom",
		},
	},
	plugins: [new HotModuleReplacementPlugin()],
	devServer: {
		hot: true,
		compress: true,
		open: false,
		host: "localhost",
		port: defaultPort,
		public: `localhost:${defaultPort}`,
		publicPath: "/",
		clientLogLevel: "none",
		contentBase: false,
		quiet: true,
		noInfo: true,
		historyApiFallback: true,
	},
}

export default webpackMerge(createBaseConfig(), config)
