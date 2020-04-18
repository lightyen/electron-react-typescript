// @ts-check
const webpackMerge = require("webpack-merge")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const path = require("path")
const createBaseConfig = require("./webpack.common")

process.env.NODE_ENV = "production"

/**
 * @type {import("webpack").Plugin[]}
 */
const plugins = [
    new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ["**/*", "!main.js"],
        cleanAfterEveryBuildPatterns: ["assets"],
    }),
]

/**
 * @type { import("webpack").Configuration }
 */
const config = {
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

module.exports = webpackMerge(createBaseConfig(), config)
