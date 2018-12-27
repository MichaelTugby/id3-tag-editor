<template lang="pug">
    tag-reader(v-model="tags"
               :tag-parser-fn="tagParserFn"
               @error="setSnackbar({ color: 'error', message: $event.message })"
               ref="tagReader")#Home
        v-container(grid-list-md
                    fluid)#HomeContainer
            v-layout(row
                     wrap)#HomeLayout
                v-flex.no-basis.HomeFlexContainer
                    file-list(:headers="headers"
                              :items="tags"
                              item-key="path"
                              v-model="selected"
                              @add-click="$refs.tagReader && $refs.tagReader.showFileDialog()"
                              @remove-click="removeSelected")#HomeFileList
                        template(slot-scope="{ item: { filename } }") {{ filename }}
                v-flex(v-if="selected.length").no-basis.HomeFlexContainer
                    tags-editor(v-if="selected.length"
                                :equality-check-fn="equalityCheckFn"
                                :headers="formHeaders"
                                :items="selected"
                                @submit="saveChanges")#HomeTagsEditor
                        image-field(slot="pictures"
                                    slot-scope="{ form, header: { text, value } }"
                                    default-image="data:image/;base64,"
                                    :images="toBase64(form[value])"
                                    :label="text"
                                    :placeholder="form[value] === '<keep>' ? '<keep>' : ''"
                                    @images-updated="form[value] = toUint8Array($event)"
                                    @error="setSnackbar({ color: 'error', message: $event.message })")#HomeImageField
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Mutation } from "vuex-class";

import { readTagsSync, writeTagsSync } from "taglib2";

import { IHeader } from "~/src/types/header";
import { ISnackbar } from "~/src/types/snackbar";
import { ITag, ITagPicture } from "~/src/types/tag";

import { VContainer, VFlex, VLayout } from "vuetify/es5/components/VGrid";
import FileList from "~/src/renderer/components/FileList/FileList.vue";
import ImageField from "~/src/renderer/components/ImageField/ImageField.vue";
import TagReader from "~/src/renderer/components/TagReader/TagReader.vue";
import TagsEditor from "~/src/renderer/components/TagsEditor/TagsEditor.vue";

@Component({
    components: {
        FileList,
        ImageField,
        TagReader,
        TagsEditor,
        VContainer,
        VFlex,
        VLayout,
    },
})
export default class Home extends Vue {
    @Mutation("snackbar/set") private setSnackbar!: (snackbar: ISnackbar) => void;

    private get tags(): ITag[] {
        return this.$store.state.tags;
    }
    private set tags(updatedTags) {
        this.$store.commit("tags/add", updatedTags);
    }

    private selected: ITag[] = [];

    private headers: IHeader[] = [
        { text: "File", value: "filename" },
    ];
    private formHeaders: IHeader[] = [
        { text: "Title", value: "title" },
        { text: "Artist", value: "artist" },
        { text: "Album", value: "album" },
        { text: "Album Artist", value: "albumartist" },
        { text: "Genre", value: "genre" },
        { text: "Track No.", value: "tracknumber" },
        { text: "Year", value: "year" },
        { text: "Compilation", value: "compilation" },
        { text: "Album Art", value: "pictures" },
        { text: "Disc No.", value: "discnumber" },
    ];

    private saveChanges(updatedTags: ITag[]) {
        updatedTags.forEach((updatedTag) => writeTagsSync(updatedTag.path, updatedTag));
        this.$store.commit("tags/update", updatedTags);
        this.setSnackbar({color: "success", message: "Successfully saved changes to tags."});
    }

    private tagParserFn(files: File[]) {
        return Array.from(new Set(files)).map((file) => {
            return {...readTagsSync(file.path), path: file.path, filename: file.name} as ITag;
        });
    }

    private equalityCheckFn(prev: string | ITagPicture[], curr: string | ITagPicture[]) {
        if (Array.isArray(prev) && Array.isArray(curr)) {
            return prev.length === curr.length && prev.every((arr) => {
                return curr.some((currArr) => currArr.picture.toString() === arr.picture.toString());
            });
        } else {
            return prev === curr;
        }
    }

    private removeSelected() {
        if (this.selected.length) {
            this.$store.commit("tags/remove", this.selected);
            this.selected = [];
        }
    }

    private toBase64(albumArt: ITagPicture[] | "<keep>"): string[] {
        return (albumArt === "<keep>" ? [] : albumArt).filter((art) => {
            return art.picture.length;
        }).map((art) => {
            return `data:${art.mimetype};base64,${btoa(String.fromCharCode.apply(null, art.picture))}`;
        });
    }

    private toUint8Array(base64s: string[]): ITagPicture[] {
        return base64s.map((base64) => {
            const [, mimetype, bytes] = new RegExp(/data:(.*);base64,(.*)/).exec(base64) as RegExpExecArray;
            return {
                mimetype,
                picture: new Uint8Array(Array.from(atob(bytes), (c) => c.charCodeAt(0))),
            };
        });
    }
}
</script>

<style lang="stylus" scoped>
#Home {
    height: 100%;
    width: 100%;
}
.no-basis {
    flex-basis: 0%;
}
</style>
