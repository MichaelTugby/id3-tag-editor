import Vue from "vue";
import { AllElectron } from "electron";

declare module "vue/types/vue" {
    interface Vue {
        readonly $electron: AllElectron;
    }
}
