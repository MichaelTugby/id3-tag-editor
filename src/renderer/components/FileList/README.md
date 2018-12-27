# File List

## Functionality

The file list component displays a list of files in a table. Files in the list may be selected and removed.

### Props

`<file-list>` supports the following custom component attributes:

| attribute | type | description
| --- | --- | ---
| `headers` | IHeader[] | The headers of the file list. Should be in the form `{ text: string, value: string }`.
| `items` | object[] | The array of file objects.
| `itemKey` | String | The key to a unique ID in a file object.
| `selected` | object[] | The array of selected file objects. Can be bound to using `v-model`.

### Events

`<file-list>` emits the following events:

| event | args type | description
| --- | --- | ---
| `add-click` | n/a | Fired on add button click.
| `remove-click` | n/a | Fired on remove button click.
| `selected-updated` | object[] | The updated selected file objects. Automatically emitted when using `v-model`.

### Slots

`<file-list>` exposes the followings slots:

| slot | props | description
| --- | --- | ---
| `default` | item: object | The text to display for each table row.

### Example

```html
<file-list :headers="headers"
           :items="items"
           item-key="id"
           v-model="selected"
           @add-click="addNew"
           @remove-selected="removeSelected">
    <template slot-scope="{ item }">{{ item.name }}</template>
</file-list>
```

```ts
import Vue from 'vue';
import { Component } from "vue-property-decorator";

import FileList from '~/src/renderer/components/FileList/FileList.vue';

@Component({
    components: {
        FileList,
    },
})
export default class GenericComponent extends Vue {
    private headers = [{
        name: "Filename",
        value: "name"
    }];

    private items = [{
        id: 1,
        name: "Test File"
    }, {
        id: 2,
        name: "Test File 2"
    }];
    
    private selected = [];

    private addNew() {
        this.items.push({
            id: 3,
            name: "Test File 3",
        });
    }

    private removeSelected() {
        this.items = this.items.filter((item) =>
            !this.selected.some((selectedItem) => selectedItem.id === item.id)
        );
        this.selected = [];
    }
}
```