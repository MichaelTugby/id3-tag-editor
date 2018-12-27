<template lang="pug">
    v-app#App
        v-toolbar(app)#AppToolbar
            v-toolbar-title#AppToolbarTitle ID3 Tag Editor
        v-content#AppContent
            v-container(fluid fill-height).pa-0#AppContainer
                router-view#AppView
        v-snackbar(:value="displaySnackbar"
                   @input="resetSnackbar"
                   :color="snackbar.color")#AppSnackbar {{ snackbar.message }}
            v-btn(flat
                  color="white"
                  @click="resetSnackbar")#AppSnackbarCloseBtn Close
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Getter, Mutation, State } from "vuex-class";

import { ISnackbar } from "~/src/types/snackbar";

import VApp from "vuetify/es5/components/VApp";
import VBtn from "vuetify/es5/components/VBtn";
import { VContainer, VContent } from "vuetify/es5/components/VGrid";
import VSnackbar from "vuetify/es5/components/VSnackbar";
import VToolbar, { VToolbarTitle } from "vuetify/es5/components/VToolbar";

@Component({
    components: {
        VApp,
        VBtn,
        VContainer,
        VContent,
        VSnackbar,
        VToolbar,
        VToolbarTitle,
    },
})
export default class App extends Vue {
    @Getter("snackbar/hasMessage") private displaySnackbar!: boolean;
    @Mutation("snackbar/reset") private resetSnackbar!: () => void;
    @State("snackbar") private snackbar!: ISnackbar;
}
</script>
