import { useEffect, useRef, useState } from "react";

import { Editor } from "./Editor";
import { isDeepEqual } from "./isEqual";

type MapFn<T, R> = (arg: T) => R;

function mapSelf<T>(d: T): T {
  return d;
}

export function useAttrs<T extends Record<string, unknown>, R = T>(
  editor: Editor,
  nameOrType: string,
  defaultValue?: T,
  map?: (arg: T) => R,
) {
  const mapFn = (map || mapSelf) as MapFn<T, R>;
  const [value, setValue] = useState<R>(mapFn(defaultValue as T));
  const prevValueCache = useRef<R>(value);

  useEffect(() => {
    const listener = () => {
      const attrs = {
        ...defaultValue,
        ...editor.getAttributes(nameOrType),
      } as Record<string, unknown>;
      Object.keys(attrs).forEach((key) => {
        if (defaultValue && (attrs[key] === null || attrs[key] === undefined)) {
          attrs[key] = defaultValue[key];
        }
      });
      const nextAttrs = mapFn(attrs as T);
      if (isDeepEqual(prevValueCache.current, nextAttrs)) {
        return;
      }
      setValue(nextAttrs);
      prevValueCache.current = nextAttrs;
    };

    editor.on("selectionUpdate", listener);
    editor.on("transaction", listener);

    return () => {
      editor.off("selectionUpdate", listener);
      editor.off("transaction", listener);
    };
  }, [editor, defaultValue, nameOrType, mapFn]);

  return value;
}
