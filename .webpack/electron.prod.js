// @ts-check
const webpackMerge = require("webpack-merge")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const createBaseConfig = require("./electron")

process.env.NODE_ENV = "production"

/**
 * @type { import("webpack").Configuration }
 */
const config = {
    mode: "production",
    plugins: [
        new CleanWebpackPlugin({
            verbose: true,
            cleanOnceBeforeBuildPatterns: ["**/*"],
        }),
    ],
}

module.exports = webpackMerge(createBaseConfig({}), config)
