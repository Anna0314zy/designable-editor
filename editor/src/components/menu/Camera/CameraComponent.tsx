import React from "react";
import { Tooltip } from "antd";
import { CameraType } from "@ld/slide-editor";
export const CameraComponent = ({
	nodeId,
	type,
	max,
	disabled
}: {
	nodeId: string;
	type: CameraType;
	max: number;
	disabled:boolean
}) => {
	return (
		<Tooltip
			title={`当前页面最多放${max}个`}
			placement="right"
			color={"#fff"}
			styles={{ body: { color: "#000" } }}
		>
			<div
				className="camera-content"
				data-designer-source-id={nodeId}
				data-disabled={disabled}
				data-type={type}
			>
				{type === CameraType.teacher ? "老师视频流" : "学生视频流"}
			</div>
		</Tooltip>
	);
};
