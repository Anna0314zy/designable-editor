/*
 * @Date: 2024-02-04 17:32:14
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-02-28 10:59:29
 * @FilePath: /slides-engine/editor/src/hooks/useSaveGame.ts
 */
import { useCallback, useEffect } from "react";
import { TreeNode } from "@editor/core";
import { addNormalGameTasks } from "../utils/task";
import { useSavePage } from "./useSavePage";
import { message } from "antd";
export const useSaveGame = (engine, gameNode, afterAddFunc, edit) => {
	const [saveCurrentPage] = useSavePage();
	const handleReceiveMessage = useCallback(
		async (event) => {
			// 处理接收到的数据
			if (event.data.type === "courseware") {
				if(!gameNode?.id) return;
				const currentWorkspace = engine.workbench.activeWorkspace;
				const gameData = event.data;
				const {
					gameTemplateId,
					gameId,
					gameTemplateName,
					publicModel,
					cover,
					gameName,
					url,
					isPlay,
					isSync,
				} = gameData;
				const sourceId = gameNode.id;
				const sourceNodes = [engine.findNodeById(sourceId)];
				const closestNode = currentWorkspace.operation.tree;
				// 添加前  应该移除前一个游戏
				const children = closestNode?.children || [];
				let newTreeNode = null;
				if (children.length > 0) {
					newTreeNode = children[0];
				} else {
					newTreeNode = closestNode.append(
						...TreeNode.filterDroppable(sourceNodes, closestNode)
					)[0];
				}
				const x = 0;
				const y = 0;
				newTreeNode.props.style ||= {};
				newTreeNode.props.style.transform = `translate(${x}px, ${y}px)`;
				newTreeNode.props = Object.assign({}, newTreeNode.props, {
					gameTemplateId,
					gameId,
					gameTemplateName,
					publicModel,
					cover,
					gameName,
					gameUrl: url,
					isPlay,
					isSync,
				});

				const selection = currentWorkspace.operation.selection;
				selection.safeSelect(newTreeNode);
				//添加完游戏 立马生成任务
				// 新增游戏 新增任务 编辑 跟新增 如何区分
				if (!edit) {
					newTreeNode.props.gameType = "normalGame";
					newTreeNode.props.haveTestQuestions = "yes";
					await saveCurrentPage();
					message.success("游戏保存成功");
					message.config({
						maxCount: 1,
					});
					await addNormalGameTasks({ treeNode: newTreeNode, currentWorkspace });
				} else {
					await saveCurrentPage();
					message.success("游戏保存成功");
					message.config({
						maxCount: 1,
					});
				}

				afterAddFunc();
			}
		},
		[afterAddFunc, edit, engine, gameNode?.id, saveCurrentPage]
	);

	useEffect(() => {
		// 添加事件监听器
		window.addEventListener("message", handleReceiveMessage);

		// 在组件卸载时移除事件监听器
		return () => {
			window.removeEventListener("message", handleReceiveMessage);
		};
	}, [handleReceiveMessage]);
	return null;
};
