import { Editor, NodeSelection } from "@sailkit/core";

import { BlockTile } from "../blocktile";
import { BlockTileView } from "../blocktile-view";
import { buildSingleEditorService, throttle } from "../utilities";
import { getDraggingDOMCloneService } from "./dragging";

import styles from "../style.module.scss";

type BlockTileViewInfoFromEvent = { uuid: string; nodeView: BlockTileView };

export class BlockTileEventService {
  public editor: Editor;
  private map: Record<string, BlockTileView> = {};
  private _registry: string[] | null = null;
  private prevGetRegistryTime: number = 0;

  constructor(editor: Editor) {
    this.editor = editor;
    this.mount();
    this.editor.on("destroy", this.destroy.bind(this));
  }

  get registry(): string[] {
    if (this._registry) {
      if (Date.now() - this.prevGetRegistryTime <= 50) {
        return this._registry;
      }
    }

    const blockTiles = Array.from(
      window.document.querySelectorAll(`.${styles.blockTile}`),
    ) as HTMLElement[];

    const keys: string[] = [];

    for (const dom of blockTiles) {
      if (!this.map[dom.dataset.uuid!]) continue;

      const nodeView = this.map[dom.dataset.uuid!];

      if (!nodeView) continue;

      keys.push(nodeView!.uuid);
    }

    this._registry = keys;
    this.prevGetRegistryTime = Date.now();

    return keys;
  }

  addBlockTileView = (nodeView: BlockTileView) => {
    this.map[nodeView.uuid] = nodeView;
  };

  forEachNode = (
    hitCallback: (nodeView: BlockTileView) => void,
    unhitCallback: (nodeView: BlockTileView) => void,
    hitChecker: (uuid: string) => boolean,
  ) => {
    const keys = this.registry;

    for (const key of keys) {
      if (hitChecker(key)) {
        hitCallback(this.map[key] as BlockTileView);
      } else {
        unhitCallback(this.map[key] as BlockTileView);
      }
    }
  };

  wrapByDOMLoop = (callback: () => void) => {
    callback();
  };

  onSelectionUpdate = throttle(
    () => {
      this.onSelectionUpdate.cancel();

      const editor = this.editor;

      if (editor.state.selection instanceof NodeSelection) return;
      if (getDraggingDOMCloneService(editor).isRunning) return;

      this.mousemove.cancel();

      const nodes: Set<string> = new Set();
      const $head = editor.view.state.selection.$head;

      for (let d = $head.depth; d > 0; d--) {
        const node = $head.node(d);
        if (node.type.name === BlockTile.name) {
          nodes.add(node.attrs.uuid);
        }
      }

      this.wrapByDOMLoop(() => {
        this.forEachNode(
          (BlockTileView) => {
            BlockTileView.deselectNode();
            BlockTileView.hideHandlerDOM();
          },
          (BlockTileView) => {
            BlockTileView.showHandlerDOM();
          },
          (uuid) => !nodes.has(uuid),
        );
        nodes.clear();
      });
    },
    200,
    { trailing: false, leading: true },
  );

  getBlockTileViewFromDOM = (
    blockTilesDOM: HTMLElement[],
  ): Record<string, BlockTileViewInfoFromEvent> => {
    const map: Record<string, BlockTileViewInfoFromEvent> = {};

    for (const dom of blockTilesDOM) {
      const uuid = dom.dataset.uuid;
      if (!uuid) continue;

      const nodeView = this.map[uuid];

      if (!nodeView) continue;

      const info = {
        uuid,
        nodeView,
      };

      map[info.uuid] = info;
    }

    return map;
  };

  parseEvent = (event: MouseEvent) => {
    const blockTilesDOM = (event.composedPath() as HTMLElement[]).filter((el) =>
      el?.classList?.contains(`${styles.blockTile}`),
    );
    return this.getBlockTileViewFromDOM(blockTilesDOM);
  };

  mousemove = throttle((event: MouseEvent) => {
    this.mousemove.cancel();

    if (getDraggingDOMCloneService(this.editor).isRunning) {
      return;
    }

    this.onSelectionUpdate.cancel();
    const BlockTileViewInfosFromEvent = this.parseEvent(event);

    this.wrapByDOMLoop(() => {
      this.forEachNode(
        (BlockTileView) => {
          BlockTileView.deselectNode();
          BlockTileView.hideHandlerDOM();
        },
        (BlockTileView) => {
          BlockTileView.showHandlerDOM();
        },
        (uuid) => !BlockTileViewInfosFromEvent[uuid],
      );
    });
  }, 200);

  mousedown = (event: MouseEvent) => {
    if (getDraggingDOMCloneService(this.editor).isRunning) {
      return;
    }

    const BlockTileViewInfosFromEvent = this.parseEvent(event);

    this.wrapByDOMLoop(() => {
      this.forEachNode(
        (BlockTileView) => {
          BlockTileView.deselectNode();
          BlockTileView.hideHandlerDOM();
        },
        (BlockTileView) => {
          BlockTileView.showHandlerDOM();
        },
        (uuid) => !BlockTileViewInfosFromEvent[uuid],
      );
    });
  };

  click = (event: MouseEvent) => {
    if (getDraggingDOMCloneService(this.editor).isRunning) {
      return;
    }

    const BlockTileViewInfosFromEvent = this.parseEvent(event);

    this.wrapByDOMLoop(() => {
      this.forEachNode(
        (BlockTileView) => {
          BlockTileView.deselectNode();
          BlockTileView.hideHandlerDOM();
        },
        (BlockTileView) => {
          BlockTileView.showHandlerDOM();
        },
        (uuid) => !BlockTileViewInfosFromEvent[uuid],
      );
    });
  };

  mount = () => {
    if (!this.editor.isEditable) return;

    this.editor.on("selectionUpdate", this.onSelectionUpdate);

    const dom = this.editor.view.dom;
    dom.addEventListener("mousemove", this.mousemove, true);
    dom.addEventListener("mousedown", this.mousedown, true);
    dom.addEventListener("click", this.click, true);
  };

  destroy = () => {
    if (!this.editor.isEditable) return;
    this.editor.off("destroy", this.destroy);
    this.editor.off("selectionUpdate", this.onSelectionUpdate);
    const dom = this.editor.view.dom;
    dom.removeEventListener("mousemove", this.mousemove);
    dom.removeEventListener("mousedown", this.mousedown);
    dom.removeEventListener("click", this.click);
  };
}

export const getBlockTileEventService =
  buildSingleEditorService<BlockTileEventService>(BlockTileEventService);
