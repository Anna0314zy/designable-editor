import React from "react";
import { MoveableManagerInterface, Renderer } from "react-moveable";
import { useTree, useWorkspace, IconWidget } from "@editor/react";
import { useInstanceStore } from "@play/render";
import { deleteTaskContent } from "../../utils/task";
// import { removeResourceRelation } from "../../api/upload";
// import { getUrlParameter } from "../../utils/common";
import { CopyOutlined } from "@ant-design/icons";
import {
	getCamera,
	TEACHER_MAX,
	STUDENT_MAX,
} from "../../components/menu/Camera/utils";
import { CameraType } from "@ld/slide-editor";
interface Props {
	lastWorkspaceId: React.MutableRefObject<string>;
	saveCurrentPage: () => Promise<void>;
}
const useAbles = ({ lastWorkspaceId, saveCurrentPage }: Props) => {
	// const slideId = getUrlParameter("id");
	const tree = useTree();
	const workspace = useWorkspace();
	const { instanceMap } = useInstanceStore();
	const selectedNodes = tree.operation.selection.selectedNodes;
	// const removeResourceMapByType = (fileMd5) => {
	// 	if(fileMd5){
	// 		removeResourceRelation({
	// 		slideId,
	// 		pageId: lastWorkspaceId.current,
	// 		fileMd5,
	// 	});
	// }
	// };
	const hiddenCopyBtn = () => {
		const teacherNode = selectedNodes.map(
			(item) => item.props.type === CameraType.teacher
		);
		const studentNode = selectedNodes.map(
			(item) => item.props.type === CameraType.student
		);
		return selectedNodes.some((node) => {
			// 当前页面老师视频流只能放一个 学生视频流最多放5个
			const { teacherCamera, studentCamera } = getCamera(workspace.serialize());

			if (node.props.type === CameraType.student) {
				return studentCamera + studentNode.length > STUDENT_MAX;
			}
			if (node.props.type === CameraType.teacher) {
				return teacherCamera + teacherNode.length > TEACHER_MAX;
			}

			return node.componentName !== "Camera";
		});
	};
	const removeSelectedNodes = async() => {
		let animateList = []
		if(workspace.operation.tree.props.animates)  animateList = [...workspace.operation.tree.props.animates]
		selectedNodes.forEach((node) => {
			node.remove();
			if (node.parent.componentName === 'Group' && !node.parent.children.length) { // 编组内的组件都删除了，把group组件也删除
				node.parent.remove();
			}
			instanceMap[node.id]?.remove();
			// if (
			// 	node.props["x-component"] === "Img" ||
			// 	node.props["x-component"] === "Video" ||
			// 	node.props["x-component"] === "Audio"
			// ) {
			// 	removeResourceMapByType(node.props.src);
			// }
			if (node.parent.componentName === 'Group') {
				animateList = animateList.filter(ani => ani.target !== node.parent.id && ani.triggerSource !== node.parent.id)
			} else {
				animateList = animateList.filter(ani => ani.target !== node.id && ani.triggerSource !== node.id)
			}
		});
		workspace.operation.selection.clear();
		workspace.operation.selection.batchSafeSelect([tree.id]);
		// 删除 video
		deleteTaskContent({
			data: selectedNodes[0],
			currentWorkspace: workspace,
		});
		// 删除组件时，删除相应动画
		workspace.operation.tree.setProps({
			animates: animateList
		})
		await saveCurrentPage()
	};
	// 复制当前节点
	const copyNode = () => {
		// 增加节点
		const selectedNodes = tree.operation.selection.selectedNodes;
		const closestNode = workspace.operation.tree;
		// TODO 复制元素 没办法焦点聚焦在新的元素上
		// const newTreeNode:TreeNode[] = [];
		Array.from(selectedNodes).forEach((node) => {
			const cloneNode = node.clone();
			const str = cloneNode.props.style.transform;
			const newStr = str.replace(/(\d+)(px)/g, (match, p1, p2) => {
				return `${Number(p1) + 10}${p2}`;
			});
			cloneNode.props.style = {
				...cloneNode.props.style,
				transform: newStr,
			};
			closestNode.append(cloneNode);
			// newTreeNode.push(cloneNode);
		});
		// 选中新添加的节点
		// const selection = workspace.operation.selection;
		// selection.safeSelect(newTreeNode[0]);
	};
	const Editable = {
		name: "editable",
		props: [],
		events: [],
		render(moveable: MoveableManagerInterface<any, any>, React: Renderer) {
			const rect = moveable.getRect();
			const { pos2 } = moveable.state;
			// Add key (required)
			// Add class prefix moveable-(required)
			const EditableViewer = moveable.useCSS(
				"div",
				`
              {
                  position: absolute;
                  left: 0px;
                  top: 0px;
                  will-change: transform;
                  transform-origin: 0px 0px;
              }
              .custom-button {
                  width: 24px;
                  height: 24px;
                  background: #4af;
                  border-radius: 4px;
                  appearance: none;
                  border: 0;
                  color: white;
                  font-weight: bold;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  justify-content: center;
              }
                  `
			);
			return (
				<EditableViewer
					key={"editable-viewer"}
					className={"moveable-editable"}
					style={{
						transform: `translate(${pos2[0]}px, ${pos2[1]}px) rotate(${rect.rotation}deg) translate(10px)`,
					}}
				>
					<button
						className="custom-button"
						onMouseDown={() => {
							removeSelectedNodes();
						}}
					>
						<IconWidget infer="Remove" />
					</button>
					{!hiddenCopyBtn() && (
						<button
							style={{ marginTop: "5px" }}
							className="custom-button"
							onMouseDown={() => {
								copyNode();
							}}
						>
							<CopyOutlined />
						</button>
					)}
				</EditableViewer>
			);
		},
	};
	return [[Editable]];
};
export default useAbles;
