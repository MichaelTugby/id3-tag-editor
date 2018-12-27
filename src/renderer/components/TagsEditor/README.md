# Tags Editor

## Functionality

The tags editor is a form component, which takes an array of tags and groups them together into one for editing. Each tag element passed in will automatically be displayed as a text field, but may be overwritten using a named slot.
`<keep>` is displayed when key values are different in the array provided. `<keep>` will get interpolated by the component on save, and will return the original value.
Regex's may also be entered into the form, such as: `</Original Mix/g>`. Regex's will get interpolated by the component on save, and will return the result of the regex, if any. If no result is found, the original value will instead be returned.

### Props

`<tags-editor>` supports the following custom component attributes:

| attribute | type | description
| --- | --- | ---
| `equality-check-fn` | (prev, curr) => boolean *optional* | A function to determine whether two tag values are equal. Defaults to `(prev, curr) => prev === curr`.
| `items` | object[] | The array of tags.
| `headers` | IHeader[] | The array of headers to display in the form. Should be in the form `{ text: string, value: string }` where text is the label to display, and value is the key it corresponds to in the items array.

### Events

`<tags-editor>` emits the following events:

| event | args type | description
| --- | --- | ---
| `submit` | object[] | The updated array of tags. Emitted upon form submission.

### Slots

`<tags-editor>` exposes the followings slots:

| slot | props | description
| --- | --- | ---
| `{header value}` | form: object[], header: IHeader | Optional slot for custom inputs. The name of the slot will be a header value provided in the headers prop. Form contains the key/value pairs of all the headers. Header contains the current tag header being iterated over.

### Example

```html
<tags-editor :items="items"
             :headers="headers"
             :equality-check-fn="equalityCheckFn"
             @submit="submit">
    <div slot="artist" slot-scope="{ form, header }">
        <label>{{ header.label }}</label>
        <input type="text"
               v-model="form[header.value]" />
    </div>
</tags-editor>
```

```ts
import Vue from 'vue';
import { Component } from "vue-property-decorator";

import { writeTagsSync } from "taglib2";

import TagsEditor from '~/src/renderer/components/TagsEditor/TagsEditor.vue';

@Component({
    components: {
        TagsEditor,
    },
})
export default class GenericComponent extends Vue {
    private items = [{
        title: "Test Song",
        artist: "Test Artist",
        path: "/path/to/file.mp3",
    }, {
        title: "Test Song 2",
        artist: "Test Artist",
        path: "/path/to/file.mp3",
    }];

    private headers = [{
        text: "Title",
        value: "title",
    }, {
        text: "Artist",
        value: "artist",
    }];

    private equalityCheckFn(prev, curr) {
        return prev === curr;
    }

    private submit(updatedTags) {
        updatedTags.map((updatedTag) => writeTagsSync(updatedTag.path, updatedTag));
    }
}
```