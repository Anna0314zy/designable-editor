import React, { useEffect } from "react";
import { useField, Field } from "@slides/react";
import { usePrefix } from "@editor/react";
import { Radio, FormItem } from "@slides/antd";
import { TreeNode } from "@editor/core";
import { message } from "antd";
// 选择后，出现对应的其他选项
// 普通游戏：是否为题目
// 是（默认）
// 否
// 作品游戏：是否为题目
// 否
// PK游戏：是否为题目
// 是
// 星豆雨游戏：无，直接添加完成
export const GameSetter = (props: { treeNode: TreeNode,handleCreateTask:()=>void }) => {
	const field = useField();
	const prefix = usePrefix("game-setter");
	const [gameType, setGameType] = React.useState("normalGame");
	const options = [
		{
			label: "星豆雨",
			value: "starRainingGame",
		},
		{
			label: "普通游戏",
			value: "normalGame",
		},
		{
			label: "PK游戏",
			value: "pkGame",
		},
		{
			label: "作品游戏",
			value: "workGame",
		},
	];
	useEffect(() => {
		setGameType(props.treeNode.props.gameType);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const onChangeGameType = (e) => {
		const value = e.target.value;
		if (value === "workGame") {
			props.treeNode.props.haveTestQuestions = "no";
		} else if (value === "pkGame") {
			props.treeNode.props.haveTestQuestions = "yes";
		} else if (value === "normalGame") {
			props.treeNode.props.haveTestQuestions = "yes";
		} else if (value === "starRainingGame") {
			delete props.treeNode.props.haveTestQuestions;
		}
		setGameType(value);
		props.handleCreateTask()
	};
	const onChangeQuestions = (e) => {
		// pkgame 时只能是题目
		// 其他时候都可以选择
		const value = e.target.value;
		if (props.treeNode.props.gameType === "pkGame") {
			if (value === "no") {
				props.treeNode.props.haveTestQuestions = "yes";
				return message.info("PK游戏必须为题目");
			}
			
		} else {
			props.treeNode.props.haveTestQuestions = value;
		}
		props.handleCreateTask()
	};
	return (
		<>
			<Field
				name="gameType"
				title="游戏类型"
				decorator={[FormItem]}
				component={[
					Radio.Group,
					{ className: `${prefix}-radio-group`, onChange: onChangeGameType },
				]}
				basePath={field.address.parent()}
				dataSource={options}
			/>
			<div
				style={{
					display: gameType === "starRainingGame" ? "none" : "block",
				}}
			>
				<Field
					name="haveTestQuestions"
					title="是否为题目"
					decorator={[FormItem]}
					component={[
						Radio.Group,
						{
							className: `${prefix}-radio-group`,
							onChange: onChangeQuestions,
						},
					]}
					basePath={field.address.parent()}
					dataSource={[
						{
							label: "是",
							value: "yes",
						},
						{
							label: "否",
							value: "no",
						},
					]}
				/>
			</div>
		</>
	);
};
