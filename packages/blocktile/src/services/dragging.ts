import { Editor } from "@sailkit/core";

import { buildSingleEditorService } from "../utilities";

const MIN_WIDTH = 50;
const DRAGGING_DOM_CLASSNAME = "dragging-clone-container";

export class DraggingDOMCloneService {
  private draggingDOMRootContainer: HTMLElement | undefined = undefined;
  private draggingDOMContainer: HTMLElement | undefined = undefined;
  private draggingDOM: HTMLElement | undefined = undefined;
  public mounted = false;
  private x = 0;
  private y = 0;
  private width = 0;
  private height = 0;

  private containerDOM: HTMLElement | undefined = undefined;
  private containerDOMRect: DOMRect | null = null;

  public editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
    this.editor.on("destroy", this.destroy.bind(this));
  }

  get isRunning() {
    return this.mounted;
  }

  getContainerDOMRect = () => {
    this.containerDOMRect = this.containerDOM!.getBoundingClientRect();
  };

  mount() {
    this.containerDOM = this.editor.options.element as HTMLElement;

    this.draggingDOMRootContainer = document.createElement("div");
    this.draggingDOMRootContainer.classList.add(DRAGGING_DOM_CLASSNAME);
    this.draggingDOMContainer = document.createElement("div");
    this.draggingDOMContainer.classList.add("ProseMirror");
    this.draggingDOMRootContainer.appendChild(this.draggingDOMContainer);
    this.containerDOM!.appendChild(this.draggingDOMRootContainer);
  }

  mountDraggingDOM = (el: HTMLElement) => {
    if (!el || this.mounted) return;

    this.mount();

    if (!this.draggingDOMContainer) return;

    this.draggingDOM = el.cloneNode(true) as HTMLElement;
    this.draggingDOM.classList.remove("ProseMirror-selectednode");

    this.draggingDOMRootContainer?.classList.add("active");

    const width = el.clientWidth;
    const height = el.clientHeight;
    const transform = el.style.transform;

    this.draggingDOMContainer.style.width = width + "px";
    this.draggingDOMContainer.style.height = height + "px";
    this.draggingDOMContainer.style.transform = transform.replace("none", "");

    this.draggingDOMContainer.appendChild(this.draggingDOM);

    const contentDOM = this.draggingDOM?.querySelector(".contentDOM");
    if (contentDOM) {
      contentDOM.classList.remove("ProseMirror-selectednode");
    }

    const content = contentDOM?.firstChild as HTMLElement;
    this.width = content ? Math.max(content.clientWidth + 2, MIN_WIDTH) : width;

    this.height = height;
    this.mounted = true;

    this.editor.on("selectionUpdate", this.unmountDraggingDOM);
    document.body.addEventListener("mouseleave", this.unmountDraggingDOM, {
      once: true,
    });
  };

  calcPositionViaEvent = (event: MouseEvent) => {
    this.getContainerDOMRect();

    const scaleX = 1;
    const scaleY = 1;

    const x = (event.clientX - this.containerDOMRect!.x) * scaleX;
    const y = (event.clientY - this.containerDOMRect!.y) * scaleY;

    this.x = x;
    this.y = y;
  };

  updateDraggingDOMViaEvent = (event: MouseEvent) => {
    if (this.draggingDOMRootContainer) {
      this.calcPositionViaEvent(event);
      this.draggingDOMRootContainer!.style.left = `${this.x}px`;
      this.draggingDOMRootContainer!.style.top = `${this.y}px`;
    }
  };

  addClassName = (cls: string) => {
    this.draggingDOMRootContainer?.classList.add(cls);
  };

  removeClassName = (cls: string) => {
    this.draggingDOMRootContainer?.classList.remove(cls);
  };

  unmountDraggingDOM = () => {
    this.editor.off("selectionUpdate", this.unmountDraggingDOM);
    this.draggingDOMRootContainer?.remove();
    this.draggingDOMRootContainer = undefined;
    this.mounted = false;
  };

  getPosition() {
    return {
      x: this.x - parseInt(this.containerDOM?.dataset.ml || "0"),
      y: this.y - parseInt(this.containerDOM?.dataset.mt || "0"),
      width: this.width,
      height: this.height,
    };
  }

  destroy() {
    this.editor.off("destroy", this.destroy);
    this.draggingDOMRootContainer?.remove();
  }
}

export const getDraggingDOMCloneService =
  buildSingleEditorService<DraggingDOMCloneService>(DraggingDOMCloneService);
