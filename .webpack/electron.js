// @ts-ignore
const packageJSON = require("../package.json")
process.env.APP_NAME = packageJSON.name

// @ts-check
const path = require("path")

const WebpackBarPlugin = require("webpackbar")

/** @typedef {{
 *    dist?: string
 *    src?: string
 * }} Options */

/**
 * @param {Options} [options]
 *
 * @returns { import("webpack").Configuration }
 */
module.exports = function (options) {
    const workingDirectory = process.cwd()
    const src = (options && options.src) || path.resolve(workingDirectory, "src", "main")
    const dist = (options && options.dist) || path.resolve(workingDirectory, "dist")
    const tsconfigPath = path.resolve(src, "tsconfig.json")

    /**
     * @type {import("webpack").Plugin[]}
     */
    const plugins = [new WebpackBarPlugin({ name: "Electron Main", color: "blue", profile: true })]

    function convertPathsToAliases(configPath) {
        const config = require(configPath)
        const basePath = path.dirname(configPath)
        let ret = {}
        const options = config.compilerOptions
        if (options) {
            const paths = config.compilerOptions.paths
            if (paths) {
                for (const k of Object.keys(paths)) {
                    ret[path.dirname(k)] = path.dirname(path.join(basePath, options.baseUrl, paths[k][0]))
                }
            }
        }
        return ret
    }

    return {
        entry: {
            index: path.join(src, "index.ts"),
        },
        output: {
            path: dist,
            filename: "main.js",
        },
        target: "electron-main",
        devtool: "source-map",
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: [{ loader: "ts-loader", options: { context: path.resolve(src), configFile: tsconfigPath } }],
                },
                {
                    test: /\.node$/,
                    use: "node-loader",
                },
            ],
        },
        resolve: {
            extensions: [".ts", ".js"],
            alias: {
                ...convertPathsToAliases(tsconfigPath),
            },
        },
        plugins,
    }
}
