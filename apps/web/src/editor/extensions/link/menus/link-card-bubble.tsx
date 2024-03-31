import React, { useRef, useCallback } from "react";
import { Editor } from "@sailkit/react";
import { useAttrs, BubbleMenu } from "@sailkit/react";
import { Link, setToLink } from "@sailkit/link";
import { LinkCard, getLinkCardAtSelection } from "@sailkit/link-card";
import { Button, Space, Dropdown } from "@douyinfe/semi-ui";

import { LinkView, LinkViewSwitch, LinkViewSwitchProps } from "../components/link-view-switch";

interface IProps {
  editor: Editor;
}

export const LinkCardBubbleMenu: React.FC<IProps> = ({ editor }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { href } = useAttrs(editor, Link.name, {
    href: "",
    target: "",
  });

  const shouldShow = useCallback(() => editor.isActive(LinkCard.name), [editor]);

  const visitLink = useCallback(() => {
    const tab = window.open();
    if (!tab) return;
    tab.opener = null;
    tab.location = href;
  }, [href]);

  const switchLinkView = useCallback<LinkViewSwitchProps["onOk"]>(
    ({ type }) => {
      const linkCardAtSelection = getLinkCardAtSelection(editor);

      if (!linkCardAtSelection) {
        return;
      }

      const { start, end, text, href } = linkCardAtSelection;

      if (type === LinkView.Link) {
        setToLink(editor, { start, end, text, href });
        return;
      }

      if (type === LinkView.Card) {
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

          <Dropdown render={<LinkViewSwitch onOk={switchLinkView} />} clickToHide>
            <Button size="small">卡片视图</Button>
          </Dropdown>
        </Space>
      </div>
    </BubbleMenu>
  );
};
