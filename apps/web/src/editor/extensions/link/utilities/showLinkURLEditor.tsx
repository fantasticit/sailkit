import ReactDOM from "react-dom";
import { Editor, posToDOMRect } from "@sailkit/core";
import { tippy } from "@sailkit/bubble-menu";

import { getLinkAtSelection, setToLink } from "@sailkit/link";

import { LinkURLEditor } from "../components/link-url-editor";

export const showLinkURLEditor = (editor: Editor, dom?: HTMLElement) => {
  const linkAtSelection = getLinkAtSelection(editor);

  if (!linkAtSelection) {
    return;
  }

  const div = document.createElement("div");
  div.className = "bubble-menu";

  ReactDOM.render(
    <LinkURLEditor
      text={linkAtSelection.text}
      href={linkAtSelection.href}
      onOk={(values) => {
        popup?.[0]?.hide();
        setToLink(editor, { ...values, start: linkAtSelection.start, end: linkAtSelection.end });
      }}
      onCancel={() => {
        popup?.[0]?.hide();
        editor.chain().focus().run();
      }}
    />,
    div,
  );

  const popup = tippy("body", {
    getReferenceClientRect: () =>
      dom
        ? dom.getBoundingClientRect()
        : posToDOMRect(editor.view, linkAtSelection.start, linkAtSelection.end),
    appendTo: () => editor.options.element,
    content: div,
    showOnCreate: true,
    interactive: true,
    trigger: "manual",
    placement: "bottom-start",
    theme: "bubble-menu padding-8",
    arrow: false,
    onHide() {
      ReactDOM.unmountComponentAtNode(div);
    },
  });
};
