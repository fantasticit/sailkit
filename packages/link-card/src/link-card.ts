import { mergeAttributes, Node, NodeViewRendererProps } from "@sailkit/core";

import { LinkCardView } from "./link-card-view";

export interface LinkCardOptions {
  HTMLAttributes: Record<string, unknown>;
  getLinkMetaData: (url: string) => Promise<{
    title: string;
    name: string;
    icon: string;
    description: string;
  }>;
}

export const LinkCard = Node.create<LinkCardOptions>({
  name: "linkCard",

  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: "linkCard",
      },
      getLinkMetaData: () => {
        return Promise.resolve({
          title: "Mock标题",
          name: "Mock标题",
          description: "请配置链接解析服务",
          icon: "M",
        });
      },
    };
  },

  addAttributes() {
    return {
      text: {
        default: "",
      },
      href: {
        default: null,
      },
      target: {
        default: this.options.HTMLAttributes.target,
      },
      rel: {
        default: this.options.HTMLAttributes.rel,
      },
      class: {
        default: this.options.HTMLAttributes.class,
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[class=linkCard]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["p", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addNodeView() {
    return (props: NodeViewRendererProps) => new LinkCardView(props, this.options);
  },
});
