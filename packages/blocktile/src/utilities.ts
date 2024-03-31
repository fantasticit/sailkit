import { Editor, PMNode } from "@sailkit/core";

import { BlockTileName } from "./constants";

export type BlockTileInfo = {
  node: PMNode;
  parent: PMNode;
  start: number;
  end: number;
  depth: number;
};

export const getBlockTileAtPos = (doc: PMNode, pos: number): BlockTileInfo | undefined => {
  if (pos < 0 || pos > doc.content.size) {
    return undefined;
  }

  const $pos = doc.resolve(pos);
  const maxDepth = $pos.depth;
  let node = $pos.node(maxDepth);
  let depth = maxDepth;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (depth < 0) return undefined;

    if (node.type.name === BlockTileName) {
      break;
    }

    depth--;
    node = $pos.node(depth);
  }

  const start = $pos.start(depth);
  const end = $pos.end(depth);
  const parent = $pos.node(depth - 1);

  return {
    node,
    parent,
    start,
    end,
    depth,
  };
};

export const getBlockTilesInRage = (
  doc: PMNode,
  range: { from: number; to: number },
): Array<BlockTileInfo> => {
  const { from, to } = range;
  const ret: Array<BlockTileInfo> = [];

  let pos = to;

  while (pos >= from) {
    const node = getBlockTileAtPos(doc, pos);

    if (!node) break;

    ret.unshift(node);
    pos = node?.start - 2;
  }

  return ret;
};

export const createEmptyImage = (() => {
  let img: HTMLImageElement | undefined;

  return () => {
    if (!img) {
      img = new Image();
      img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
    }

    return img;
  };
})();

export function buildSingleEditorService<T>(Service: new (arg: Editor) => T) {
  const map: WeakMap<Editor, T> = new WeakMap();

  const getter = (editor: Editor) => {
    if (!map.has(editor)) {
      map.set(editor, new Service(editor));
    }

    return map.get(editor) as T;
  };

  return getter;
}

interface ThrottleFunction<T extends unknown[]> {
  (...args: T): void;
  cancel: () => void;
}

export const throttle = <T extends unknown[]>(
  fn: (...args: T) => unknown,
  wait: number,
  options: { leading: boolean; trailing: boolean } = { leading: false, trailing: false },
): ThrottleFunction<T> => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pre: number = 0;

  const wrapper = function (this: ThisType<typeof fn>, ...args: Parameters<typeof fn>) {
    const now = performance.now();

    if (now - pre > wait) {
      if (pre === 0 && !options.leading) {
        pre = now;
        return;
      }
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn.apply(this, args);
      pre = now;
    } else if (!timer && options.trailing) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, wait);
    }
  };

  wrapper.cancel = () => {
    timer && clearTimeout(timer);
    timer = null;
  };

  return wrapper;
};
