import { EditorContent, useEditor } from "@sailkit/react";
import { FullExtensions } from "./kit";

import styles from "./index.module.scss";
import { LinkBubbleMenu, LinkStaticMenu, LinkCardBubbleMenu } from "./extensions/link";

export const Editor = () => {
  const editor = useEditor({
    extensions: FullExtensions,
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
