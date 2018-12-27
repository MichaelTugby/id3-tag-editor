<template lang="pug">
    .ImageField(@dragover.prevent=""
                @drop.prevent="handleDrop")
        v-input.ImageFieldInput.mt-0
            .ImageFieldSlot
                .v-label.ImageFieldLabel {{ label }}
                .ImageFieldPlaceholder.ml-2.mt-2(v-if="!images.length") {{ placeholder }}
                img(v-else
                    v-for="image in images"
                    :src="image"
                    width="200").ml-2.mt-2.ImageFieldContainer
        v-btn(@click="showFileDialog" color="primary").ImageFieldUpdateBtn.mt-0.mb-3 Select Image
        v-btn(@click="removeImage" color="error").ImageFieldRemoveBtn.mt-0.mb-3 Remove Image
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Model, Prop } from "vue-property-decorator";

import VBtn from "vuetify/es5/components/VBtn";
import VInput from "vuetify/es5/components/VInput";
import VTextField from "vuetify/es5/components/VTextField";

@Component({
    components: {
        VBtn,
        VInput,
        VTextField,
    },
})
export default class AlbumArtField extends Vue {
    @Model("images-updated", { type: Array, required: true }) private images!: string[];
    @Prop({type: String}) private defaultImage!: string | undefined;
    @Prop({type: String, default: "Image"}) private label!: string;
    @Prop({type: String, default: "Drag Image Here"}) private placeholder!: string;

    private async handleDrop(event: DragEvent) {
        event.stopPropagation();
        const filteredFiles = Array.from(event.dataTransfer.files).filter((file) =>
            file.type.includes("image"),
        );
        if (filteredFiles.length) {
            try {
                const images = await this.getImages(filteredFiles);
                this.$emit("images-updated", images);
            } catch (e) {
                this.$emit("error", e);
            }
        } else {
            this.$emit("error", new Error("File type must be an image."));
        }
    }

    private getImages(files: File[]) {
        return Promise.all(files.map((file) => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.addEventListener("error", (e) => reject(e));
                reader.addEventListener("load", () => {
                    const data = new Uint8Array(reader.result as ArrayBuffer);
                    resolve(`data:${file.type};base64,${btoa(String.fromCharCode.apply(null, data))}`);
                });
                reader.readAsArrayBuffer(file);
            });
        }));
    }

    private showFileDialog() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.click();
        input.addEventListener("change", async (event) => {
            event.preventDefault();
            const target = event.target as HTMLInputElement;
            if (target.files) {
                try {
                    const images = await this.getImages(Array.from(target.files));
                    this.$emit("images-updated", images);
                } catch (e) {
                    this.$emit("error", e);
                }
            }
        });
    }

    private removeImage() {
        this.$emit("images-updated", this.defaultImage ? [this.defaultImage] : []);
    }
}
</script>

<style lang="stylus" scoped>
.ImageFieldContainer {
    border: 1px solid black;
}
.ImageFieldPlaceholder {
    @extend .ImageFieldContainer;
    height: 200px;
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
