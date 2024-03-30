import {
  combineTransactionSteps,
  Editor,
  findChildrenInRange,
  getChangedRanges,
  PMMarkType,
  PMPlugin,
  PMPluginKey,
  Transaction,
} from "@sailkit/core";

export type OnLinkSetOptions = {
  editor: Editor;
  type: PMMarkType;
  onLinkSet: (arg: {
    editor: Editor;
    text: string;
    href: string;
    start: number;
    end: number;
  }) => void;
};

export function createOnLinkSetPlugin(options: OnLinkSetOptions): PMPlugin {
  return new PMPlugin({
    key: new PMPluginKey("onLinkSet"),
    appendTransaction: (transactions, oldState, newState) => {
      const preventOnLinkSetHook = transactions.some((transaction) =>
        transaction.getMeta("preventOnLinkSetHook"),
      );

      if (preventOnLinkSetHook) {
        return undefined;
      }

      const docChanged =
        transactions.some((transaction) => transaction.docChanged) &&
        !oldState.doc.eq(newState.doc);

      if (!docChanged) return undefined;

      const transform = combineTransactionSteps(oldState.doc, transactions as Transaction[]);
      const changes = getChangedRanges(transform);

      let target: Parameters<OnLinkSetOptions["onLinkSet"]>[0] | null = null;

      changes.forEach(({ newRange }) => {
        const newNodes = findChildrenInRange(newState.doc, newRange, (node) => {
          return !!options.type.isInSet(node.marks);
        });
        newNodes.forEach(({ node, pos }) => {
          target = {
            editor: options.editor,
            text: node.textContent,
            href: node.marks.find((mark) => mark.type.name === options.type.name)!.attrs["href"],
            start: pos,
            end: node.nodeSize + pos,
          };
        });
      });

      if (target) {
        options.onLinkSet(target);
      }

      return undefined;
    },
  });
}
