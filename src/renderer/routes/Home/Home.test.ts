import { config, createLocalVue, mount } from "@vue/test-utils";
import Home from "./Home.vue";

import Vue from "vue";
import Vuetify from "vuetify/es5/components/Vuetify";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);
Vue.use(Vuetify);
config.logModifiedComponents = false;

const el = document.createElement("div");
el.setAttribute("data-app", "true");
document.body.appendChild(el);

const setSnackbar = jest.fn();
const addTag = jest.fn();
const removeTag = jest.fn();
const updateTag = jest.fn();
const store = new Vuex.Store({
    modules: {
        snackbar: {
            mutations: {
                set: setSnackbar,
            },
            namespaced: true,
        },
        tags: {
            mutations: {
                add: addTag,
                remove: removeTag,
                update: updateTag,
            },
            namespaced: true,
            state: [],
        },
    },
});

const pic = {
    mimetype: "image/png",
    picture: new Uint8Array(Array.from(atob("AAAA"), (c) => c.charCodeAt(0))),
};
const tags = [{
    artist: "Test Artist",
    pictures: [pic],
    title: "Test Song 1",
}];

jest.mock("taglib2", () => ({
    readTagsSync: jest.fn(),
    writeTagsSync: jest.fn(),
}));

describe("Home Route Component", () => {

    it("is a Vue instance", () => {
        const wrapper = mount(Home, { localVue, store, sync: false });
        expect(wrapper.isVueInstance()).toBeTruthy();
    });

    it("snapshot did not change", async () => {
        const wrapper = mount(Home, { localVue, store, sync: false });
        await wrapper.vm.$nextTick();
        expect(wrapper.html()).toMatchSnapshot();
    });

    it("converts uint8arrays into base64", async () => {
        const wrapper = mount(Home, { localVue, store, sync: false });
        await wrapper.vm.$nextTick();
        const base64s = (wrapper.vm as any).toBase64([pic]);
        expect(base64s).toEqual(["data:image/png;base64,AAAA"]);
    });

    it("converts <keep> into empty base64 arrays", async () => {
        const wrapper = mount(Home, { localVue, store, sync: false });
        await wrapper.vm.$nextTick();
        const base64s = (wrapper.vm as any).toBase64("<keep>");
        expect(base64s).toEqual([]);
    });

    it("converts empty array into empty base64 arrays", async () => {
        const wrapper = mount(Home, { localVue, store, sync: false });
        await wrapper.vm.$nextTick();
        const base64s = (wrapper.vm as any).toBase64([]);
        expect(base64s).toEqual([]);
    });

    it("converts base64s into uint8arrays", async () => {
        const wrapper = mount(Home, { localVue, store, sync: false });
        await wrapper.vm.$nextTick();
        const base64s = (wrapper.vm as any).toBase64([pic]);
        const uint8arrays = (wrapper.vm as any).toUint8Array(base64s);
        expect(uint8arrays).toEqual([pic]);
    });

    it("removeSelected fn removes selected array and calls tags/remove store mutation", async () => {
        const wrapper = mount(Home, { localVue, store, sync: false });
        wrapper.setData({ selected: tags });
        removeTag.mockClear();
        expect(removeTag).not.toBeCalled();
        await wrapper.vm.$nextTick();
        (wrapper.vm as any).removeSelected();
        expect(wrapper.vm.$data.selected).toEqual([]);
        expect(removeTag).toBeCalled();
    });

    it("removeSelected fn only calls removeTag if the array has values", async () => {
        const wrapper = mount(Home, { localVue, store, sync: false });
        removeTag.mockClear();
        expect(removeTag).not.toBeCalled();
        await wrapper.vm.$nextTick();
        (wrapper.vm as any).removeSelected();
        expect(wrapper.vm.$data.selected).toEqual([]);
        expect(removeTag).not.toBeCalled();
    });

    it("equalityCheckFn compares strings and numbers correctly", async () => {
        const wrapper = mount(Home, { localVue, store, sync: false });
        await wrapper.vm.$nextTick();
        expect((wrapper.vm as any).equalityCheckFn(1, 1)).toBeTruthy();
        expect((wrapper.vm as any).equalityCheckFn(1, 2)).toBeFalsy();
        expect((wrapper.vm as any).equalityCheckFn("1", "1")).toBeTruthy();
        expect((wrapper.vm as any).equalityCheckFn("1", "2")).toBeFalsy();
        expect((wrapper.vm as any).equalityCheckFn(1, "1")).toBeFalsy();
        expect((wrapper.vm as any).equalityCheckFn("2", 2)).toBeFalsy();
    });

    it("equalityCheckFn compares pic array correctly", async () => {
        const wrapper = mount(Home, { localVue, store, sync: false });
        await wrapper.vm.$nextTick();
        expect((wrapper.vm as any).equalityCheckFn([{
            mimetype: "image/png",
            picture: new Uint8Array(Array.from(atob("AAAA"), (c) => c.charCodeAt(0))),
        }], [{
            mimetype: "image/png",
            picture: new Uint8Array(Array.from(atob("AAAA"), (c) => c.charCodeAt(0))),
        }])).toBeTruthy();
        expect((wrapper.vm as any).equalityCheckFn([{
            mimetype: "image/png",
            picture: new Uint8Array(Array.from(atob("AAAA"), (c) => c.charCodeAt(0))),
        }], [{
            mimetype: "image/png",
            picture: new Uint8Array(Array.from(atob("AAA"), (c) => c.charCodeAt(0))),
        }])).toBeFalsy();
    });

    it("tagParserFn correctly parses file into tag", async () => {
        const wrapper = mount(Home, { localVue, store, sync: false });
        await wrapper.vm.$nextTick();

        const buf = new ArrayBuffer(8);
        const file = new File([buf], "test_file", { type: "audio/mp3" });
        file.path = "/";
        const files = [file];

        expect((wrapper.vm as any).tagParserFn(files)).toEqual([{ filename: "test_file", path: "/" }]);
    });

    it("tagParserFn only allows unique files", async () => {
        const wrapper = mount(Home, { localVue, store, sync: false });
        await wrapper.vm.$nextTick();

        const buf = new ArrayBuffer(8);
        const file = new File([buf], "test_file", { type: "audio/mp3" });
        file.path = "/";
        const files = [file, file];

        expect((wrapper.vm as any).tagParserFn(files)).toEqual([{ filename: "test_file", path: "/" }]);
    });

    it("calls tags update and snackbar show on save", () => {
        const wrapper = mount(Home, { localVue, store, sync: false });
        updateTag.mockClear();
        setSnackbar.mockClear();
        expect(updateTag).not.toBeCalled();
        expect(setSnackbar).not.toBeCalled();
        (wrapper.vm as any).saveChanges(tags);
        expect(updateTag).toBeCalledWith([], tags);
        expect(setSnackbar).toBeCalledWith({}, {color: "success", message: "Successfully saved changes to tags."});
    });

    it("calls tag add on tag getter update", () => {
        const wrapper = mount(Home, { localVue, store, sync: false });
        addTag.mockClear();
        expect(addTag).not.toBeCalled();
        (wrapper.vm as any).tags = tags;
        expect(addTag).toBeCalledWith([], tags);
    });

});
