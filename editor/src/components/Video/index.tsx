/*
 * @Date: 2024-02-28 18:59:49
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-03-04 16:29:58
 * @FilePath: /slides-engine/editor/src/components/Video/index.tsx
 */
import React from "react";
import { createResource, createBehavior } from "@editor/core";
import { useConnect, useReport, useEventStore } from "@play/render";
import { useResourceData } from "@editor/react";

import { schemaVideo_info, videoLocale_info } from "../_config/schema-video";

import { genPropsSchema, setDefaultName } from "../_config/genBehaviorTmpl";

import { VideoComponent } from "@slide/render-components";
import { WidgetLoading } from "./WidgetLoading";
export const VideoBehavior = createBehavior({
	name: "Video",

	// 当选中画布中的节点(node)时，如果 selector 返回true，则会在右侧面板展示此配置表单，表单内容会同步到 node.props 中
	selector: (node) => node.componentName === "Video",

	designerProps: {
		propsSchema: genPropsSchema([schemaVideo_info], []),
		defaultProps: {
			info: {
				autoplay: true
			},
			style: {},
		},
		draggable: false,
		getComponentProps(node) {
			return {
				useConnect,
				useReport,
				useEventStore,
				id: node.id,
				pageId: node.root.id,
				setDefaultName: (list, type) => {
					setDefaultName(list, type, node);
				},
			};
		},
	},

	designerLocales: {
		"zh-CN": {
			title: "视频",
			settings: {
				info: {
					...videoLocale_info,
				},
				style: {
					
				},
			},
		},
	},
});

export const VideoResource = createResource({
	title: {
		"zh-CN": "视频",
	},
	icon: "VideoSource",
	elements: [
		{
			// 画布上用这个组件来渲染, 与 content.tsx 中 components 的 key 对应
			componentName: "Video",
			props: {
				title: "视频",
				style: {},
				"x-component": "Video",
			},
		},
	],
});
const globalConfig = {
	resourceData: {
		remote: {
			cdnPathList: [`${import.meta.env.VITE_CDN_SERVER}`],
		},
	},
};
export const Video = (props) => {
	const globalProps = {
		fileList: useResourceData(),
	};
	// 视频加载中
	
	return (
		<VideoComponent
			mode="edit"
			{...props}
			globalProps={globalProps}
			globalConfig={globalConfig}
		>
			<WidgetLoading src={props.src} uploadStatus={props.uploadStatus} uploadPercent={props.uploadPercent}/>
		</VideoComponent>
	);
};
