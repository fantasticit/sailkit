import { Link } from "@sailkit/link";
import { LinkCard } from "@sailkit/link-card";

import { showLinkViewSwitchOnLinkSet } from "./utilities/showLinkViewSwitchOnLinkSet";

export const LinkExtensions = [
  Link.configure({
    onLinkSet: showLinkViewSwitchOnLinkSet,
  }),
  LinkCard.configure({
    getLinkMetaData() {
      return Promise.resolve({
        title: "Mock标题",
        name: "Mock标题",
        description: "请配置链接解析服务",
        icon: "M",
      });
    },
  }),
];
