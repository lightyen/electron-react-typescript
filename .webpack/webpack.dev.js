// @ts-check
const { HotModuleReplacementPlugin } = require("webpack")
const webpackMerge = require("webpack-merge")
const createBaseConfig = require("./webpack.common")
const defaultPort = 3000

process.env.NODE_ENV = "development"

/**
 * @type { import("webpack").Configuration }
 */
const config = {
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
    output: {
        publicPath: `http://localhost:${defaultPort}/`,
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

module.exports = webpackMerge(createBaseConfig(), config)
