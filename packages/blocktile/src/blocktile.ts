import {
  getNodeType,
  mergeAttributes,
  Node,
  NodeViewRendererProps,
  selectionToInsertionEnd,
} from "@sailkit/core";

import { BlockTileView } from "./blocktile-view";
import { BlockTileName } from "./constants";
import { getBlockTileAtPos } from "./utilities";

declare module "@sailkit/core" {
  interface Commands<ReturnType> {
    blockTile: {
      enterInBlockTile: () => ReturnType;
    };
  }
}

export const BlockTile = Node.create({
  name: BlockTileName,
  group: BlockTileName,
  content: "(block){1}",
  marks: "_",
  selectable: true,
  draggable: true,
  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: "blockTile",
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[class=blockTile]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, this.options.HTMLAttributes), 0];
  },

  addNodeView() {
    return (props: NodeViewRendererProps) => new BlockTileView(props);
  },

  addCommands() {
    return {
      enterInBlockTile:
        () =>
        ({ state, dispatch, tr }) => {
          const { selection, doc } = state;
          const { $from } = selection;
          const maybeBlockTile = getBlockTileAtPos(doc, selection.$anchor.pos);

          if (!maybeBlockTile) return false;

          const { node, parent, start, end } = maybeBlockTile;

          if (!node.firstChild) return false;

          const blockTileType = getNodeType(this.name, state.schema);
          const paragraphType = getNodeType("paragraph", state.schema);

          if (node.firstChild.type.spec.code) {
            const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2;
            const endsWithDoubleNewline = node.firstChild.textContent.endsWith("\n\n");

            if (!isAtEnd || !endsWithDoubleNewline) {
              tr.insertText("\n");
            } else {
              tr.delete($from.pos - 2, $from.pos).insert(
                $from.pos - 2 + 1,
                blockTileType.create(null, paragraphType.create(null)),
              );
            }
          } else if (
            parent &&
            parent.type.name !== "doc" &&
            parent.type.name !== this.name &&
            parent.type.spec.content?.includes(this.name)
          ) {
            const isAtEnd = parent.lastChild?.eq(node);
            const endsWithNewline = node.nodeSize === 4;

            if (isAtEnd && endsWithNewline) {
              tr.delete(start - 1, end).insert(
                start - 1 + 2,
                blockTileType.create(null, paragraphType.create(null)),
              );
            }
          } else if (node.nodeSize === 4) {
            if (node.firstChild.isTextblock) {
              tr.replaceRangeWith(start, end, paragraphType.create(null));
            }
          }

          if (!tr.steps.length && node.firstChild.type.name === "paragraph") {
            const nodeAfter = selection.$anchor.nodeAfter;

            if (nodeAfter && nodeAfter.nodeSize) {
              const pos = end - nodeAfter.nodeSize - 1;
              tr.delete(pos, end).insert(
                pos + 1,
                blockTileType.create(null, paragraphType.create(null, nodeAfter)),
              );
            } else {
              tr.insert(end, blockTileType.create(null, paragraphType.create(null)));
            }
          }

          if (tr.steps.length) {
            tr.scrollIntoView();
            selectionToInsertionEnd(tr, tr.steps.length - 1, -1);
            return dispatch?.(tr);
          }

          return false;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => {
        return this.editor.commands.first(({ commands }) => [() => commands.enterInBlockTile()]);
      },
    };
  },

  addProseMirrorPlugins() {
    return [];
  },
});
