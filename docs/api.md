---
outline: deep
---

# Base Text Editor

```javascript
import { Editor } from "@sailkit/core";
import { Document } from "@sailkit/document";
import { TextKit } from "@sailkit/text-kit";

const editor = new Editor({
  element: document.querySelector("#app"),
  extensions: [Document, TextKit],
});
```

<script setup>
import BaseTextEditor from './examples/base-text-editor.vue'
</script>

Try type below:

<BaseTextEditor />
