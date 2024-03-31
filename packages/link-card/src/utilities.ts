import {
  Editor,
  findParentNodeClosestToPos,
  NodeSelection,
  selectionToInsertionEnd,
} from "@sailkit/core";

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
      const from = tr.mapping.map(Math.max(0, start - 1));
      const to = tr.mapping.map(end);
      tr.deleteRange(from, to);
      tr.insert(from, node);
      selectionToInsertionEnd(tr, tr.steps.length - 1, -1);
      return dispatch?.(tr);
    })
    .run();
};

export const getLinkCardAtSelection = (editor: Editor): LinkAtSelection | null => {
  const { state } = editor;
  const selection = state.selection as NodeSelection;

  const maybeLinkCard =
    selection?.node?.type?.name === LinkCard.name
      ? {
          pos: selection.from,
          node: selection.node,
        }
      : findParentNodeClosestToPos(selection.$head, (node) => node.type.name === LinkCard.name);

  if (!maybeLinkCard) return null;

  return {
    start: maybeLinkCard.pos,
    end: maybeLinkCard.pos + maybeLinkCard.node.nodeSize,
    text: maybeLinkCard.node.attrs.text,
    href: maybeLinkCard.node.attrs.href,
  };
};
