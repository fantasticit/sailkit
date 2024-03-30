import {
  AnyExtension,
  Attrs,
  DecorationWithType,
  Editor,
  isAndroid,
  isiOS,
  NodeSelection,
  NodeViewRendererProps,
  PMNode,
  PMNodeView,
} from "@sailkit/core";

import { LinkCardOptions } from "./link-card";

import styles from "./style.module.scss";

export class LinkCardView implements PMNodeView {
  editor: Editor;
  extension: AnyExtension;
  node: PMNode;
  decorations: DecorationWithType[];
  getPos: () => number;
  dom!: HTMLElement;
  isDragging = false;
  linkCardOptions: LinkCardOptions;

  constructor(props: NodeViewRendererProps, options: LinkCardOptions) {
    this.editor = props.editor;
    this.extension = props.extension;
    this.node = props.node;
    this.decorations = props.decorations as DecorationWithType[];
    this.getPos = props.getPos as () => number;
    this.linkCardOptions = options;
    this.mount();
  }

  mount() {
    this.dom = document.createElement("div");
    this.dom.classList.add("linkCard", styles.linkCard);

    const left = document.createElement("div");
    left.classList.add("left", styles.left);
    this.dom.appendChild(left);

    const right = document.createElement("div");
    right.classList.add("right", styles.right);

    const title = document.createElement("div");
    title.classList.add("title", styles.title);
    right.appendChild(title);

    const description = document.createElement("div");
    description.classList.add("description", styles.description);
    right.appendChild(description);

    this.dom.appendChild(right);

    this.parseLink();
    return;
  }

  parseLink() {
    this.linkCardOptions.getLinkMetaData(this.node.attrs.href).then((data) => {
      const { title, description, icon } = data;
      this.dom.querySelector(".left")!.innerHTML = `<img src="${icon}" />`;
      this.dom.querySelector(".title")!.innerHTML = title;
      this.dom.querySelector(".description")!.innerHTML = description;
    });
  }

  get contentDOM(): HTMLElement | null {
    return null;
  }

  onDragStart(event: DragEvent) {
    const { view } = this.editor;
    const target = event.target as HTMLElement;

    // get the drag handle element
    // `closest` is not available for text nodes so we may have to use its parent
    const dragHandle =
      target.nodeType === 3
        ? target.parentElement?.closest("[data-drag-handle]")
        : target.closest("[data-drag-handle]");

    if (!this.dom || this.contentDOM?.contains(target) || !dragHandle) {
      return;
    }

    let x = 0;
    let y = 0;

    // calculate offset for drag element if we use a different drag handle element
    if (this.dom !== dragHandle) {
      const domBox = this.dom.getBoundingClientRect();
      const handleBox = dragHandle.getBoundingClientRect();

      // In React, we have to go through nativeEvent to reach offsetX/offsetY.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const offsetX = event.offsetX ?? (event as any).nativeEvent?.offsetX;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const offsetY = event.offsetY ?? (event as any).nativeEvent?.offsetY;

      x = handleBox.x - domBox.x + offsetX;
      y = handleBox.y - domBox.y + offsetY;
    }

    event.dataTransfer?.setDragImage(this.dom, x, y);

    const selection = NodeSelection.create(view.state.doc, this.getPos());
    const transaction = view.state.tr.setSelection(selection);

    view.dispatch(transaction);
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

    if (isDraggable && isEditable && !isDragging && isClickEvent) {
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
      (isiOS() || isAndroid()) &&
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

    if (this.contentDOM === mutation.target && mutation.type === "attributes") {
      return true;
    }

    if (this.contentDOM.contains(mutation.target)) {
      return false;
    }

    return true;
  }

  updateAttributes(attributes: Attrs) {
    this.editor.commands.command(({ tr }) => {
      const pos = this.getPos();

      tr.setNodeMarkup(pos, undefined, {
        ...this.node.attrs,
        ...attributes,
      });

      return true;
    });
  }

  deleteNode(): void {
    const from = this.getPos();
    const to = from + this.node.nodeSize;

    this.editor.commands.deleteRange({ from, to });
  }
}
