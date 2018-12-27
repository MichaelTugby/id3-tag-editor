# Tag Reader

## Functionality

The tag reader is a file upload component which parses the uploaded file using a ID3 parser.

### Props

`<tag-reader>` supports the following custom component attributes:

| attribute | type | description
| --- | --- | ---
| `tag-parser-fn` | (files: File[]) => object[] | A function to parse an array of files into an array of ID3 tags.
| `tags` | object[] | The array of parsed files. Can be bound to using `v-model`.

### Events

`<tag-reader>` emits the following events:

| event | args type | description
| --- | --- | ---
| `tags-updated` | object[] | The updated array of tag objects. Automatically emitted when using `v-model`.

### Slots

`<tag-reader>` exposes the followings slots:

| slot | props | description
| --- | --- | ---
| `default` | n/a | Default slot.

### Example

```html
<tag-reader v-model="tags"
            tag-parser-fn="tagParserFn" />
```

```ts
import Vue from 'vue';
import { Component } from "vue-property-decorator";

import { readTagsSync } from "taglib2";

import TagReader from '~/src/renderer/components/TagReader/TagReader.vue';

@Component({
    components: {
        TagReader,
    },
})
export default class GenericComponent extends Vue {
    private tags = [];

    private tagParserFn(files: File[]) {
        return files.map((file) => readTagsSync(file));
    }
}
```