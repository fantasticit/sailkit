import {
  getNodeType,
  mergeAttributes,
  Node,
  NodeSelection,
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
      // TODO: handleBackspace
      // TODO: handleDelete
      enterInBlockTile:
        () =>
        ({ state, dispatch, tr }) => {
          const { selection, doc } = state;
          const { $to } = selection;
          const maybeBlockTile = getBlockTileAtPos(doc, selection.$anchor.pos);

          if (!maybeBlockTile) return false;

          const { node, end } = maybeBlockTile;

          if (!node.firstChild) return false;

          const blockTileType = getNodeType(this.name, state.schema);
          const paragraphType = getNodeType("paragraph", state.schema);

          // newlineInCode
          if (node.firstChild.type.spec.code) {
            const isAtEnd = $to.parentOffset === $to.parent.nodeSize - 2;
            const endsWithDoubleNewline = node.firstChild.textContent.endsWith("\n\n");

            if (!isAtEnd || !endsWithDoubleNewline) {
              tr.insertText("\n");
            } else {
              tr.delete($to.pos - 2, $to.pos).insert(
                $to.pos - 2 + 1,
                blockTileType.create(null, paragraphType.create(null)),
              );
            }
          }

          // TODO: liftEmptyBlockTile

          // splitBlockTile
          if (!tr.steps.length) {
            if (selection instanceof NodeSelection && selection.node.isBlock) {
              tr.insert(
                tr.mapping.map(end + 1),
                blockTileType.create(null, paragraphType.create(null)),
              );
            } else {
              const nodeAfter = $to.nodeAfter;

              if (nodeAfter) {
                const pos = end - nodeAfter.nodeSize - 1;
                tr.deleteSelection()
                  .delete(tr.mapping.map(pos), tr.mapping.map(end))
                  .insert(
                    tr.mapping.map(pos + 1),
                    blockTileType.create(null, paragraphType.create(null, nodeAfter)),
                  );
              } else {
                tr.deleteSelection().insert(
                  tr.mapping.map(end + 1),
                  blockTileType.create(null, paragraphType.create(null)),
                );
              }
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
