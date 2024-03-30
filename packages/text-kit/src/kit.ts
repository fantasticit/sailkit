import { Extension } from "@sailkit/core";

import { Blockquote, type BlockquoteOptions } from "./blockquote";
import { Bold, type BoldOptions } from "./bold";
import { Code, type CodeOptions } from "./code";
import { HardBreak, type HardBreakOptions } from "./hard-break";
import { Italic, type ItalicOptions } from "./italic";
import { Paragraph, type ParagraphOptions } from "./paragraph";
import { Strike, type StrikeOptions } from "./strike";
import { Text } from "./text";

export interface TextKitOptions {
  blockquote: Partial<BlockquoteOptions> | false;
  bold: Partial<BoldOptions> | false;
  code: Partial<CodeOptions> | false;
  hardBreak: Partial<HardBreakOptions> | false;
  italic: Partial<ItalicOptions> | false;
  paragraph: Partial<ParagraphOptions> | false;
  strike: Partial<StrikeOptions> | false;
  text: false;
}

export const TextKit = Extension.create<TextKitOptions>({
  name: "textKit",

  addExtensions() {
    const extensions = [];

    if (this.options.blockquote !== false) {
      extensions.push(Blockquote.configure(this.options?.blockquote));
    }

    if (this.options.bold !== false) {
      extensions.push(Bold.configure(this.options?.bold));
    }

    if (this.options.code !== false) {
      extensions.push(Code.configure(this.options?.code));
    }

    if (this.options.hardBreak !== false) {
      extensions.push(HardBreak.configure(this.options?.hardBreak));
    }

    if (this.options.italic !== false) {
      extensions.push(Italic.configure(this.options?.italic));
    }

    if (this.options.paragraph !== false) {
      extensions.push(Paragraph.configure(this.options?.paragraph));
    }

    if (this.options.strike !== false) {
      extensions.push(Strike.configure(this.options?.strike));
    }

    if (this.options.text !== false) {
      extensions.push(Text.configure(this.options?.text));
    }

    return extensions;
  },
});
