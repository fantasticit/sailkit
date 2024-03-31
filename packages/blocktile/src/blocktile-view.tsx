import {
  Attrs,
  isiOS,
  NodeSelection,
  NodeViewRendererProps,
  PMEditorView,
  serializeForClipboard,
} from "@sailkit/core";

import { getDataTransfer } from "./services/data-transfer";
import { getDraggingDOMCloneService } from "./services/dragging";
import { getBlockTileEventService } from "./services/event";
import { createEmptyImage } from "./utilities";

import styles from "./style.module.scss";

export class BlockTileView {
  dom: HTMLDivElement;
  handlerDOM: HTMLElement | undefined;
  contentDOM: HTMLDivElement;
  view: PMEditorView;
  editor: NodeViewRendererProps["editor"];
  node: NodeViewRendererProps["node"];
  getPos: () => number;
  isDragging = false;
  detectDrop = false;
  prevCommentLength = 0;

  onDragLeaveCallback() {}
  isDestroyed = false;

  get depth() {
    const pos = this.getPos();
    if (pos == null) return 2;
    return this.editor.state.doc.resolve(pos).depth;
  }

  get isEditable() {
    return this.editor.isEditable;
  }

  get uuid() {
    return this.node.attrs.uuid;
  }

  get blockTile() {
    return {
      node: this.node,
      getPos: this.getPos.bind(this),
      pos: this.getPos(),
      dom: this.dom,
      updateAttributes: this.updateAttributes,
    };
  }

  constructor(props: NodeViewRendererProps) {
    const { node, editor, getPos } = props;
    this.editor = editor;
    this.node = node;
    this.view = editor.view;
    this.getPos = getPos as () => number;

    const dom = document.createElement("div");
    dom.classList.add(styles.blockTile);
    if (this.depth <= 2) {
      dom.addEventListener("dragleave", this.onDragLeave, true);
    }
    this.dom = dom;

    if (this.isEditable) {
      const handlerDOM = document.createElement("div");
      handlerDOM.setAttribute("contentEditable", "false");
      handlerDOM.classList.add(styles.handler);
      if (this.depth > 2) {
        handlerDOM.classList.add(styles.small);
      }
      handlerDOM.addEventListener("dragstart", this.onDragStart.bind(this));
      this.handlerDOM = handlerDOM;
      this.dom.appendChild(handlerDOM);
    }

    const contentDOM = document.createElement("div");
    contentDOM.classList.add(styles.content);
    this.contentDOM = contentDOM;
    this.dom.appendChild(contentDOM);

    const { uuid } = node.attrs;
    this.dom.dataset.uuid = uuid;
    getBlockTileEventService(this.editor).addBlockTileView(this);
  }

  update(node: NodeViewRendererProps["node"]) {
    if (node.type !== this.node.type) return false;
    this.node = node;
    const { uuid } = node.attrs;
    this.dom.dataset.uuid = uuid;
    getBlockTileEventService(this.editor).addBlockTileView(this);
    return true;
  }

  selectNode() {
    this.dom.classList.add(styles.selected, "selected");
  }

  deselectNode() {
    this.dom.classList.remove(styles.selected, "selected");
  }

  showHandlerDOM() {
    this?.handlerDOM?.classList.add(styles.visible);

    if (!this.handlerDOM?.firstElementChild) {
      const div = document.createElement("div");
      div.setAttribute("data-drag-handle", "true");
      this.handlerDOM?.appendChild(div);
    }
  }

  hideHandlerDOM() {
    this?.handlerDOM?.classList.remove(styles.visible);
  }

  setSelectedBlockTile() {
    const nodeSelection = NodeSelection.create(
      this.editor.view.state.doc,
      this.getPos() + 1 - (this.node.isLeaf ? 0 : 1),
    );
    this.editor.view.dispatch(this.editor.view.state.tr.setSelection(nodeSelection));
    this.editor.commands.blur();
    getDataTransfer(this.editor).setItem("selectedBlockTile", this.blockTile);
  }

  onDragStart = (event: DragEvent) => {
    if (!this.isEditable) {
      return;
    }

    const editor = this.editor;
    const { view } = this.editor;
    const target = event.target as HTMLElement;

    const dragHandle = target === this.handlerDOM || this.handlerDOM?.contains(target);

    if (!this.dom || !dragHandle) {
      return;
    }

    const selection = NodeSelection.create(view.state.doc, this.getPos());
    const transaction = view.state.tr.setSelection(selection);
    view.dispatch(transaction);

    this.isDragging = true;

    const slice = selection.content();
    const { dom, text } = serializeForClipboard(editor.view, slice);

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "copyMove";
      event.dataTransfer.setDragImage(createEmptyImage(), 0, 0);
      event.dataTransfer.clearData();
      event.dataTransfer.setData("text/html", dom.innerHTML);
      event.dataTransfer.setData("text/plain", text);
    }

    editor.view.dragging = {
      slice,
      move: true,
    };

    getDataTransfer(this.editor).setItem("draggingBlockTile", {
      ...this.blockTile,
      startPosition: { x: event.clientX, y: event.clientY },
    });

    getDraggingDOMCloneService(this.editor).mountDraggingDOM(this.dom);
    getDraggingDOMCloneService(editor)?.updateDraggingDOMViaEvent(event);

    this.editor.view.dom.addEventListener(
      "drop",
      () => {
        if (getDraggingDOMCloneService(editor).mounted) {
          getDraggingDOMCloneService(editor)?.unmountDraggingDOM();
        }
      },
      { once: true },
    );
  };

  onDragLeave() {
    if (!this.isEditable) {
      return;
    }

    this.onDragLeaveCallback && this.onDragLeaveCallback();
  }

  stopEvent(event: Event) {
    if (!this.dom) {
      return false;
    }

    const target = event.target as HTMLElement;
    const isInElement = this.dom.contains(target) && !this.contentDOM?.contains(target);

    if (!isInElement) {
      return false;
    }

    const isDragEvent = event.type.startsWith("drag");
    const isDropEvent = event.type === "drop";
    const isInput =
      ["INPUT", "BUTTON", "SELECT", "TEXTAREA"].includes(target.tagName) ||
      target.isContentEditable;

    if (isInput && !isDropEvent && !isDragEvent) {
      return true;
    }

    const { isEditable } = this.editor;
    const { isDragging } = this;
    const isDraggable = !!this.node.type.spec.draggable;
    const isSelectable = NodeSelection.isSelectable(this.node);
    const isCopyEvent = event.type === "copy";
    const isPasteEvent = event.type === "paste";
    const isCutEvent = event.type === "cut";
    const isClickEvent = event.type === "mousedown";

    if (!isDraggable && isSelectable && isDragEvent) {
      event.preventDefault();
    }

    if (isDraggable && isDragEvent && !isDragging) {
      event.preventDefault();
      return false;
    }

    if (isDraggable && isEditable && !isDragging) {
      const dragHandle = target.closest("[data-drag-handle]");
      const isValidDragHandle =
        dragHandle && (this.dom === dragHandle || this.dom.contains(dragHandle));

      if (isValidDragHandle) {
        this.isDragging = true;

        document.addEventListener(
          "dragend",
          () => {
            this.isDragging = false;
          },
          { once: true },
        );

        document.addEventListener(
          "drop",
          () => {
            this.isDragging = false;
          },
          { once: true },
        );

        document.addEventListener(
          "mouseup",
          () => {
            this.isDragging = false;
          },
          { once: true },
        );
      }
    }

    if (
      isDragging ||
      isDropEvent ||
      isCopyEvent ||
      isPasteEvent ||
      isCutEvent ||
      (isClickEvent && isSelectable)
    ) {
      return false;
    }

    return true;
  }

  ignoreMutation(mutation: MutationRecord | { type: "selection"; target: Element }) {
    if (mutation.target === this.dom && mutation.type === "attributes") {
      return true;
    }

    if (mutation.target === this?.handlerDOM || this.handlerDOM?.contains(mutation.target)) {
      return true;
    }

    if (!this.dom || !this.contentDOM) {
      return true;
    }

    if (this.node.isLeaf || this.node.isAtom) {
      return true;
    }

    if (mutation.type === "selection") {
      return false;
    }

    if (
      this.dom.contains(mutation.target) &&
      mutation.type === "childList" &&
      isiOS() &&
      this.editor.isFocused
    ) {
      const changedNodes = [
        ...Array.from(mutation.addedNodes),
        ...Array.from(mutation.removedNodes),
      ] as HTMLElement[];

      if (changedNodes.every((node) => node.isContentEditable)) {
        return false;
      }
    }

    if (this.dom === mutation.target) {
      return true;
    }

    if (this.contentDOM === mutation.target && mutation.type === "attributes") {
      return true;
    }

    if (this.contentDOM.contains(mutation.target)) {
      return false;
    }

    return true;
  }

  updateAttributes = (attributes: Attrs) => {
    if (this.isDestroyed) return;
    this.editor.commands.command(({ tr }) => {
      const pos = this.getPos();
      tr.setNodeMarkup(pos, undefined, {
        ...this.node.attrs,
        ...attributes,
      });
      return true;
    });
  };

  destroy() {
    this.isDestroyed = true;
    this?.handlerDOM?.removeEventListener?.("dragstart", this.onDragStart);
    this.dom.removeEventListener("dragleave", this.onDragLeave);
  }
}
