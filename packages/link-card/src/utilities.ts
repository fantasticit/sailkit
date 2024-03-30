import { Editor, selectionToInsertionEnd } from "@sailkit/core";

import { LinkCard } from "./link-card";

type LinkAtSelection = {
  text: string;
  href: string;
  start: number;
  end: number;
};

export const setToLinkCard = (editor: Editor, options: Omit<LinkAtSelection, "update">) => {
  const { text, href, start, end } = options;

  return editor
    .chain()
    .command(({ tr, dispatch, state }) => {
      const schema = state.schema;
      const node = schema.nodes[LinkCard.name].create({ text, href });
      const from = tr.mapping.map(start);
      const to = tr.mapping.map(end);
      tr.deleteRange(from, to);
      tr.insert(from, node);
      selectionToInsertionEnd(tr, tr.steps.length - 1, -1);
      return dispatch?.(tr);
    })
    .run();
};
