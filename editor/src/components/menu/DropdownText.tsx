import React from "react";
import { IconWidget, usePrefix } from "@editor/react";
import { DownOutlined } from "@ant-design/icons";
import { Space } from "antd";
interface IProps {
  icon: string;
  title: string;
}
const DropdownText = (props: IProps) => {
  const { icon, title } = props;
  const prefix = usePrefix("toolbar-panel");
  return (
    <Space size={0}>
      {icon && (
        <IconWidget
          className={prefix + "-sub-menu-item-icon"}
          infer={icon}
          style={{ width: 16, height: 16 }}
        />
      )}
      <div className={prefix + "-sub-menu-item-title"}>{title}</div>
      <DownOutlined />
    </Space>
  );
};
export default DropdownText;
