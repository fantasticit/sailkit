import React, { useCallback, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { Editor, ValuesOf, posToDOMRect } from "@sailkit/core";
import { tippy } from "@sailkit/bubble-menu";

import { Dropdown } from "@douyinfe/semi-ui";
import { Link, type LinkOptions } from "@sailkit/link";
import { LinkCard, setToLinkCard } from "@sailkit/link-card";

const LinkViewType = {
  [Link.name]: Link.name,
  [LinkCard.name]: LinkCard.name,
};

export const LinkEdit: React.FC<{
  onOk: (arg: { type: ValuesOf<typeof LinkViewType> }) => void;
  onCancel: () => void;
}> = ({ onOk }) => {
  const linkInputRef = useRef<HTMLInputElement>(null);

  const setType = useCallback(
    (type: ValuesOf<typeof LinkViewType>) => {
      onOk &&
        onOk({
          type,
        });
    },
    [onOk],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      linkInputRef.current?.focus();
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div style={{ width: 200 }}>
      <Dropdown.Menu>
        <Dropdown.Title>显示为</Dropdown.Title>
        <Dropdown.Item onClick={() => setType(Link.name)}>链接视图</Dropdown.Item>
        <Dropdown.Item onClick={() => setType(LinkCard.name)}>卡片视图</Dropdown.Item>
      </Dropdown.Menu>
    </div>
  );
};

const cache = new WeakMap<Editor, () => void>();

export const onLinkSet: LinkOptions["onLinkSet"] = ({ editor, text, href, start, end }) => {
  if (cache.has(editor)) {
    cache.get(editor)?.();
  }

  const div = document.createElement("div");
  div.className = "bubble-menu";

  const hide = () => {
    popup?.[0]?.hide();
  };

  const onClick = (e: MouseEvent) => {
    if ((e.target && div.contains(e.target as Node)) || div === e.target) return;
    hide();
  };

  ReactDOM.render(
    <LinkEdit
      onOk={({ type }) => {
        popup?.[0]?.hide();

        if (type === Link.name) return;

        if (type === LinkCard.name) {
          setToLinkCard(editor, { start, end, text, href });
          return;
        }
      }}
      onCancel={() => {
        popup?.[0]?.hide();
      }}
    />,
    div,
  );

  const popup = tippy("body", {
    getReferenceClientRect: () => posToDOMRect(editor.view, end, end),
    appendTo: () => editor.options.element,
    content: div,
    showOnCreate: true,
    interactive: true,
    trigger: "manual",
    placement: "bottom-start",
    theme: "bubble-menu padding-8",
    arrow: false,
    onShow() {
      window.addEventListener("wheel", hide);
      editor.view.dom.addEventListener("beforeinput", hide);
      document.documentElement.addEventListener("mousedown", onClick);
    },
    onHide() {
      window.removeEventListener("wheel", hide);
      editor.view.dom.removeEventListener("beforeinput", hide);
      document.documentElement.removeEventListener("mousedown", onClick);
      ReactDOM.unmountComponentAtNode(div);
      cache.delete(editor);
    },
  });

  cache.set(editor, hide);
};
