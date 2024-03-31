<p align="center">
  <h2>Sailkit</h2>
</p>

<p align="center">
Sailkit is a toolkit editor suite based on tiptap and prosemirror.
</p>

# Example code (React)

```typescript
import { EditorContent, useEditor } from "@sailkit/react";
import { Document } from "@sailkit/document";
import { TextKit } from "@sailkit/text-kit";
import { BlockTile } from "@sailkit/blocktile";
import { Uuid } from "@sailkit/uuid";

export const Editor = () => {
  const editor = useEditor({
    extensions: [
        Document.extend({ content: "blockTile+" }),
        Uuid,
        BlockTile,
        TextKit,
    ],
  });

  return (
    <div>
      {editor && (
        <>
          <LinkBubbleMenu editor={editor} />
          <LinkCardBubbleMenu editor={editor} />
        </>
      )}
      <div>{editor && <LinkStaticMenu editor={editor} />}</div>
      <EditorContent className={styles.editorWrapper} editor={editor}></EditorContent>
    </div>
  );
};
```
