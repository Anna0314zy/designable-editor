import React, { useEffect, useReducer, useMemo } from "react";
import { createResource, createBehavior } from "@editor/core";
import { genPropsSchema } from "../_config/genBehaviorTmpl";
import { useConnect } from "@play/render";
import { schemaGame_info, gameLocale_info } from "../_config/schema-game";
import { not_moveable_class } from "@editor/react";
// 生成一个Game相关的Behavior
const getSchema = () => {
	const properties = genPropsSchema([schemaGame_info], []);
	delete properties.properties["style-properties"];
	return properties;
};
export const GameBehavior = createBehavior({
	name: "Game",

	selector: (node) => node.componentName === "Game",

	designerProps: {
		// propsSchema:genPropsSchema([],[]),
		propsSchema: getSchema(),
		draggable: false,
		getComponentProps(node) {
			return {
				id: node.id,
				useConnect,
			};
		},
	},
	designerLocales: {
		"zh-CN": {
			title: "游戏",
			settings: {
				info: {
					...gameLocale_info,
				},
			},
		},
	},
});

export const GameResource = createResource({
	title: {
		"zh-CN": "游戏",
		"en-US": "Game",
	},
	icon: "GameResource",

	elements: [
		{
			componentName: "Game",
			props: {
				title: "游戏",
				style: {
					width: "100%",
					height: "100%",
				},
				"x-component": "Game",
			},
		},
	],
});

export const Game = (props) => {
	// TODO: 环境变量需要重新获取
	const {
		treeNodeProps,
		gameTemplateId,
		gameId,
		gameTemplateName,
		publicModel,
		gameUrl,
		isSelect,
		id,
	} = props;
	const { registerInstance, uninstallInstance } = useConnect([]) as any;
	const forceUpdate = useReducer((preState) => preState + 1, 0)[0];
	useEffect(() => {
		registerInstance(id, {
			forceUpdate,
			remove: () => {
				uninstallInstance(id);
			},
			...props,
		});
	}, []);
	const env = import.meta.env.MODE;
	const url = useMemo(() => {
		if (!gameUrl) return "";
		const iframeUrl =
			gameUrl?.indexOf("?") > -1
				? `${gameUrl}&timestamp=${Date.now()}`
				: `${gameUrl}?templateId=${gameTemplateId}&templateName=${gameTemplateName}&publicModel=${publicModel}&openPanel=studentPanel&env=${env}&gameId=${gameId}&role=teacher&v=${Date.now()}`;
		const params = new URLSearchParams(iframeUrl);
		const hasGameId = params.get("gameId");
		if (!hasGameId) {
			return iframeUrl + `&gameId=${gameId || ""}`;
		}
		return iframeUrl;
	}, [gameUrl, gameTemplateId, gameTemplateName, publicModel, env, gameId]);
	return (
		<div
			{...treeNodeProps}
			style={{
				transform: "translate(0px, 0px) rotate(0deg)",
				height: 960,
				width: 1280,
				border: "none",
			}}
			className={`${treeNodeProps.className} ${not_moveable_class}`}
		>
			<iframe
				width="100%"
				height="100%"
				src={url}
				style={{ pointerEvents: isSelect ? "all" : "none" }}
			></iframe>
		</div>
	);
};
