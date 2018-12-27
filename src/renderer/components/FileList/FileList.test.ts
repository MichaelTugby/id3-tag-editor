import { config, mount } from "@vue/test-utils";
import FileList from "./FileList.vue";

import { IHeader } from "~/src/types/header";

import Vue from "vue";
import Vuetify from "vuetify/es5/components/Vuetify";

Vue.use(Vuetify);

const el = document.createElement("div");
el.setAttribute("data-app", "true");
document.body.appendChild(el);

config.logModifiedComponents = false;

const headers: IHeader[] = [{
    text: "Filename",
    value: "name",
}];

const items = [{
    id: 1,
    name: "Test File 1",
}, {
    id: 2,
    name: "Test File 2",
}];

describe("File List Component", () => {

    it("is a Vue instance", async () => {
        const wrapper = mount(FileList, {
            propsData: {
                headers,
                itemKey: "id",
                items,
                selected: [],
            },
            scopedSlots: {
                default: "<template slot-scope='props'>{{ props.item.name }}</template>",
            },
            sync: false,
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.isVueInstance()).toBeTruthy();
    });

    it("snapshot has not changed", async () => {
        const wrapper = mount(FileList, {
            propsData: {
                headers,
                itemKey: "id",
                items,
                selected: [],
            },
            scopedSlots: {
                default: "<template slot-scope='props'>{{ props.item.name }}</template>",
            },
            sync: false,
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.html()).toMatchSnapshot();
    });

    it("snapshot with no items has not changed", async () => {
        const wrapper = mount(FileList, {
            propsData: {
                headers,
                itemKey: "id",
                items: [],
                selected: [],
            },
            scopedSlots: {
                default: "<template slot-scope='props'>{{ props.item.name }}</template>",
            },
            sync: false,
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.html()).toMatchSnapshot();
    });

    it("displays the headers", async () => {
        const wrapper = mount(FileList, {
            propsData: {
                headers,
                itemKey: "id",
                items,
                selected: [],
            },
            scopedSlots: {
                default: "<template slot-scope='props'>{{ props.item.name }}</template>",
            },
            sync: false,
        });
        await wrapper.vm.$nextTick();
        const headerElements = wrapper.findAll(".FileListTableHeader");
        expect(headerElements.length).toEqual(2);
        expect(headerElements.at(1).text()).toContain("Filename");
    });

    it("displays the items", async () => {
        const wrapper = mount(FileList, {
            propsData: {
                headers,
                itemKey: "id",
                items,
                selected: [],
            },
            scopedSlots: {
                default: "<template slot-scope='props'>{{ props.item.name }}</template>",
            },
            sync: false,
        });
        await wrapper.vm.$nextTick();
        const contentElements = wrapper.findAll(".FileListTableContent");
        expect(contentElements.length).toEqual(2);
        expect(contentElements.at(0).text()).toContain("Test File 1");
        expect(contentElements.at(1).text()).toContain("Test File 2");
    });

    it("clicking select all checkbox emits selected-updated event", async () => {
        const wrapper = mount(FileList, {
            propsData: {
                headers,
                itemKey: "id",
                items,
                selected: [],
            },
            scopedSlots: {
                default: "<template slot-scope='props'>{{ props.item.name }}</template>",
            },
            sync: false,
        });
        await wrapper.vm.$nextTick();
        wrapper.find(".FileListSelectAllCheckbox").trigger("click");
        const selected: typeof items = wrapper.emitted()["selected-updated"][0][0];
        expect(selected.length).toEqual(2);
        expect(selected[0].name).toEqual("Test File 1");
        expect(selected[1].name).toEqual("Test File 2");
    });

    it("clicking select all two times emits selected-updated event with blank array", async () => {
        const wrapper = mount(FileList, {
            propsData: {
                headers,
                itemKey: "id",
                items,
                selected: [],
            },
            scopedSlots: {
                default: "<template slot-scope='props'>{{ props.item.name }}</template>",
            },
            sync: false,
        });
        await wrapper.vm.$nextTick();
        wrapper.find(".FileListSelectAllCheckbox").trigger("click");
        const selected: typeof items = wrapper.emitted()["selected-updated"][0][0];
        wrapper.setProps({ selected });
        wrapper.find(".FileListSelectAllCheckbox").trigger("click");
        expect((wrapper.emitted()["selected-updated"][1][0] as typeof items).length).toEqual(0);
    });

    it("selected array length > 0 and < items array length sets select all checkbox to indeterminate", async () => {
        const wrapper = mount(FileList, {
            propsData: {
                headers,
                itemKey: "id",
                items,
                selected: [items[0]],
            },
            scopedSlots: {
                default: "<template slot-scope='props'>{{ props.item.name }}</template>",
            },
            sync: false,
        });
        await wrapper.vm.$nextTick();
        const selectAll = wrapper.find(".FileListSelectAllCheckbox");
        expect(selectAll.vm.$props.inputValue).toBeFalsy();
        expect(selectAll.vm.$props.indeterminate).toBeTruthy();
    });

    it("blank selected array sets select all checkbox to unchecked", async () => {
        const wrapper = mount(FileList, {
            propsData: {
                headers,
                itemKey: "id",
                items,
                selected: [],
            },
            scopedSlots: {
                default: "<template slot-scope='props'>{{ props.item.name }}</template>",
            },
            sync: false,
        });
        await wrapper.vm.$nextTick();
        const selectAll = wrapper.find(".FileListSelectAllCheckbox");
        expect(selectAll.vm.$props.inputValue).toBeFalsy();
        expect(selectAll.vm.$props.indeterminate).toBeFalsy();
    });

    it("selected array same as items array length sets select all checkbox to checked", async () => {
        const wrapper = mount(FileList, {
            propsData: {
                headers,
                itemKey: "id",
                items,
                selected: items,
            },
            scopedSlots: {
                default: "<template slot-scope='props'>{{ props.item.name }}</template>",
            },
            sync: false,
        });
        await wrapper.vm.$nextTick();
        const selectAll = wrapper.find(".FileListSelectAllCheckbox");
        expect(selectAll.vm.$props.inputValue).toBeTruthy();
        expect(selectAll.vm.$props.indeterminate).toBeFalsy();
    });

    it("changes sort to ascending on first sort button click", async () => {
        const wrapper = mount(FileList, {
            propsData: {
                headers,
                itemKey: "id",
                items,
                selected: [],
            },
            scopedSlots: {
                default: "<template slot-scope='props'>{{ props.item.name }}</template>",
            },
            sync: false,
        });
        const headerContent = wrapper.find(".FileListTableHeaderContent");
        headerContent.trigger("click");
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.$data.pagination.sortBy).toEqual("name");
        expect(wrapper.vm.$data.pagination.descending).toEqual(false);
        expect(headerContent.classes()).not.toContain("desc");
        expect(headerContent.classes()).toContain("asc");
        expect(headerContent.classes()).toContain("active");
        const contentElements = wrapper.findAll(".FileListTableContent");
        expect(contentElements.length).toEqual(2);
        expect(contentElements.at(0).text()).toEqual("Test File 1");
        expect(contentElements.at(1).text()).toEqual("Test File 2");
    });

    it("changes sort to descending on second sort button click", async () => {
        const wrapper = mount(FileList, {
            propsData: {
                headers,
                itemKey: "id",
                items,
                selected: [],
            },
            scopedSlots: {
                default: "<template slot-scope='props'>{{ props.item.name }}</template>",
            },
            sync: false,
        });
        const headerContent = wrapper.find(".FileListTableHeaderContent");
        headerContent.trigger("click");
        headerContent.trigger("click");
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.$data.pagination.sortBy).toEqual("name");
        expect(wrapper.vm.$data.pagination.descending).toEqual(true);
        expect(headerContent.classes()).not.toContain("asc");
        expect(headerContent.classes()).toContain("desc");
        expect(headerContent.classes()).toContain("active");
        const contentElements = wrapper.findAll(".FileListTableContent");
        expect(contentElements.length).toEqual(2);
        expect(contentElements.at(0).text()).toEqual("Test File 2");
        expect(contentElements.at(1).text()).toEqual("Test File 1");
    });

    it("changes sort to none on third sort button click", async () => {
        const wrapper = mount(FileList, {
            propsData: {
                headers,
                itemKey: "id",
                items,
                selected: [],
            },
            scopedSlots: {
                default: "<template slot-scope='props'>{{ props.item.name }}</template>",
            },
            sync: false,
        });
        const headerContent = wrapper.find(".FileListTableHeaderContent");
        headerContent.trigger("click");
        headerContent.trigger("click");
        headerContent.trigger("click");
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.$data.pagination.sortBy).toEqual("");
        expect(wrapper.vm.$data.pagination.descending).toEqual(false);
        expect(headerContent.classes()).not.toContain("active");
        const contentElements = wrapper.findAll(".FileListTableContent");
        expect(contentElements.length).toEqual(2);
        expect(contentElements.at(0).text()).toEqual("Test File 1");
        expect(contentElements.at(1).text()).toEqual("Test File 2");
    });

    it("emits add-click event on add button click", async () => {
        const wrapper = mount(FileList, {
            propsData: {
                headers,
                itemKey: "id",
                items,
                selected: [],
            },
            scopedSlots: {
                default: "<template slot-scope='props'>{{ props.item.name }}</template>",
            },
            sync: false,
        });
        await wrapper.vm.$nextTick();
        wrapper.find(".FileListAddBtn").trigger("click");
        expect(wrapper.emitted()["add-click"]).toEqual([[]]);
    });

    it("remove button is hidden with blank selected array", async () => {
        const wrapper = mount(FileList, {
            propsData: {
                headers,
                itemKey: "id",
                items,
                selected: [],
            },
            scopedSlots: {
                default: "<template slot-scope='props'>{{ props.item.name }}</template>",
            },
            sync: false,
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find(".FileListRemoveBtn").exists()).toBeFalsy();
    });

    it("remove button is visible with selected array elements", async () => {
        const wrapper = mount(FileList, {
            propsData: {
                headers,
                itemKey: "id",
                items,
                selected: items,
            },
            scopedSlots: {
                default: "<template slot-scope='props'>{{ props.item.name }}</template>",
            },
            sync: false,
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find(".FileListRemoveBtn").exists()).toBeTruthy();
    });

    it("emits remove-click on remove button click", async () => {
        const wrapper = mount(FileList, {
            propsData: {
                headers,
                itemKey: "id",
                items,
                selected: items,
            },
            scopedSlots: {
                default: "<template slot-scope='props'>{{ props.item.name }}</template>",
            },
            sync: false,
        });
        await wrapper.vm.$nextTick();
        wrapper.find(".FileListRemoveBtn").trigger("click");
        expect(wrapper.emitted()["remove-click"]).toEqual([[]]);
    });

});
