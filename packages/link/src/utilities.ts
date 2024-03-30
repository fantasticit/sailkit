import { Editor, getMarkRange, isMarkActive } from "@sailkit/core";

import { Link } from "./link";

type LinkAtSelection = {
  text: string;
  href: string;
  start: number;
  end: number;
  update: (arg: { text: string; href: string }) => boolean;
};

export const setToLink = (editor: Editor, options: Omit<LinkAtSelection, "update">) => {
  const { text, href, start, end } = options;

  return editor
    .chain()
    .command(({ tr, dispatch, state }) => {
      const schema = state.schema;
      const node = schema.text(text, [schema.marks.link.create({ href })]);
      const from = tr.mapping.map(start);
      const to = tr.mapping.map(end);
      tr.deleteRange(from, to);
      tr.insert(from, node);
      tr.scrollIntoView();
      tr.removeStoredMark(schema.marks.link);
      tr.setMeta("preventOnLinkSetHook", true);
      return dispatch?.(tr);
    })
    .focus()
    .run();
};

export const getLinkAtSelection = (editor: Editor): LinkAtSelection | null => {
  const { state } = editor;
  const isInLink = isMarkActive(state, Link.name);
  const selection = state.selection;

  let start: number;
  let end: number;
  let text;
  let href;

  if (!isInLink) {
    const { from, to } = selection;
    start = from;
    end = to;
    text = state.doc.textBetween(start, end);
    href = "";
  } else {
    const { from } = editor.state.selection;
    const range = getMarkRange(editor.state.doc.resolve(from), editor.state.schema.marks.link);

    if (!range) return null;

    start = range.from;
    end = range.to;
    const attrs = editor.getAttributes(Link.name);
    text = state.doc.textBetween(start, end);
    href = attrs.href;
  }

  return {
    text,
    href,
    start,
    end,
    update: ({ text, href }) => {
      return setToLink(editor, { text, href, start, end });
    },
  };
};
