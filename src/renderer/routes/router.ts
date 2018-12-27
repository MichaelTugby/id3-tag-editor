import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export default new VueRouter({
    mode: "history",
    routes: [
        {
            component: () => import("./Home/Home.vue"),
            path: "/",
        },
        {
            path: "*",
            redirect: "/",
        },
    ],
});
