import { dropCursor, Extension } from "@sailkit/core";

export interface DropcursorOptions {
  /**
    The color of the cursor. Defaults to `black`. Use `false` to apply no color and rely only on class.
    */
  color?: string | false;
  /**
    The precise width of the cursor in pixels. Defaults to 1.
    */
  width?: number;
  /**
    A CSS class name to add to the cursor element.
    */
  class?: string;
}

export const Dropcursor = Extension.create<DropcursorOptions>({
  name: "dropCursor",

  addOptions() {
    return {
      color: "currentColor",
      width: 1,
      class: "",
    };
  },

  addProseMirrorPlugins() {
    return [dropCursor(this.options)];
  },
});
