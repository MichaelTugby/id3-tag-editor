import { mount } from "@vue/test-utils";
import TagReader from "./TagReader.vue";

const tagParserFn = (files: File[]) => {
    return files.map((file) => ({
        name: file.name,
    }));
};

const asyncTagParserFn = (files: File[]) => {
    return Promise.resolve(files.map((file) => ({
        name: file.name,
    })));
};

const asyncTagParserFnError = () => Promise.reject(new Error("Parser Error"));

describe("Tag Reader Component", () => {

    it("is a Vue instance", () => {
        const wrapper = mount(TagReader, { propsData: { tagParserFn, tags: [] }});
        expect(wrapper.isVueInstance()).toBeTruthy();
    });

    it("snapshot has not changed", () => {
        const wrapper = mount(TagReader, { propsData: { tagParserFn, tags: [] }});
        expect(wrapper.html()).toMatchSnapshot();
    });

    it("emits tags-updated on valid drop with sync tag parser", async () => {
        const wrapper = mount(TagReader, { propsData: { tagParserFn, tags: [] }});

        const buf = new ArrayBuffer(8);
        const files = [new File([buf], "test_file", { type: "audio/mp3" })];

        wrapper.trigger("drop", {
            dataTransfer: {
                files,
            },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted("tags-updated")).toEqual([[[{ name: "test_file" }]]]);
    });

    it("emits tags-updated on valid drop with async tag parser", async () => {
        const wrapper = mount(TagReader, { propsData: { tagParserFn: asyncTagParserFn, tags: [] }});

        const buf = new ArrayBuffer(8);
        const files = [new File([buf], "test_file", { type: "audio/mp3" })];

        wrapper.trigger("drop", {
            dataTransfer: {
                files,
            },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted("tags-updated")).toEqual([[[{ name: "test_file" }]]]);
    });

    it("emits error on invalid file type with drop", () => {
        const wrapper = mount(TagReader, { propsData: { tagParserFn, tags: [] }});

        const buf = new ArrayBuffer(8);
        const files = [new File([buf], "test_file", { type: "text/csv" })];

        wrapper.trigger("drop", {
            dataTransfer: {
                files,
            },
        });
        expect(wrapper.emitted("error")).toEqual([[new Error("Invalid file type.")]]);
    });

    it("emits error on tagParserFn error with drop", async () => {
        const wrapper = mount(TagReader, { propsData: { tagParserFn: asyncTagParserFnError, tags: [] }});

        const buf = new ArrayBuffer(8);
        const files = [new File([buf], "test_file", { type: "audio/mp3" })];

        wrapper.trigger("drop", {
            dataTransfer: {
                files,
            },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted("error")).toEqual([[new Error("Parser Error")]]);
    });

    it("emits nothing on no files from tagParserFn", async () => {
        const wrapper = mount(TagReader, { propsData: { tagParserFn: () => [], tags: [] }});

        const buf = new ArrayBuffer(8);
        const files = [new File([buf], "test_file", { type: "audio/mp3" })];

        wrapper.trigger("drop", {
            dataTransfer: {
                files,
            },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted("error")).toEqual([[new Error("No tags successfully parsed from files.")]]);
    });

    it("emits tags-updated on valid file dialog", async () => {
        const wrapper = mount(TagReader, { propsData: { tagParserFn, tags: [] }});
        const buf = new ArrayBuffer(8);
        const files = [new File([buf], "test_file", { type: "audio/mp3" })];

        const eventListener = jest.fn();
        spyOn(document, "createElement").and.returnValue({
            addEventListener: eventListener,
            click: jest.fn(),
        });

        (wrapper.vm as any).showFileDialog();

        const change = eventListener.mock.calls.find((call) => call[0] === "change");
        if (change) {
            change[1]({
                preventDefault: jest.fn(),
                target: {
                    files,
                },
            });
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted("tags-updated")).toEqual([[[{ name: "test_file" }]]]);
        }
    });

    it("emits nothing on no files with file dialog", async () => {
        const wrapper = mount(TagReader, { propsData: { tagParserFn, tags: [] }});

        const eventListener = jest.fn();
        spyOn(document, "createElement").and.returnValue({
            addEventListener: eventListener,
            click: jest.fn(),
        });

        (wrapper.vm as any).showFileDialog();

        const change = eventListener.mock.calls.find((call) => call[0] === "change");
        if (change) {
            change[1]({
                preventDefault: jest.fn(),
                target: {
                    files: [],
                },
            });
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted("error")).toBeUndefined();
            expect(wrapper.emitted("tags-updated")).toBeUndefined();
        }
    });

});
