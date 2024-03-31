import React, { useRef, useCallback } from "react";
import { Editor } from "@sailkit/react";
import { useAttrs, BubbleMenu } from "@sailkit/react";
import { Link, getLinkAtSelection } from "@sailkit/link";

import { Button, Divider, Space, Dropdown } from "@douyinfe/semi-ui";

import { LinkView, LinkViewSwitch, LinkViewSwitchProps } from "../components/link-view-switch";

import { showLinkURLEditor } from "../utilities/showLinkURLEditor";
import { setToLinkCard } from "@sailkit/link-card";

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
    showLinkURLEditor(editor, containerRef.current as HTMLElement);
  }, [editor]);

  const unsetLink = useCallback(
    () => editor.chain().extendMarkRange(Link.name).unsetLink().run(),
    [editor],
  );

  const switchLinkView = useCallback<LinkViewSwitchProps["onOk"]>(
    ({ type }) => {
      const linkAtSelection = getLinkAtSelection(editor);

      if (!linkAtSelection) {
        return;
      }

      const { start, end, text, href } = linkAtSelection;

      if (type === LinkView.Link) return;

      if (type === LinkView.Card) {
        setToLinkCard(editor, { start, end, text, href });
        return;
      }
    },
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

          <Dropdown render={<LinkViewSwitch onOk={switchLinkView} />} clickToHide>
            <Button size="small">链接视图</Button>
          </Dropdown>

          <Divider />

          <Button onClick={unsetLink} size="small">
            去除链接
          </Button>
        </Space>
      </div>
    </BubbleMenu>
  );
};
