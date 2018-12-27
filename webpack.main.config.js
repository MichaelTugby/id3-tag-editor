const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.config");

module.exports = merge(baseConfig, {
    entry: "./src/main/main.ts",
    target: "electron-main",
    output: {
        filename: "main.bundle.js"
    },
    node: {
        __dirname: false
    },
    externals: [
        function(context, request, callback) {
            if (request.match(/devtron/)) {
                return callback(null, 'commonjs ' + request);
            }
            callback();
        }
    ]
});
