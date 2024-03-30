import React from "react";

import { useReactNodeView } from "./useReactNodeView";

export interface NodeViewWrapperProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  as?: React.ElementType;
}

export const NodeViewWrapper: React.FC<NodeViewWrapperProps> = React.forwardRef((props, ref) => {
  const { onDragStart } = useReactNodeView();
  // eslint-disable-next-line react/prop-types
  const Tag = props.as || "div";

  return (
    <Tag
      {...props}
      ref={ref}
      data-node-view-wrapper=""
      onDragStart={onDragStart}
      style={{
        whiteSpace: "normal",
        // eslint-disable-next-line react/prop-types
        ...props.style,
      }}
    />
  );
});

NodeViewWrapper.displayName = "NodeViewWrapper";
