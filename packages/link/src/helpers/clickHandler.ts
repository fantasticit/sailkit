import { getAttributes, PMMarkType, PMPlugin, PMPluginKey } from "@sailkit/core";

type ClickHandlerOptions = {
  type: PMMarkType;
};

export function clickHandler(options: ClickHandlerOptions): PMPlugin {
  return new PMPlugin({
    key: new PMPluginKey("handleClickLink"),
    props: {
      handleClick: (view, pos, event) => {
        if (event.button !== 0) {
          return false;
        }

        let a = event.target as HTMLElement;
        const els = [];

        while (a.nodeName !== "DIV") {
          els.push(a);
          a = a.parentNode as HTMLElement;
        }

        if (!els.find((value) => value.nodeName === "A")) {
          return false;
        }

        const attrs = getAttributes(view.state, options.type.name);
        const link = event.target as HTMLLinkElement;

        const href = link?.href ?? attrs.href;
        const target = link?.target ?? attrs.target;

        if (link && href) {
          window.open(href, target);

          return true;
        }

        return false;
      },
    },
  });
}
