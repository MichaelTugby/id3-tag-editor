import { Module } from "vuex";

import { ISnackbar } from "~/src/types/snackbar";

export default {
    getters: {
        hasMessage(currentState) {
            return currentState.message ? true : false;
        },
    },
    mutations: {
        reset(currentState) {
            currentState.color = "success";
            currentState.message = "";
        },
        set(currentState, snackbar: ISnackbar) {
            currentState.color = snackbar.color;
            currentState.message = snackbar.message;
        },
    },
    namespaced: true,
    state: {
        color: "success",
        message: "",
    },
} as Module<ISnackbar, {}>;
