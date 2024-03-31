import React, { useCallback, useEffect, useRef } from "react";

import { Dropdown } from "@douyinfe/semi-ui";

export enum LinkView {
  Link = "link",
  Card = "linkCard",
}

export interface LinkViewSwitchProps {
  onOk: (arg: { type: LinkView }) => void;
}

export const LinkViewSwitch: React.FC<LinkViewSwitchProps> = ({ onOk }) => {
  const linkInputRef = useRef<HTMLInputElement>(null);

  const setType = useCallback(
    (type: LinkView) => {
      onOk &&
        onOk({
          type,
        });
    },
    [onOk],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      linkInputRef.current?.focus();
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div style={{ width: 200 }}>
      <Dropdown.Menu>
        <Dropdown.Title>显示为</Dropdown.Title>
        <Dropdown.Item onClick={() => setType(LinkView.Link)}>链接视图</Dropdown.Item>
        <Dropdown.Item onClick={() => setType(LinkView.Card)}>卡片视图</Dropdown.Item>
      </Dropdown.Menu>
    </div>
  );
};
