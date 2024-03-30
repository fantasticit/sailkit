import React from "react";

import { useReactNodeView } from "./useReactNodeView";

export interface NodeViewContentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  as?: React.ElementType;
}

export const NodeViewContent: React.FC<NodeViewContentProps> = (props) => {
  const Tag = props.as || "div";
  const { nodeViewContentRef } = useReactNodeView();

  return (
    <Tag
      {...props}
      ref={nodeViewContentRef}
      data-node-view-content=""
      style={{
        whiteSpace: "pre-wrap",
        // eslint-disable-next-line react/prop-types
        ...props.style,
      }}
    />
  );
};
