import { Editor, PMMarkType, PMPlugin, PMPluginKey } from "@sailkit/core";

import { find } from "linkifyjs";

type PasteHandlerOptions = {
  editor: Editor;
  type: PMMarkType;
};

export function pasteHandler(options: PasteHandlerOptions): PMPlugin {
  return new PMPlugin({
    key: new PMPluginKey("handlePasteLink"),
    props: {
      handlePaste: (view, event, slice) => {
        const { state } = view;
        const { selection } = state;
        const { empty } = selection;

        if (empty) {
          return false;
        }

        let textContent = "";

        slice.content.forEach((node) => {
          textContent += node.textContent;
        });

        const link = find(textContent).find((item) => item.isLink && item.value === textContent);

        if (!textContent || !link) {
          return false;
        }

        options.editor.commands.setMark(options.type, {
          href: link.href,
        });

        return true;
      },
    },
  });
}
