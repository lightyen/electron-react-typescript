// @ts-check
const { NamedModulesPlugin, HotModuleReplacementPlugin, NamedChunksPlugin } = require("webpack")
const webpackMerge = require("webpack-merge")
const path = require("path")
const createBaseConfig = require("./webpack.common")
const defaultPort = 3000
process.env.NODE_ENV = "development"
process.env.PUBLIC_URL = ""

/**
 * @type { import("webpack").Configuration }
 */
const config = {
    mode: "development",
    devtool: "source-map",
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
    plugins: [new NamedModulesPlugin(), new HotModuleReplacementPlugin(), new NamedChunksPlugin()],
    output: {
        publicPath: "http://localhost:3000/",
    },
    devServer: {
        hot: true,
        compress: true,
        host: "localhost",
        port: defaultPort,
        public: `localhost:${defaultPort}`,
        publicPath: "/",
        clientLogLevel: "warning",
        contentBase: false,
        stats: {
            all: false,
            colors: true,
            builtAt: true,
            errors: true,
            cached: true,
            cachedAssets: true,
            warnings: true,
        },
        historyApiFallback: true,
    },
}

module.exports = webpackMerge(createBaseConfig({}), config)
