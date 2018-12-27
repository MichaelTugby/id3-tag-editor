import * as path from "path";
import { Application } from "spectron";

describe("Application Launch", () => {
    let app: Application;

    beforeEach(async () => {
        app = new Application({
            args: [path.resolve(process.cwd(), "dist/main.bundle.js")],
            path: require("electron") as any,
        });
        await app.start();
        await app.client.waitUntilWindowLoaded();
    });

    afterEach(async () => {
        if (app && app.isRunning()) {
            await app.stop();
        }
    });

    it("shows an initial window", async () => {
        const count = await app.client.getWindowCount();
        expect(count).toEqual(1);
    });

});
