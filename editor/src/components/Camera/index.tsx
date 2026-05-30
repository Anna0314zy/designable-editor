import React from "react";
import { createBehavior, createResource } from "@editor/core";
import { useConnect } from "@play/render";
import { genPropsSchema, setDefaultName } from "../_config/genBehaviorTmpl";
import { schemaBase_info, baseLocale_info } from "../_config/schema-base";

import {
	schemaCamera_style,
	cameraDefaultProps,
	CameraLocale_info,
} from "../_config/schema-camera";

import { CameraComponent } from "@ld/slide-editor";
export const CameraBehavior = createBehavior({
	name: "Camera",

	selector: (node) => node.componentName === "Camera",

	designerProps: {
		propsSchema: genPropsSchema([schemaBase_info], [schemaCamera_style]),
		defaultProps: {
			...cameraDefaultProps,
		},
		getComponentProps(node) {
			return {
				useConnect,
				id: node.id,
				getStyle: (val) => {
					node.props.style = { ...node.props.style, ...val };
				},
				setDefaultName: (list, type) => {
					setDefaultName?.(list, type, node);
				},
			};
		},
	},

	designerLocales: {
		"zh-CN": {
			title: "矩形",
			settings: {
				info: {
					...baseLocale_info,
				},
				style: {
					...CameraLocale_info,
				},
			},
		},
	},
});

export const CameraResource = createResource({
	title: {
		"zh-CN": "视频流",
	},
	icon: "ImageResource",
	elements: [
		{
			componentName: "Camera",
			props: {
				title: "视频流",
				"x-decorator": "FormItem",
				"x-component": "Camera",
			},
		},
	],
});

export const Camera = (props) => {
	return <CameraComponent {...props} mode="edit" />;
};
