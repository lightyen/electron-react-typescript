// @ts-check
const webpackMerge = require("webpack-merge")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

const createBaseConfig = require("./electron")

process.env.NODE_ENV = "development"

/**
 * @type { import("webpack").Configuration }
 */
const config = {
    mode: "development",
    stats: "errors-only",
    devtool: "source-map",
    resolve: {
        alias: {},
    },
    plugins: [new CleanWebpackPlugin({})],
}
module.exports = webpackMerge(createBaseConfig({}), config)
