import React, { useCallback, useRef } from "react";
import { observer } from "@slides/react";
import { Tabs, Button } from "antd";
import { useSelectedNode } from "@editor/react";
import { useDesigner } from "@editor/react";
import { addGameTasks, IGameInfo } from "../../utils/task";
import { GameSetter } from "./GameSetter";
import GameModal from "../../components/GameModal";
import { useSavePage } from "../../hooks/useSavePage";
// import { savePage } from "../../api/page";
// starRainingGame - 星豆雨
// normalGame-单人游戏
// pkGame-PK游戏
// workGame-作品游戏
export const GameSetting: React.FC = observer(() => {
	const treeNode = useSelectedNode();
	const engine = useDesigner();
	const gameModalRef = useRef(null);
	const currentWorkspace = engine.workbench.activeWorkspace;
	const currentData = currentWorkspace.serialize();
	const [saveCurrentPage] = useSavePage();
	const handleCreateTask = async () => {
		const gameInfo = treeNode.props as IGameInfo;
		// 传递pageData 会保存页面数据
		await saveCurrentPage();
		await addGameTasks({
			currentData,
			gameInfo,
			elementId: treeNode.id,
		});
		//强制渲染
	};
	const items = [
		{
			key: "1",
			label: "游戏配置",
			children: (
				<GameSetter treeNode={treeNode} handleCreateTask={handleCreateTask} />
			),
		},
	]
	const handleGoEdit = useCallback(() => {
		gameModalRef.current.open(treeNode,{
			gameId: treeNode.props.gameId,
			templateId: treeNode.props.gameTemplateId,
		});
	
	}, [treeNode]);
	return (
		<>
			<Button
				type="link"
				style={{ marginLeft: "-16px" }}
				onClick={handleGoEdit}
			>
				编辑游戏
			</Button>
			<GameModal ref={gameModalRef} />
			<Tabs defaultActiveKey="1" items={items} />
		</>
	);
});
