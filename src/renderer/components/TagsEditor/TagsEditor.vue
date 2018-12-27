<template lang="pug">
    v-form.TagsEditor
        slot(v-for="header in headers" :name="header.value" :form="formTag" :header="header")
            v-text-field(:label="header.text"
                         v-model="formTag[header.value]"
                         :id="header.value").TagsEditorTextField
        v-btn(@click="submit" color="primary").TagsEditorSubmitBtn Save Changes
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";

import { IHeader } from "~/src/types/header";

import VBtn from "vuetify/es5/components/VBtn";
import VForm from "vuetify/es5/components/VForm";
import VTextField from "vuetify/es5/components/VTextField";

@Component({
    components: {
        VBtn,
        VForm,
        VTextField,
    },
})
export default class TagsEditor extends Vue {
    @Prop({default: (prev, curr) => prev.toString() === curr.toString(),
           type: Function}) private equalityCheckFn!: (prev, curr) => boolean;
    @Prop({type: Array, required: true}) private items!: Array<{[key: string]: any}>;
    @Prop({type: Array, required: true}) private headers!: IHeader[];
    private regexFinder = /<\/([^>]*)\/([a-zA-Z1-9]*)>/g;

    private get groupedItems() {
        return this.headers.reduce((acc, tag) => {
            acc[tag.value] = this.items.map((item) => item[tag.value]);
            return acc;
        }, {} as {[key: string]: any[]});
    }

    private formTag: {[key: string]: any} = {};

    @Watch("groupedItems", { immediate: true })
    private groupedItemsChanged() {
        this.formTag = Object.entries(this.groupedItems).reduce((acc, [key, val]) => {
            acc[key] = val.reduce((valAcc, currVal) => {
                return this.equalityCheckFn(valAcc, currVal) ? valAcc : "<keep>";
            });
            return acc;
        }, {} as {[key: string]: any});
    }

    private replaceKeep(val: string | number | object, orig: string | number | object) {
        const replaced = typeof orig === "object" ? orig : val.toString().replace(/<keep>/g, orig.toString());
        const parsed = parseInt(replaced.toString(), 10);
        return typeof orig === "number" && typeof replaced === "string" && !isNaN(parsed) ? parsed : replaced;
    }

    private replaceRegex(val: string | number | object, orig: string | number | object) {
        const regexs = val.toString().match(new RegExp(this.regexFinder));
        const replaced = !regexs ? val : regexs.reduce((acc, regex) => {
            const [, pattern, flags] = new RegExp(this.regexFinder).exec(regex) as RegExpExecArray;
            const matches = orig.toString().match(new RegExp(pattern, flags));
            return acc.toString().replace(regex, matches ? matches.join("") : "");
        }, val) || orig;
        const parsed = parseInt(replaced.toString(), 10);
        return typeof orig === "number" && typeof replaced === "string" && !isNaN(parsed) ? parsed : replaced;
    }

    private submit() {
        const updatedTags = this.items.map((currTag) => {
            return Object.entries(currTag).reduce((acc, [key, val]) => {
                const formVal = this.formTag[key] === undefined ? String(acc[key]) : String(this.formTag[key]);
                acc[key] = typeof this.formTag[key] === "object" ?
                    this.formTag[key] :
                    this.replaceRegex(this.replaceKeep(formVal, val), val);
                return acc;
            }, {...currTag});
        });
        this.$emit("submit", updatedTags);
    }
}
</script>
