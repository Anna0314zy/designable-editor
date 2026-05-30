/*
 * @Date: 2024-01-12 16:20:46
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-02-27 14:19:19
 * @FilePath: /slides-engine/editor/src/components/Moveable/index.tsx
 */
import { MoveableContainer, useTree } from "@editor/react";
import React from "react";
import useAbles from "./ables";
import { observer } from '@slides/reactive-react'
interface MoveableProps {
	setSettingTitle: React.Dispatch<React.SetStateAction<string>>;
	lastWorkspaceId: React.MutableRefObject<string>;
	saveCurrentPage: () => Promise<void>;
}
const MoveableCom = ({ setSettingTitle, lastWorkspaceId, saveCurrentPage }: MoveableProps) => {
	const tree = useTree();
	const selectedNodes = tree.operation.selection.selectedNodes;
	const [ables] = useAbles({ lastWorkspaceId, saveCurrentPage });

	const getKeepRatio = () => {
		return (
			selectedNodes.filter((node) =>
				["Camera"].includes(node.componentName) || node.props.info?.keepRatio
			).length > 0
		);
	};
	const getOnlySelected = () => {
		return (
			selectedNodes.filter((node) =>
				["Video", "Game"].includes(node.componentName)
			).length > 0
		);
	};
	const getIncludeGroup = () => {
		// 编组的组件，或者包含编组的组件，不可旋转
		return (
			selectedNodes.filter((node) =>
				node.componentName === 'Group' || node.parent?.componentName === 'Group'
			).length > 0
		);
	}
	const getResizable = () => {
		// 如果是组合组件，含有编组，不能拖拽
		const hasGroup = selectedNodes.some(node => node.componentName === "Group")
		if (hasGroup) return false
		return (
			selectedNodes.filter(
				(node) => !["Video", "Audio",'Game'].includes(node.componentName)
			).length > 0
		);
	};
	const getRotatable = () => {
		let rotatable = getOnlySelected() ? false : true;
		if (rotatable) {
			rotatable =
				selectedNodes.filter(
					(node) => !["Camera"].includes(node.componentName)
				).length > 0;
		}
		return rotatable;
	};
	return (
		<MoveableContainer
			ables={ables}
			setSettingTitle={setSettingTitle}
			moveableProps={{
				draggable: getOnlySelected() ? false : true,
				resizable: getResizable(),
				keepRatio: getKeepRatio(),
				rotatable: getRotatable() && !getIncludeGroup(),
			}}
		/>
	);
};
export const Moveable = observer(MoveableCom);
