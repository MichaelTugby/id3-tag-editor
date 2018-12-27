const path = require("path");
const { DefinePlugin } = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const TsConfigPathsWebpackPlugin = require("tsconfig-paths-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const UglifyJsWebpackPlugin = require("uglifyjs-webpack-plugin");

const isDevelopment = process.env.NODE_ENV === "production" ? false : true;

module.exports = {
    mode: isDevelopment ? "development" : "production",
    devtool: isDevelopment ? "source-map" : undefined,
    output: {
        path: path.join(__dirname, "dist")
    },
    optimization: {
        minimizer: [
            new UglifyJsWebpackPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    isDevelopment ? "cache-loader" : null,
                    {
                        loader: "ts-loader",
                        options: {
                            appendTsSuffixTo: [/\.vue$/],
                            transpileOnly: true,
                            experimentalWatchApi: true
                        }
                    }
                ].filter(a => a)
            }
        ]
    },
    resolve: {
        extensions: [".js", ".ts", ".vue", ".node"],
        plugins: [new TsConfigPathsWebpackPlugin()]
    },
    plugins: [
        new CleanWebpackPlugin(["dist"]),
        new ForkTsCheckerWebpackPlugin({
            tslint: true,
            vue: true
        }),
        new DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development")
        })
    ]
};
