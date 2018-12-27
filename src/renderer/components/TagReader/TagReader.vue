<template lang="pug">
    .TagReader(@dragover.prevent=""
               @drop.prevent="handleDrop")
        slot
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Model, Prop } from "vue-property-decorator";

import { ITag } from "~/src/types/tag";

@Component
export default class TagReader extends Vue {
    @Prop({type: Function, required: true})
        private tagParserFn!: (files: File[]) => Promise<object[]> | object[];
    @Model("tags-updated", {type: Array, required: true}) private tags!: object[];

    private showFileDialog() {
        const input = document.createElement("input");
        input.type = "file";
        input.multiple = true;
        input.accept = "audio/*";
        input.click();
        input.addEventListener("change", (event) => {
            event.preventDefault();
            const target = event.target as HTMLInputElement;
            if (target.files && target.files.length) {
                this.getTags(Array.from(target.files));
            }
        });
    }

    private handleDrop(event: DragEvent) {
        const filteredFiles = Array.from(event.dataTransfer.files).filter((file) =>
            file.type.includes("audio"),
        );
        if (filteredFiles.length) {
            this.getTags(filteredFiles);
        } else {
            this.$emit("error", new Error("Invalid file type."));
        }
    }

    private async getTags(files: File[]) {
        try {
            const tags = await this.tagParserFn(files);
            if (tags.length) {
                this.$emit("tags-updated", tags);
            } else {
                this.$emit("error", new Error("No tags successfully parsed from files."));
            }
        } catch (e) {
            this.$emit("error", e);
        }
    }
}
</script>

<style lang="stylus" scoped>
.TagReader {
    height: 100%;
    width: 100%;
}
</style>
