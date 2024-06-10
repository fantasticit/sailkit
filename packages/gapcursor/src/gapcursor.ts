import { callOrReturn, Extension, gapCursor, getExtensionField, ParentConfig } from "@sailkit/core";

declare module "@sailkit/core" {
  interface NodeConfig<Options, Storage> {
    /**
     * Allow gap cursor
     */
    allowGapCursor?:
      | boolean
      | null
      | ((this: {
          name: string;
          options: Options;
          storage: Storage;
          parent: ParentConfig<NodeConfig<Options>>["allowGapCursor"];
        }) => boolean | null);
  }
}

export const Gapcursor = Extension.create({
  name: "gapCursor",

  addProseMirrorPlugins() {
    return [gapCursor()];
  },

  extendNodeSchema(extension) {
    const context = {
      name: extension.name,
      options: extension.options,
      storage: extension.storage,
    };

    return {
      allowGapCursor: callOrReturn(getExtensionField(extension, "allowGapCursor", context)) ?? null,
    };
  },
});
