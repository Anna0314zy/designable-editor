import React from "react";
import { createBehavior, createResource } from "@editor/core";
import { useConnect, useReport } from "@play/render";

import { useResourceData } from "@editor/react";
import { genPropsSchema, setDefaultName } from "../_config/genBehaviorTmpl";
import {
	schemaBase_info,
	schemaBase_style,
	baseLocale_info,
	baseLocale_style,
} from "../_config/schema-base";
import {
	schemaImage_info,
	schemaImage_style,
	imageLocale_info,
	imageLocale_style,
} from "../_config/schema-image";
import { observer } from "@slides/react";
import { ImageComponent } from "@slide/render-components";
import { WidgetLoading } from "../../components/widgetLoading";

export const ImgBehavior = createBehavior({
	name: "Img",
	selector: (node) => node.componentName === "Img",
	designerProps: {
		propsSchema: genPropsSchema(
			[schemaBase_info, schemaImage_info],
			[schemaBase_style, schemaImage_style]
		),
		defaultProps: {
			style: {
				width: "300px",
				height: "300px",
				transform: "translate(0px, 0px) rotate(0deg)",
			},
			// info:{
			// 	// keepRatio: true
			// }
		},
		getComponentProps(node) {
			return {
				useConnect,
				useReport,
				useResourceData,
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
			title: "图片",
			settings: {
				info: {
					...baseLocale_info,
					...imageLocale_info,
				},
				style: {
					...baseLocale_style,
					...imageLocale_style,
				},
			},
		},
	},
});

export const ImgResource = createResource({
	title: {
		"zh-CN": "图片",
	},
	icon: "ImageResource",
	elements: [
		{
			componentName: "Img",
			props: {
				title: "图片",
				"x-decorator": "FormItem",
				"x-component": "Img",
			},
		},
	],
});

export const Img = observer((props: any) => {
	const globalConfig = {
		resourceData: {
			remote: {
				cdnPathList: [`${import.meta.env.VITE_CDN_SERVER}`],
			},
		},
	};
	const globalProps = {
		fileList: useResourceData(),
	};
	return (
		<ImageComponent
			{...props}
			globalConfig={globalConfig}
			globalProps={globalProps}
			mode="edit"
		>
			<WidgetLoading uploadStatus={props.uploadStatus} src={props.src}/>
		</ImageComponent>
	);
});
