const { promisify } = require("util");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const electron = require("electron-connect");

const mainConfig = require("./webpack.main.config");
const rendererConfig = require("./webpack.renderer.config");

const mainBuild = webpack(mainConfig);

WebpackDevServer.addDevServerEntrypoints(rendererConfig, {
    hot: true,
    host: "localhost"
});
const server = new WebpackDevServer(webpack(rendererConfig), {
    hot: true
});

function cb(state) {
    if(state === "stopped") {
        process.exit();
    }
}

(async() => {
    try {
        await promisify(server.listen.bind(server))(8080, "localhost");
        const electronServer = electron.server.create({ stopOnClose: true });
        mainBuild.watch({
            aggregateTimeout: 300,
            poll: undefined
        }, (err, stats) => {
            if (err) {
                electronServer.stop();
                process.exit();
            }
            const bundle = `${stats.compilation.outputOptions.path}/${stats.compilation.outputOptions.filename}`;
            if(electronServer.electronState === "init") {
                electronServer.start(bundle, cb);
            } else {
                electronServer.restart(bundle, cb);
            }
        });
    } catch(e) {
        console.error(e);
        process.exit();
    }
})();
