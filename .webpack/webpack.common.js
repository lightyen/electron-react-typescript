// @ts-ignore
const packageJSON = require("../package.json")
const tailwindcfg = require("../tailwind.config")

// @ts-check
const { EnvironmentPlugin, ExtendedAPIPlugin } = require("webpack")
const path = require("path")

// Plugins
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const WebpackBarPlugin = require("webpackbar")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")

// NOTE: 關閉 webpack 要求 donate 訊息
process.env.DISABLE_OPENCOLLECTIVE = "true"

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
    const src = (options && options.src) || path.resolve(workingDirectory, "src", "renderer")
    const dist = (options && options.dist) || path.resolve(workingDirectory, "dist")
    const assets = path.resolve(workingDirectory, "assets")
    const isDevelopment = process.env.NODE_ENV === "development"
    const tsconfigPath = path.resolve(src, "tsconfig.json")
    process.env.PUBLIC_URL = process.env.PUBLIC_URL || ""

    /**
     * @type {import("webpack").Plugin[]}
     */
    const plugins = [
        new WebpackBarPlugin({ color: "#41f4d0", name: "Electron Renderer" }),
        new EnvironmentPlugin({
            NODE_ENV: process.env.NODE_ENV,
            PUBLIC_URL: process.env.PUBLIC_URL,
            APP_NAME: packageJSON.name,
            TAILWIND_CONFIG: JSON.stringify(tailwindcfg),
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].[contenthash:8].css",
            chunkFilename: "css/[name].[contenthash:8].chunk.css",
        }),
        new HtmlWebpackPlugin({
            inject: false,
            filename: "index.html",
            title: packageJSON.name,
            minify: false,
            template: path.join(src, "template", "index.pug"),
            favicon: path.join(assets, "images", "favicon.ico"),
            isDevelopment,
        }),
        new ForkTsCheckerWebpackPlugin({
            checkSyntacticErrors: true,
            tsconfig: tsconfigPath,
        }),
    ]

    if (!isDevelopment) {
        plugins.push(new ExtendedAPIPlugin())
    }

    /**
     * @type {import("webpack").Loader}
     * See [style-loader]{@link https://github.com/webpack-contrib/style-loader} and [mini-css-extract-plugin]{@link https://github.com/webpack-contrib/mini-css-extract-plugin}.
     */
    const styleLoader = {
        loader: isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
        options: {
            ...(!isDevelopment && {
                publicPath: "../",
            }),
        },
    }

    /**
     * @type {import("webpack").Loader}
     * See [url-loader]{@link https://github.com/webpack-contrib/url-loader} and [file-loader]{@link https://github.com/webpack-contrib/file-loader}.
     */
    const imageLoader = {
        loader: "file-loader",
        options: {
            name: "[name].[ext]?[hash:8]",
            outputPath: "assets/images",
        },
    }

    /**
     * @type {import("webpack").Loader}
     */
    const fontLoader = {
        loader: "file-loader",
        options: {
            name: "[name].[ext]?[hash:8]",
            outputPath: "assets/fonts",
        },
    }

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
            index: path.join(src, "index.tsx"),
        },
        output: {
            path: dist,
            filename: "js/[name].[hash:8].js",
            chunkFilename: "js/[name].[hash:8].chunk.js",
            publicPath: "./",
        },
        target: "web",
        module: {
            rules: [
                {
                    test: /\.pug$/,
                    include: /template/,
                    use: [
                        {
                            loader: "pug-loader",
                            options: {
                                pretty: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules|\.test.tsx?$/,
                    use: [
                        {
                            loader: "cache-loader",
                            options: {
                                cacheDirectory: path.resolve(".cache"),
                            },
                        },
                        { loader: "thread-loader" },
                        { loader: "babel-loader" },
                        { loader: "ts-loader", options: { happyPackMode: true } },
                    ],
                },
                // {
                //     test: /\.jsx?$/,
                //     exclude: /node_modules|\.test.tsx?$/,
                //     use: ["babel-loader", "thread-loader"],
                // },
                {
                    test: /\.(png|jpe?g|gif|svg|ico)$/i,
                    use: imageLoader,
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
                    use: fontLoader,
                },
                // For user space:
                {
                    exclude: /node_modules/,
                    test: /\.css$/,
                    use: [
                        styleLoader,
                        {
                            loader: "css-loader",
                            options: {
                                url: true,
                                sourceMap: true,
                            },
                        },
                        "postcss-loader",
                    ],
                },
                {
                    exclude: /node_modules/,
                    test: /\.less$/,
                    use: [
                        styleLoader,
                        {
                            loader: "css-loader",
                            options: {
                                url: true,
                                modules: true,
                                camelCase: "only",
                                localIdentName: "[local]-[hash:base64:6]",
                                importLoaders: 2,
                            },
                        },
                        "postcss-loader",
                        "less-loader",
                    ],
                },
                {
                    exclude: /node_modules/,
                    test: /\.s(a|c)ss$/,
                    use: [
                        styleLoader,
                        {
                            loader: "css-loader",
                            options: {
                                url: true,
                                sourceMap: true,
                            },
                        },
                        "postcss-loader",
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true,
                            },
                        },
                    ],
                },
                // For node_modules:
                {
                    include: /node_modules/,
                    test: /.css$/,
                    use: [styleLoader, "css-loader", "postcss-loader"],
                },
                {
                    include: /node_modules/,
                    test: /\.less$/,
                    use: [styleLoader, "css-loader", "postcss-loader", "less-loader"],
                },
                {
                    include: /node_modules/,
                    test: /\.s(a|c)ss$/,
                    use: [styleLoader, "css-loader", "postcss-loader", "sass-loader"],
                },
            ],
        },
        // NOTE: https://webpack.js.org/configuration/resolve/
        resolve: {
            extensions: [".ts", ".tsx", ".js"],
            alias: {
                assets: path.join(assets),
                ...convertPathsToAliases(tsconfigPath),
            },
        },
        plugins,
    }
}
