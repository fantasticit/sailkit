import { Editor, getMarkRange, isMarkActive } from "@sailkit/core";

import { Link } from "./link";

type LinkInselection = {
  text: string;
  href: string;
  update: (arg: { text: string; href: string }) => boolean;
};

export const getLinkInSelection = (editor: Editor): LinkInselection | null => {
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
    update: ({ text, href }) => {
      return editor.commands.command(({ tr, view }) => {
        const schema = view.state.schema;
        const node = schema.text(text, [schema.marks.link.create({ href })]);
        const from = tr.mapping.map(start);
        const to = tr.mapping.map(end);
        view.dispatch(view.state.tr.deleteRange(from, to));
        view.dispatch(view.state.tr.insert(from, node));
        view.dispatch(view.state.tr.scrollIntoView());
        editor.chain().focus().run();
        return true;
      });
    },
  };
};
