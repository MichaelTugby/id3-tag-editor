<template lang="pug">
    .FileList
        v-data-table(:headers="headers"
                    :items="items"
                    select-all
                    :value="selected"
                    @input="$emit('selected-updated', $event)"
                    class="elevation-1"
                    :pagination.sync="pagination"
                    :item-key="itemKey"
                    :rows-per-page-items="[10, 20, 50]").FileListTable
            template(slot="headers"
                     slot-scope="{ headers }")
                tr.FileListTableRow.FileListTableHeaderRow
                    th.FileListTableHeader.FileListSelectAll
                        v-checkbox(:input-value="selected.length && selected.length === items.length ? true : false"
                                   :indeterminate="selected.length && selected.length !== items.length ? true : false"
                                   primary
                                   hide-details
                                   @click.native="toggleAll").FileListSelectAllCheckbox
                    th(v-for="header in headers"
                       :key="header.text"
                       :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                       @click="changeSort(header.value)").text-xs-left.FileListTableHeader.FileListTableHeaderContent {{ header.text }}
                        v-icon(small) arrow_upward
            template(slot="items"
                     slot-scope="props")
                tr(:active="props.selected"
                   @click="props.selected = !props.selected").FileListTableRow
                    td.FileListTableCell.FileListTableSelector
                        v-checkbox(primary
                                   :input-value="props.selected"
                                   hide-details).FileListSelectCheckbox
                    td.FileListTableCell.FileListTableContent
                        slot(:item="props.item")
        v-btn(@click="$emit('add-click')"
              color="primary").FileListAddBtn Add Files
        v-btn(v-if="selected.length"
              @click="$emit('remove-click')"
              color="error").FileListRemoveBtn Clear Files
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Model, Prop } from "vue-property-decorator";

import { IHeader } from "~/src/types/header";

import VBtn from "vuetify/es5/components/VBtn";
import VCheckbox from "vuetify/es5/components/VCheckbox";
import VDataTable from "vuetify/es5/components/VDataTable";
import VIcon from "vuetify/es5/components/VIcon";

@Component({
    components: {
        VBtn,
        VCheckbox,
        VDataTable,
        VIcon,
    },
})
export default class FileList extends Vue {
    @Prop({type: Array, required: true}) private headers!: IHeader[];
    @Prop({type: Array, required: true}) private items!: object[];
    @Prop({type: String, required: true}) private itemKey!: string;
    @Model("selected-updated", {type: Array, required: true}) private selected!: object[];

    private pagination = { sortBy: "", descending: false };

    private toggleAll() {
        const updatedSelected = this.selected.length === this.items.length ?
            [] :
            this.items.slice();
        this.$emit("selected-updated", updatedSelected);
    }

    private changeSort(column) {
        if (this.pagination.sortBy === column) {
            if (this.pagination.descending) {
                this.pagination.sortBy = "";
                this.pagination.descending = false;
            } else {
                this.pagination.descending = true;
            }
        } else {
            this.pagination.sortBy = column;
            this.pagination.descending = false;
        }
    }
}
</script>

<style lang="stylus" scoped>
.FileListTable {
    /deep/ .FileListTableRow {
        cursor: pointer;
    }
}
</style>
