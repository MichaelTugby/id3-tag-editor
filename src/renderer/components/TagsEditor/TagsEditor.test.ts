import { config, mount } from "@vue/test-utils";
import TagsEditor from "./TagsEditor.vue";

import Vue from "vue";
import Vuetify from "vuetify/es5/components/Vuetify";

Vue.use(Vuetify);
config.logModifiedComponents = false;

const item1 = {
    albumArtist: "Test Artist",
    artist: "Test Artist",
    name: "Test Song",
};
const item2 = {
    albumArtist: "Test Artist",
    artist: "Test Artist feat. Test Artist 2",
    name: "Test Song 2",
};

const items = [item1, item2];
const itemsWithArray = [{...item1, albumArtist: []}, {...item2, albumArtist: []}];

const header1 = {
    text: "Track Name",
    value: "name",
};
const header2 = {
    text: "Artist",
    value: "artist",
};
const header3 = {
    text: "Album Artist",
    value: "albumArtist",
};
const headers = [header1, header2, header3];

describe("Tags Editor Component", () => {

    it("is a Vue instance", () => {
        const wrapper = mount(TagsEditor, { propsData: { headers, items }, sync: false });
        expect(wrapper.isVueInstance()).toBeTruthy();
    });

    it("snapshot has not changed", () => {
        const wrapper = mount(TagsEditor, { propsData: { headers, items }, sync: false });
        expect(wrapper.html()).toMatchSnapshot();
    });

    it("displays a text input field for each header", () => {
        const wrapper = mount(TagsEditor, { propsData: { headers, items }, sync: false });
        expect(wrapper.find(".TagsEditorTextField #name").is("input")).toBeTruthy();
        expect(wrapper.find(".TagsEditorTextField #artist").is("input")).toBeTruthy();
        expect(wrapper.find(".TagsEditorTextField #albumArtist").is("input")).toBeTruthy();
    });

    it("displays a label for each header", () => {
        const wrapper = mount(TagsEditor, { propsData: { headers, items }, sync: false });
        const labels = wrapper.findAll(".TagsEditorTextField label");
        expect(labels.at(0).text()).toEqual("Track Name");
        expect(labels.at(1).text()).toEqual("Artist");
        expect(labels.at(2).text()).toEqual("Album Artist");
    });

    it("overrides text field input with named slot", () => {
        const wrapper = mount(TagsEditor, { propsData: { headers, items }, scopedSlots: {
            artist: `<div slot-scope='props' class='TagsEditorCustomField'>
                        <label :for='props.header.value'>{{ props.header.text }}</label>
                        <input type='text'
                               id='artist'
                               :value='props.form[props.header.value]'
                               @input="props.form[props.header.value] = $event.target.value" />
                     </div>`,
        }, sync: false });
        const labels = wrapper.findAll(".TagsEditorTextField label");
        expect(labels.at(0).text()).toEqual("Track Name");
        expect(wrapper.find(".TagsEditorCustomField label").text()).toEqual("Artist");
        expect(labels.at(1).text()).toEqual("Album Artist");
    });

    it("displays keep with non unique values in items array", () => {
        const wrapper = mount(TagsEditor, { propsData: { headers, items }, sync: false });
        expect(wrapper.vm.$data.formTag.name).toEqual("<keep>");
        expect(wrapper.vm.$data.formTag.artist).toEqual("<keep>");
    });

    it("displays value with unique values in items array", () => {
        const wrapper = mount(TagsEditor, { propsData: { headers, items }, sync: false });
        expect(wrapper.vm.$data.formTag.albumArtist).toEqual("Test Artist");
    });

    it("updates form tag with updated value", () => {
        const wrapper = mount(TagsEditor, { propsData: { headers, items }, sync: false });
        expect(wrapper.vm.$data.formTag.name).toEqual("<keep>");
        const input = wrapper.find("#name");
        (input.element as HTMLInputElement).value = "Updated Name";
        input.trigger("input");
        expect(wrapper.vm.$data.formTag.name).toEqual("Updated Name");
    });

    it("updates form tag with updated slot value", () => {
        const wrapper = mount(TagsEditor, { propsData: { headers, items }, scopedSlots: {
            artist: `<div slot-scope='props' class='TagsEditorCustomField'>
                        <label :for='props.header.value'>{{ props.header.text }}</label>
                        <input type='text'
                               id='artist'
                               :value='props.form[props.header.value]'
                               @input="props.form[props.header.value] = $event.target.value" />
                     </div>`,
        }, sync: false });
        expect(wrapper.vm.$data.formTag.artist).toEqual("<keep>");
        const input = wrapper.find("#artist");
        (input.element as HTMLInputElement).value = "Updated Artist";
        input.trigger("input");
        expect(wrapper.vm.$data.formTag.artist).toEqual("Updated Artist");
    });

    it("clicking submit button emits submit event", () => {
        const wrapper = mount(TagsEditor, { propsData: { headers, items }, sync: false });
        wrapper.find(".TagsEditorSubmitBtn").trigger("click");
        expect(wrapper.emitted("submit")).toEqual([[items]]);
    });

    it("clicking submit with <keep> value is transformed to original value", () => {
        const wrapper = mount(TagsEditor, { propsData: { headers, items }, sync: false });
        wrapper.find(".TagsEditorSubmitBtn").trigger("click");
        expect(wrapper.vm.$data.formTag.artist).toEqual("<keep>");
        expect(wrapper.emitted("submit")).toEqual([[items]]);
    });

    it("clicking submit without <keep> value is new value for each element in array", () => {
        const wrapper = mount(TagsEditor, { propsData: { headers, items }, sync: false });

        const input = wrapper.find("#albumArtist");
        (input.element as HTMLInputElement).value = "New Album Artist";
        input.trigger("input");

        wrapper.find(".TagsEditorSubmitBtn").trigger("click");
        expect(wrapper.vm.$data.formTag.albumArtist).toEqual("New Album Artist");
        expect(wrapper.emitted("submit")).toEqual([[[{
            ...item1,
            albumArtist: "New Album Artist",
        }, {
            ...item2,
            albumArtist: "New Album Artist",
        }]]]);
    });

    it("clicking submit with <keep> value on arrays and objects returns them", () => {
        const itemsWithDiffArray = [{...item1, albumArtist: [1]}, {...item2, albumArtist: [2]}];
        const wrapper = mount(TagsEditor, { propsData: { headers, items: itemsWithDiffArray }, sync: false });
        wrapper.find(".TagsEditorSubmitBtn").trigger("click");
        expect(wrapper.vm.$data.formTag.albumArtist).toEqual("<keep>");
        expect(wrapper.emitted("submit")).toEqual([[[{
            ...item1,
            albumArtist: [1],
        }, {
            ...item2,
            albumArtist: [2],
        }]]]);
    });

    it("clicking submit with <keep> value on numbers returns as a number", () => {
        const itemsWithDiffArray = [{...item1, albumArtist: 1}, {...item2, albumArtist: 2}];
        const wrapper = mount(TagsEditor, { propsData: { headers, items: itemsWithDiffArray }, sync: false });
        wrapper.find(".TagsEditorSubmitBtn").trigger("click");
        expect(wrapper.vm.$data.formTag.albumArtist).toEqual("<keep>");
        expect(wrapper.emitted("submit")).toEqual([[[{
            ...item1,
            albumArtist: 1,
        }, {
            ...item2,
            albumArtist: 2,
        }]]]);
    });

    it("clicking submit with regex value is evaluated as new value for each element in array", () => {
        const wrapper = mount(TagsEditor, { propsData: { headers, items }, sync: false });

        const input = wrapper.find("#albumArtist");
        (input.element as HTMLInputElement).value = "</Test/g>";
        input.trigger("input");

        wrapper.find(".TagsEditorSubmitBtn").trigger("click");
        expect(wrapper.vm.$data.formTag.albumArtist).toEqual("</Test/g>");
        expect(wrapper.emitted("submit")).toEqual([[[{
            ...item1,
            albumArtist: "Test",
        }, {
            ...item2,
            albumArtist: "Test",
        }]]]);
    });

    it(`clicking submit with regex is evaluated and all matches are joined together to
        form new value for each element in array`, () => {
        const wrapper = mount(TagsEditor, { propsData: { headers, items }, sync: false });

        const input = wrapper.find("#albumArtist");
        (input.element as HTMLInputElement).value = "</t/ig>";
        input.trigger("input");

        wrapper.find(".TagsEditorSubmitBtn").trigger("click");
        expect(wrapper.vm.$data.formTag.albumArtist).toEqual("</t/ig>");
        expect(wrapper.emitted("submit")).toEqual([[[{
            ...item1,
            albumArtist: "Tttt",
        }, {
            ...item2,
            albumArtist: "Tttt",
        }]]]);
    });

    it("clicking submit with regex is evaluated and no matches uses default value", () => {
        const wrapper = mount(TagsEditor, { propsData: { headers, items }, sync: false });

        const input = wrapper.find("#albumArtist");
        (input.element as HTMLInputElement).value = "</No Match/g>";
        input.trigger("input");

        wrapper.find(".TagsEditorSubmitBtn").trigger("click");
        expect(wrapper.vm.$data.formTag.albumArtist).toEqual("</No Match/g>");
        expect(wrapper.emitted("submit")).toEqual([[items]]);
    });

    it("clicking submit with regex returns a number", () => {
        const itemsWithNumber = [{...item1, albumArtist: 1000}, {...item2, albumArtist: 1000}];
        const wrapper = mount(TagsEditor, { propsData: { headers, items: itemsWithNumber }, sync: false });

        const input = wrapper.find("#albumArtist");
        (input.element as HTMLInputElement).value = "</1/g>";
        input.trigger("input");

        wrapper.find(".TagsEditorSubmitBtn").trigger("click");
        expect(wrapper.vm.$data.formTag.albumArtist).toEqual("</1/g>");
        expect(wrapper.emitted("submit")).toEqual([[[
            {...item1, albumArtist: 1},
            {...item2, albumArtist: 1},
        ]]]);
    });

    it("custom equality check fn prop correctly displays equal arrays and objects", () => {
        const wrapper = mount(TagsEditor, { propsData: { headers, items: itemsWithArray }, sync: false });
        expect(wrapper.vm.$data.formTag.albumArtist).toEqual([]);
    });

    it("ignores arrays and objects on submit", () => {
        const wrapper = mount(TagsEditor, { propsData: { headers, items: itemsWithArray }, sync: false });
        wrapper.find(".TagsEditorSubmitBtn").trigger("click");
        expect(wrapper.emitted("submit")).toEqual([[itemsWithArray]]);
    });

    it("ignores keys not in header prop on submit", () => {
        const extraItems = [{...item1, compilation: 0}, {...item2, compilation: 1}];
        const wrapper = mount(TagsEditor, { propsData: { headers, items: extraItems }, sync: false });
        wrapper.find(".TagsEditorSubmitBtn").trigger("click");
        expect(wrapper.emitted("submit")).toEqual([[extraItems]]);
    });

});
