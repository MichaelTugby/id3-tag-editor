# Image Field

## Functionality

The image field component is an input component, which allows a user to: add, update and remove images. Images may be added via file dialog or drag/drop.

### Props

`<image-field>` supports the following custom component attributes:

| attribute | type | description
| --- | --- | ---
| `default-image` | String | The default base64 encoded image value.
| `images` | string[] | The array of base64 encoded images. Can be bound to using `v-model`.
| `label` | string *optional* | The form label.
| `placeholder` | string *optional* | The form placeholder.

### Events

`<image-field>` emits the following events:

| event | args type | description
| --- | --- | ---
| `error` | Error | An error object.
| `images-updated` | string[] | The updated array of base64 encoded images. Emitted automatically when using `v-model`.

### Example

```html
<image-field :images="images"
             label="Album Art"
             placeholder="Drop Image Here" />
```

```ts
import Vue from 'vue';
import { Component } from "vue-property-decorator";

import ImageField from '~/src/renderer/components/ImageField/ImageField.vue';

@Component({
    components: {
        ImageField,
    },
})
export default class GenericComponent extends Vue {
    private images = ["data:image/;base64,"];
}
```