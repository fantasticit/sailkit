import { Document } from "@sailkit/document";
import { TextKit } from "@sailkit/text-kit";
import { BlockTile } from "@sailkit/blocktile";
import { Uuid } from "@sailkit/uuid";
import { Heading } from "@sailkit/heading";
import { HorizontalRule } from "@sailkit/horizontal-rule";
import { Dropcursor } from "@sailkit/dropcursor";
import { Gapcursor } from "@sailkit/gapcursor";

import { LinkExtensions } from "./extensions/link";

export const FullExtensions = [
  Document.extend({ content: "blockTile+" }),
  Uuid,
  BlockTile,
  TextKit,
  Heading,
  HorizontalRule,
  Dropcursor,
  Gapcursor,
  ...LinkExtensions,
];
