import { Node } from "@sailkit/core";

export const Document = Node.create({
  name: "doc",
  topNode: true,
  content: "block+",
});
