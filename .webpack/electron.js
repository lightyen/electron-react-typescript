// @ts-ignore
const packageJSON = require("../package.json")
process.env.APP_NAME = packageJSON.name

// @ts-check
const path = require("path")

const WebpackBarPlugin = require("webpackbar")
const { TsConfigPathsPlugin } = require("awesome-typescript-loader")

/** @typedef {{
 *    dist?: string
 *    src?: string
 *    vendor?: string
 * }} Options */

/**
 * @param {Options} options
 *
 * @returns { import("webpack").Configuration }
 */
module.exports = function(options) {
    const workingDirectory = process.cwd()
    const src = (options && options.src) || path.resolve(workingDirectory, "src", "main")
    const dist = (options && options.dist) || path.resolve(workingDirectory, "dist")

    /**
     * @type {import("webpack").Plugin[]}
     */
    const plugins = [new WebpackBarPlugin({ name: "Electron Main", color: "blue", profile: true })]

    return {
        entry: {
            index: path.join(src, "index.ts"),
        },
        output: {
            path: dist,
            filename: "main.js",
        },
        target: "electron-main",
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    loader: "awesome-typescript-loader",
                    options: {
                        configFileName: path.join(src, "tsconfig.json"),
                        silent: true,
                    },
                },
            ],
        },
        resolve: {
            extensions: [".ts", ".js", ".json"],
            alias: {},
            plugins: [
                new TsConfigPathsPlugin({
                    configFileName: path.join(src, "tsconfig.json"),
                }),
            ],
        },
        plugins,
    }
}
