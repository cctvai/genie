/*jshint esversion: 6 */
var webpackConfig = require("../build-scripts/webpack.config");
const webpack = require("webpack");
const HappyPack = require("happypack");

module.exports = {
    devtool: "source-map",
    module: {
        rules: webpackConfig.module.rules.concat([
            {
                enforce: "post",
                test: /\.tsx?$/,
                include: /(src)/,
                exclude: /(node_modules|resources\/js\/vendor)/,
                loader: "happypack/loader?id=istanbul",
            },
        ]),
    },
    resolve: webpackConfig.resolve,
    plugins: webpackConfig.plugins.concat([
        new webpack.SourceMapDevToolPlugin({
            filename: null, // if no value is provided the sourcemap is inlined
            test: /\.(ts|js)x?$/i, // process .js, .tsx and .ts files only
        }),
        new HappyPack({
            id: "istanbul",
            loaders: [
                {
                    path: "istanbul-instrumenter-loader",
                },
            ],
        }),
    ]),
};
