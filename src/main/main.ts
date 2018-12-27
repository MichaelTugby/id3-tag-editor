import { app, BrowserWindow, ipcMain } from "electron";
import { join as joinPaths } from "path";
import { format as formatURL } from "url";

let win: BrowserWindow | null;

const createWindow = () => {
    win = new BrowserWindow({ height: 720, width: 1280 });
    if (process.env.NODE_ENV !== "production") {
        win.loadURL("http://localhost:8080");

        // All dev module imports go here - webpack will filter them out for production
        const { client } = require("electron-connect");
        const { default: installExtension, VUEJS_DEVTOOLS } = require("electron-devtools-installer");
        const devtron = require("devtron");
        client.create(win);
        installExtension(VUEJS_DEVTOOLS);
        devtron.install();

    } else {
        win.loadURL(formatURL({
            pathname: joinPaths(__dirname, "index.html"),
            protocol: "file",
            slashes: true,
        }));
    }
    win.on("closed", () => win = null);
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (win === null) {
        createWindow();
    }
});
