import { Document } from "@sailkit/document";
import { TextKit } from "@sailkit/text-kit";

import { LinkExtensions } from "./extensions/link";

export const FullExtensions = [Document, TextKit, ...LinkExtensions];
