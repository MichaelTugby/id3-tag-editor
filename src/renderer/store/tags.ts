import { Module } from "vuex";

import { ITag } from "~/src/types/tag";

export default {
    mutations: {
        add(currentTags, tags: ITag[]) {
            const diff = tags.filter((tag) => {
                return !currentTags.some((currentTag) => currentTag.path === tag.path);
            });
            currentTags.push(...diff);
        },
        remove(currentTags, tags: ITag[]) {
            tags.forEach((tag) => {
                const i = currentTags.findIndex((currentTag) => currentTag.path === tag.path);
                if (i !== -1) {
                    currentTags.splice(i, 1);
                }
            });
        },
        update(currentTags, tags: ITag[]) {
            tags.forEach((tag) => {
                const currentTag = currentTags.find((current) => current.filename === tag.filename);
                if (currentTag) {
                    Object.keys(currentTag).forEach((key) => {
                        currentTag[key] = tag[key];
                    });
                }
            });
        },
    },
    namespaced: true,
    state: [],
} as Module<ITag[], {}>;
