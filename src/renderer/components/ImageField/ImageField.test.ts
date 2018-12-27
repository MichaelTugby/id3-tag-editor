import { config, mount } from "@vue/test-utils";
import ImageField from "./ImageField.vue";

import Vue from "vue";
import Vuetify from "vuetify/es5/components/Vuetify";

Vue.use(Vuetify);
config.logModifiedComponents = false;

const blankImage = "data:image/png;base64,AAAAAAAAAAA=";

describe("Image Field Component", () => {

    it("is a Vue instance", () => {
        const wrapper = mount(ImageField, { propsData: { images: [blankImage] } });
        expect(wrapper.isVueInstance()).toBeTruthy();
    });

    it("snapshot has not changed", () => {
        const wrapper = mount(ImageField, { propsData: { images: [blankImage] } });
        expect(wrapper.html()).toMatchSnapshot();
    });

    it("placeholder snapshot has not changed", () => {
        const wrapper = mount(ImageField, { propsData: { images: [] } });
        expect(wrapper.html()).toMatchSnapshot();
    });

    it("displays placeholder with empty images array", () => {
        const wrapper = mount(ImageField, { propsData: { images: [] } });
        expect(wrapper.find(".ImageFieldContainer").exists()).toBeFalsy();
        expect(wrapper.find(".ImageFieldPlaceholder").exists()).toBeTruthy();
    });

    it("displays placeholder prop", () => {
        const placeholder = "<keep>";
        const wrapper = mount(ImageField, { propsData: { images: [], placeholder } });
        expect(wrapper.find(".ImageFieldPlaceholder").text()).toEqual(placeholder);
    });

    it("drop event with valid file emits images-updated with array of base64 images", async () => {
        const wrapper = mount(ImageField, { propsData: { images: [] } });
        const buf = new ArrayBuffer(8);
        const files = [new File([buf], "test", { type: "image/png" })];

        const eventListener = jest.fn();
        spyOn(window, "FileReader" as any).and.returnValue({
            addEventListener: eventListener,
            readAsArrayBuffer: jest.fn(),
            result: buf,
        });
        wrapper.trigger("drop", {
            dataTransfer: {
                files,
            },
        });

        const loadCall = eventListener.mock.calls.find((call) => call[0] === "load");
        if (loadCall) {
            loadCall[1]();
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted("error")).toBeUndefined();
            expect(wrapper.emitted("images-updated")[0]).toEqual([["data:image/png;base64,AAAAAAAAAAA="]]);
        }
    });

    it("drop event with file reader error emits error", async () => {
        const wrapper = mount(ImageField, { propsData: { images: [] } });
        const files = [new File([new ArrayBuffer(8)], "test", { type: "image/png" })];
        const err = new Error("Invalid File");

        const eventListener = jest.fn();
        spyOn(window, "FileReader" as any).and.returnValue({
            addEventListener: eventListener,
            readAsArrayBuffer: jest.fn(),
        });
        wrapper.trigger("drop", {
            dataTransfer: {
                files,
            },
        });
        const errorCall = eventListener.mock.calls.find((call) => call[0] === "error");
        if (errorCall) {
            errorCall[1](err);
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted("images-updated")).toBeUndefined();
            expect(wrapper.emitted("error")[0]).toEqual([err]);
        }
    });

    it("drop event with other file type emits invalid file error", async () => {
        const wrapper = mount(ImageField, { propsData: { images: [] } });
        const buf = new ArrayBuffer(8);
        const files = [new File([buf], "test", { type: "text/csv" })];

        wrapper.trigger("drop", {
            dataTransfer: {
                files,
            },
        });

        expect(wrapper.emitted("images-updated")).toBeUndefined();
        expect(wrapper.emitted("error")).toEqual([[new Error("File type must be an image.")]]);
    });

    it("clicking update image opens file dialog and emits images-updated with array of base64 images", async () => {
        const wrapper = mount(ImageField, { propsData: { images: [] } });
        const buf = new ArrayBuffer(8);
        const files = [new File([buf], "test", { type: "image/png" })];

        const inputEventListener = jest.fn();
        spyOn(document, "createElement").and.returnValue({
            addEventListener: inputEventListener,
            click: jest.fn(),
        });

        const fileReaderEventListener = jest.fn();
        spyOn(window, "FileReader" as any).and.returnValue({
            addEventListener: fileReaderEventListener,
            readAsArrayBuffer: jest.fn(),
            result: buf,
        });

        wrapper.find(".ImageFieldUpdateBtn").trigger("click");
        const changeCall = inputEventListener.mock.calls.find((call) => call[0] === "change");
        if (changeCall) {
            changeCall[1]({
                preventDefault: jest.fn(),
                target: {
                    files,
                },
            });
            const loadCall = fileReaderEventListener.mock.calls.find((call) => call[0] === "load");
            if (loadCall) {
                loadCall[1]();
                await wrapper.vm.$nextTick();
                expect(wrapper.emitted("error")).toBeUndefined();
                expect(wrapper.emitted("images-updated")).toEqual([[["data:image/png;base64,AAAAAAAAAAA="]]]);
            }
        }
    });

    it("clicking update image opens file dialog and emits error with file reader error", async () => {
        const wrapper = mount(ImageField, { propsData: { images: [] } });
        const buf = new ArrayBuffer(8);
        const files = [new File([buf], "test", { type: "image/png" })];

        const inputEventListener = jest.fn();
        spyOn(document, "createElement").and.returnValue({
            addEventListener: inputEventListener,
            click: jest.fn(),
        });

        const fileReaderEventListener = jest.fn();
        spyOn(window, "FileReader" as any).and.returnValue({
            addEventListener: fileReaderEventListener,
            readAsArrayBuffer: jest.fn(),
        });

        wrapper.find(".ImageFieldUpdateBtn").trigger("click");
        const changeCall = inputEventListener.mock.calls.find((call) => call[0] === "change");
        if (changeCall) {
            changeCall[1]({
                preventDefault: jest.fn(),
                target: {
                    files,
                },
            });
            const errorCall = fileReaderEventListener.mock.calls.find((call) => call[0] === "error");
            if (errorCall) {
                const err = new Error("Invalid File");
                errorCall[1](err);
                await wrapper.vm.$nextTick();
                expect(wrapper.emitted("images-updated")).toBeUndefined();
                expect(wrapper.emitted("error")).toEqual([[err]]);
            }
        }
    });

    it("clicking update image opens file dialog and emits nothing with no files", async () => {
        const wrapper = mount(ImageField, { propsData: { images: [] } });

        const inputEventListener = jest.fn();
        spyOn(document, "createElement").and.returnValue({
            addEventListener: inputEventListener,
            click: jest.fn(),
        });

        wrapper.find(".ImageFieldUpdateBtn").trigger("click");
        const changeCall = inputEventListener.mock.calls.find((call) => call[0] === "change");
        if (changeCall) {
            await changeCall[1]({
                preventDefault: jest.fn(),
                target: {},
            });
            expect(wrapper.emitted("images-updated")).toBeUndefined();
            expect(wrapper.emitted("error")).toBeUndefined();
        }
    });

    it("emits images-updated on remove button click", () => {
        const wrapper = mount(ImageField, { propsData: { images: [] } });
        wrapper.find(".ImageFieldRemoveBtn").trigger("click");
        expect(wrapper.emitted("images-updated")).toEqual([[[]]]);
    });

    it("emits images-updated on remove button click with default image prop", () => {
        const wrapper = mount(ImageField, { propsData: { defaultImage: blankImage, images: [] } });
        wrapper.find(".ImageFieldRemoveBtn").trigger("click");
        expect(wrapper.emitted("images-updated")).toEqual([[[blankImage]]]);
    });

});
