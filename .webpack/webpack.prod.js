// @ts-check
const webpackMerge = require("webpack-merge")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const path = require("path")
const createBaseConfig = require("./webpack.common")

process.env.NODE_ENV = "production"

/** Externals */
const vendorPath = "" // path.resolve(process.cwd(), "dist", "vendor")

/**
 * @type {import("webpack").Plugin[]}
 */
const plugins = [
    new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: vendorPath
            ? ["**/*", "!vendor", "!vendor/vendor.js", "!vendor/manifest.json", "!main.js"]
            : ["**/*", "!main.js"],
    }),
]

/**
 * @type { import("webpack").Configuration }
 */
const config = {
    mode: "production",
    devtool: "source-map",
    stats: {
        children: false,
        modules: false,
        entrypoints: false,
    },
    performance: {
        hints: "warning",
        maxEntrypointSize: 614400,
        maxAssetSize: 614400,
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

module.exports = webpackMerge(
    createBaseConfig({
        vendor: vendorPath,
    }),
    config,
)
