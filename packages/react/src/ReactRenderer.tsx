import React from "react";

import { Editor } from "@sailkit/core";

import { Editor as ExtendedEditor } from "./Editor";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isClassComponent(Component: any) {
  return !!(
    typeof Component === "function" &&
    Component.prototype &&
    Component.prototype.isReactComponent
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isForwardRefComponent(Component: any) {
  return !!(
    typeof Component === "object" && Component.$$typeof?.toString() === "Symbol(react.forward_ref)"
  );
}

export interface ReactRendererOptions {
  editor: Editor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props?: Record<string, any>;
  as?: string;
  className?: string;
  attrs?: Record<string, string>;
}

type ComponentType<R, P> =
  | React.ComponentClass<P>
  | React.FunctionComponent<P>
  | React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<R>>;

export class ReactRenderer<R = unknown, P = unknown> {
  id: string;

  editor: ExtendedEditor;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: any;

  element: Element;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>;

  reactElement: React.ReactNode;

  ref: R | null = null;

  constructor(
    component: ComponentType<R, P>,
    { editor, props = {}, as = "div", className = "", attrs }: ReactRendererOptions,
  ) {
    this.id = Math.floor(Math.random() * 0xffffffff).toString();
    this.component = component;
    this.editor = editor as ExtendedEditor;
    this.props = props;
    this.element = document.createElement(as);
    this.element.classList.add("react-renderer");

    if (className) {
      this.element.classList.add(...className.split(" "));
    }

    if (attrs) {
      Object.keys(attrs).forEach((key) => {
        this.element.setAttribute(key, attrs[key]);
      });
    }

    this.render();
  }

  render(): void {
    const Component = this.component;
    const props = this.props;

    if (isClassComponent(Component) || isForwardRefComponent(Component)) {
      props.ref = (ref: R) => {
        this.ref = ref;
      };
    }

    this.reactElement = <Component {...props} />;

    this.editor?.contentComponent?.setRenderer(this.id, this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateProps(props: Record<string, any> = {}): void {
    this.props = {
      ...this.props,
      ...props,
    };

    this.render();
  }

  destroy(): void {
    this.editor?.contentComponent?.removeRenderer(this.id);
  }
}
