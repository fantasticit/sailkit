import React, { useCallback } from "react";

import { Button, Tooltip } from "@douyinfe/semi-ui";
import { Editor, useActive } from "@sailkit/react";
import { Link as LinkExtension } from "@sailkit/link";
import { showLinkURLEditor } from "../utilities/showLinkURLEditor";

export const LinkStaticMenu: React.FC<{ editor: Editor }> = ({ editor }) => {
  const isLinkActive = useActive(editor, LinkExtension.name);

  const toggleLink = useCallback(() => {
    showLinkURLEditor(editor);
  }, [editor]);

  return (
    <Tooltip content={"插入链接"} editor={editor}>
      <Button onClick={toggleLink} theme={!isLinkActive ? "borderless" : "solid"}>
        链接
      </Button>
    </Tooltip>
  );
};
