import ReactDOM from "react-dom";
import { Editor, posToDOMRect } from "@sailkit/core";
import { tippy } from "@sailkit/bubble-menu";

import { type LinkOptions } from "@sailkit/link";
import { setToLinkCard } from "@sailkit/link-card";

import { LinkViewSwitch, LinkView } from "../components/link-view-switch";

const cache = new WeakMap<Editor, () => void>();

export const showLinkViewSwitchOnLinkSet: LinkOptions["onLinkSet"] = ({
  editor,
  text,
  href,
  start,
  end,
}) => {
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
    <LinkViewSwitch
      onOk={({ type }) => {
        hide();

        if (type === LinkView.Link) return;

        if (type === LinkView.Card) {
          setToLinkCard(editor, { start, end, text, href });
          return;
        }
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
