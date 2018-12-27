const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const baseConfig = require("./webpack.base.config");
const { HotModuleReplacementPlugin } = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const isDevelopment = process.env.NODE_ENV === "production" ? false : true;

module.exports = merge(baseConfig, {
    entry: "./src/renderer/renderer.ts",
    target: "electron-renderer",
    output: {
        filename: "renderer.bundle.js"
    },
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin()
        ]
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [
                    isDevelopment ? "cache-loader" : null,
                    "vue-loader"
                ].filter(a => a)
            },
            {
                test: /\.pug$/,
                use: [
                    isDevelopment ? "cache-loader" : null,
                    "pug-plain-loader"
                ].filter(a => a)
            },
            {
                test: /\.styl(us)?$/,
                use: [
                    isDevelopment ? "cache-loader" : null,
                    isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
                    "css-loader",
                    isDevelopment ? null : "postcss-loader",
                    "stylus-loader"
                ].filter(a => a)
            },
            {
                test: /\.node$/,
                loader: "node-loader"
            },
            {
                test: /\.woff2$/,
                loader: "file-loader",
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/index.html",
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                conservativeCollapse: true
            }
        }),
        new HotModuleReplacementPlugin(),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].[hash].css",
            chunkFilename: "[id].[hash].css"
        }),
    ]
});
