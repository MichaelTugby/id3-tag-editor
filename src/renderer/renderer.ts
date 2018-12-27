import "source-map-support/register";

import "./electron";
import router from "./routes/router";
import store from "./store/main";
import "./vuetify";

import Vue from "vue";
import App from "./layouts/App/App.vue";

new Vue({
    el: "#root",
    render: (h) => h(App),
    router,
    store,
});

if ((module as any).hot) {
    (module as any).hot.accept();
}
