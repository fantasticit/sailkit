import React, { useCallback, useEffect, useRef, useState } from "react";

import { Row, Col, Button, Input } from "@douyinfe/semi-ui";

export const LinkURLEditor: React.FC<{
  text: string;
  href: string;
  onOk: (arg: { text: string; href: string }) => void;
  onCancel: () => void;
}> = ({ text: defaultText, href: defaultHref, onOk, onCancel }) => {
  const linkInputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(defaultText);
  const [href, setHref] = useState(defaultHref);

  const ok = useCallback(() => {
    onOk &&
      onOk({
        text: text || href,
        href,
      });
  }, [onOk, text, href]);

  useEffect(() => {
    const timer = setTimeout(() => {
      linkInputRef.current?.focus();
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div style={{ width: 280 }}>
      <Row>
        <Col span={4} style={{ paddingTop: "4px" }}>
          文本
        </Col>
        <Col span={20}>
          <Input value={text} onChange={(value) => setText(value)} />
        </Col>
      </Row>
      <Row style={{ marginTop: 8 }}>
        <Col span={4} style={{ paddingTop: "4px" }}>
          链接
        </Col>
        <Col span={20}>
          <Input ref={linkInputRef} value={href} onChange={(value) => setHref(value)} />
        </Col>
      </Row>
      <Row style={{ marginTop: 8 }}>
        <Button onClick={ok} disabled={!href} type="primary">
          保存
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={onCancel}>
          取消
        </Button>
      </Row>
    </div>
  );
};
