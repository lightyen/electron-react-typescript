// @ts-ignore
const packageJSON = require("../package.json")

// @ts-check
const { EnvironmentPlugin, DllReferencePlugin, ExtendedAPIPlugin } = require("webpack")
const path = require("path")

// Plugins
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const WebpackBarPlugin = require("webpackbar")

// NOTE: 關閉 webpack 要求 donate 訊息
process.env.DISABLE_OPENCOLLECTIVE = "true"

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
    const src = (options && options.src) || path.resolve(workingDirectory, "src", "renderer")
    const dist = (options && options.dist) || path.resolve(workingDirectory, "dist")
    const assets = path.resolve(workingDirectory, "assets")
    const vendor = options.vendor
    const isDevelopment = process.env.NODE_ENV === "development"

    process.env.PUBLIC_URL = process.env.PUBLIC_URL || ""

    const entry = {
        index: path.join(src, "index.tsx"),
    }

    /**
     * @type {import("webpack").Plugin[]}
     */
    const plugins = [
        new WebpackBarPlugin({ color: "#41f4d0", name: "Electron Renderer" }),
        new EnvironmentPlugin({
            NODE_ENV: process.env.NODE_ENV,
            PUBLIC_URL: process.env.PUBLIC_URL,
            APP_NAME: packageJSON.name,
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash:8].css",
            chunkFilename: "[name].[contenthash:8].chunk.css",
        }),
    ]

    for (const name in entry) {
        if (entry.hasOwnProperty(name)) {
            const exclude = Object.keys(entry).slice()
            exclude.splice(Object.keys(entry).indexOf(name), 1)
            plugins.push(
                new HtmlWebpackPlugin({
                    filename: `${name}.html`,
                    excludeChunks: exclude,
                    title: packageJSON.name,
                    minify: false,
                    inject: false,
                    template: path.join(src, "template", `${name}.pug`),
                    favicon: path.join(assets, "images", "favicon.ico"),
                    vendor: vendor ? "./vendor/vendor.js" : undefined,
                }),
            )
        }
    }

    if (vendor) {
        plugins.push(
            new DllReferencePlugin({
                context: vendor,
                manifest: require(path.join(vendor, "manifest.json")),
            }),
        )
    }

    if (!isDevelopment) {
        plugins.push(new ExtendedAPIPlugin())
    }

    /**
     * @type {import("webpack").Loader}
     * See [style-loader]{@link https://github.com/webpack-contrib/style-loader} and [mini-css-extract-plugin]{@link https://github.com/webpack-contrib/mini-css-extract-plugin}.
     */
    const styleLoader = {
        loader: isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
    }

    /**
     * @type {import("webpack").Loader}
     * See [url-loader]{@link https://github.com/webpack-contrib/url-loader} and [file-loader]{@link https://github.com/webpack-contrib/file-loader}.
     */
    const imageLoader = {
        loader: "file-loader",
        options: {
            name: "[name].[ext]?[hash:8]",
        },
    }

    /**
     * @type {import("webpack").Loader}
     */
    const fontLoader = {
        loader: "file-loader",
        options: {
            name: "[name].[ext]?[hash:8]",
        },
    }

    const tsconfigPath = path.join(src, "tsconfig.json")

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

    /**
     * @type {import("webpack").Loader}
     */
    const tsxLoader = {
        loader: "awesome-typescript-loader",
        options: {
            configFileName: path.join(src, "tsconfig.json"),
            silent: true,
            useBabel: true,
            useCache: true,
            babelCore: "@babel/core",
            babelOptions: {
                babelrc: true,
            },
        },
    }

    /*
     * @type {import("webpack").Loader}
     */
    const jsxLoader = {
        loader: "babel-loader",
    }

    return {
        entry,
        output: {
            path: dist,
            filename: "[name].[hash:8].js",
            chunkFilename: "[name].[hash:8].chunk.js",
            publicPath: "./",
        },
        target: "electron-renderer",
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
                    use: tsxLoader,
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
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
                                url: false,
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
                                url: false,
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
            // plugins: [
            //     new TsConfigPathsPlugin({
            //         configFileName: path.resolve(src, "tsconfig.json"),
            //     }),
            // ],
            alias: {
                assets: path.join(assets),
                ...convertPathsToAliases(tsconfigPath),
            },
        },
        plugins,
    }
}
