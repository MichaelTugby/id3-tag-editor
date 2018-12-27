import { readFile, readFileSync, writeFile } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { promisify } from "util";
import * as uuid from "uuid/v5";

import { ITag } from "~/src/types/tag";

import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";

import snackbar from "./snackbar";
import tags from "./tags";

Vue.use(Vuex);

const namespace = "c3ab7dab-d693-4078-8688-af614de51f04";
const path = join(tmpdir(), `${(uuid as any)("id3-tag-editor", namespace)}.json`);
const vuexLocal = new VuexPersist({
    modules: ["tags"],
    restoreState: (key) => {
        try {
            const tagsStore: ITag[] = JSON.parse(readFileSync(path, "utf8"))[key].tags;
            return {
                tags: tagsStore.map((tag) => {
                    return {
                        ...tag,
                        pictures: tag.pictures.map((pic) => {
                            return {
                                ...pic,
                                picture: new Uint8Array(new Buffer(pic.picture).buffer),
                            };
                        }),
                    };
                }),
            };
        } catch (e) {
            return {};
        }
    },
    saveState: async (key, state) => {
        const store = JSON.parse(await promisify(readFile)(path, "utf8").catch((e) => "{}"));
        store[key] = state;
        await promisify(writeFile)(path, JSON.stringify(store), "utf8").catch();
    },
});

export default new Vuex.Store({
    modules: {
        snackbar,
        tags,
    },
    plugins: [vuexLocal.plugin],
});
