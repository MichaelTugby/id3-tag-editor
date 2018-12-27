import { config, createLocalVue, mount, RouterLinkStub } from "@vue/test-utils";
import App from "./App.vue";

import Vue from "vue";
import Vuetify from "vuetify/es5/components/Vuetify";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);
Vue.use(Vuetify);

const reset = jest.fn();
const snackbar = {
    getters: {
        hasMessage: () => true,
    },
    mutations: {
        reset,
    },
    namespaced: true,
    state: {
        color: "info",
        message: "Test Message",
    },
};
const store = new Vuex.Store({
    modules: {
        snackbar,
    },
});
const stubs = ["router-view"];

config.logModifiedComponents = false;

describe("App Layout", () => {

    it("is a Vue instance", () => {
        const wrapper = mount(App, { localVue, store, stubs });
        expect(wrapper.isVueInstance()).toBeTruthy();
    });

    it("snapshot has not changed", () => {
        const wrapper = mount(App, { localVue, store, stubs });
        expect(wrapper.html()).toMatchSnapshot();
    });

    it("snackbar displays message", () => {
        const wrapper = mount(App, { localVue, store, stubs });
        expect(wrapper.find("#AppSnackbar").text()).toContain("Test Message");
    });

    it("snackbar does not appear if hasMessage getter is false", () => {
        const storeWithNoMessage = new Vuex.Store({
            modules: {
                snackbar: {...snackbar, getters: {
                    hasMessage: () => false,
                }},
            },
        });
        const wrapper = mount(App, { localVue, store: storeWithNoMessage, stubs });
        expect(wrapper.find("#AppSnackbar").exists()).toBeFalsy();
    });

    it("clicking snackbar close button fires reset fn", () => {
        const wrapper = mount(App, { localVue, store, stubs });
        expect(reset).not.toBeCalled();
        wrapper.find("#AppSnackbarCloseBtn").trigger("click");
        expect(reset).toBeCalled();
    });

});
