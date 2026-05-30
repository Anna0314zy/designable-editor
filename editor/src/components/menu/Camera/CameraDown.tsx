import React from "react";
import { Dropdown } from "antd";
import DropdownText from "../DropdownText";
import { CameraComponent } from "./CameraComponent";
import { CameraType } from "@ld/slide-editor";
import Style from "./styles.module.less";
import { useWorkbench } from "@editor/react";
import { getCamera,TEACHER_MAX,STUDENT_MAX } from "./utils";
import { observer } from '@slides/reactive-react'
export const CameraDown = observer(({
	prefix,
	nodeId,
}: {
	prefix: string;
	nodeId: string;
}) => {
	const workbench = useWorkbench();
	if(!workbench.activeWorkspace) return null;
	const activeData = workbench.activeWorkspace.serialize();
	const teacherCameraDisabled = getCamera(activeData).teacherCamera >= TEACHER_MAX;
	const studentCameraDisabled = getCamera(activeData).studentCamera >= STUDENT_MAX;
	const cameraMenus = [
		{
			key: "teacher",
			componentName: "Camera",
			disabled: teacherCameraDisabled,
			//   disabled: true,?
			label: (
				<CameraComponent
					nodeId={nodeId}
					type={CameraType.teacher}
					max={TEACHER_MAX}
					disabled={teacherCameraDisabled}
				/>
			),
		},
		{
			key: "student",
			componentName: "Camera",
			disabled: getCamera(activeData).studentCamera >= 5,
			label: (
				<CameraComponent
					nodeId={nodeId}
					type={CameraType.student}
					max={STUDENT_MAX}
					disabled={studentCameraDisabled}
				/>
			),
		},
	];
	return (
		<div className={prefix + "-sub-menu-item"}>
			<Dropdown
				menu={{
					items: cameraMenus,
				}}
				trigger={["click"]}
				overlayClassName={Style["camera-dropdown"]}
			>
				<a onClick={(e) => e.preventDefault()}>
					<DropdownText title={"视频流"} icon="" />
				</a>
			</Dropdown>
		</div>
	);
})
