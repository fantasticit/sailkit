import { Document } from "@sailkit/document";
import { Link } from "@sailkit/link";
import { TextKit } from "@sailkit/text-kit";
import { LinkCard } from "@sailkit/link-card";

import { onLinkSet } from "./menus/link";

export const FullExtensions = [
  Document,
  TextKit,
  Link.configure({
    onLinkSet,
  }),
  LinkCard,
];
