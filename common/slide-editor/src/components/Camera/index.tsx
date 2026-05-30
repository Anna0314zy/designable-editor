import React, { useEffect, useReducer } from "react";
import { IComponentProps, CameraType } from "./types";
export const CameraComponent = (props: IComponentProps) => {
  const {
    useConnect,
    id,
    style,
    treeNodeProps,
    setDefaultName,
    type,
  } = props;
  const { registerInstance, instanceMap, uninstallInstance } = useConnect(
    []
  ) as any;
  const forceUpdate = useReducer((preState) => preState + 1, 0)[0];
  useEffect(() => {
    registerInstance(id, {
      forceUpdate,
      remove: () => {
        uninstallInstance(id);
      },
      ...props,
    });
    setDefaultName?.(instanceMap, props["x-component"]);
  }, [forceUpdate, registerInstance, id, uninstallInstance]);

  // 渲染
  const otherStyle = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "break-spaces",
    flexWrap: "wrap",
    wordWrap: "break-word",
  };
  return (
    <>
      <div
        className={"camera-component"}
        {...treeNodeProps}
        preview-id={id}
        style={{ ...otherStyle, ...style, position: "absolute" }}
      >
        {type === CameraType.teacher ? "老师视频流" : "学生视频流"}
      </div>
    </>
  );
};
