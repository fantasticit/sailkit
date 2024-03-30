import React, { useRef, useCallback } from "react";
import { Editor } from "@sailkit/react";
import { useAttrs, BubbleMenu } from "@sailkit/react";
import { Link } from "@sailkit/link";

import { Button, Divider, Space } from "@douyinfe/semi-ui";

import { showLinkEditor } from "./edit";

interface IProps {
  editor: Editor;
}

export const LinkBubbleMenu: React.FC<IProps> = ({ editor }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { href } = useAttrs(editor, Link.name, {
    href: "",
    target: "",
  });

  const shouldShow = useCallback(() => editor.isActive(Link.name), [editor]);

  const visitLink = useCallback(() => {
    const tab = window.open();
    if (!tab) return;
    tab.opener = null;
    tab.location = href;
  }, [href]);

  const openEditLinkModal = useCallback(() => {
    showLinkEditor(editor, containerRef.current as HTMLElement);
  }, [editor]);

  const unsetLink = useCallback(
    () => editor.chain().extendMarkRange(Link.name).unsetLink().run(),
    [editor],
  );

  return (
    <BubbleMenu editor={editor} shouldShow={shouldShow} className="bubble-menu">
      <div ref={containerRef}>
        <Space spacing={4}>
          <Button size="small" onClick={visitLink}>
            访问
          </Button>

          <Button size="small" onClick={openEditLinkModal}>
            编辑
          </Button>

          <Divider />

          <Button onClick={unsetLink} size="small">
            去除链接
          </Button>
        </Space>
      </div>
    </BubbleMenu>
  );
};
