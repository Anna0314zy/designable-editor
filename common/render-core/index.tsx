/* eslint-disable react-refresh/only-export-components */
import React from "react";
import { FieldItem } from "./FieldItem";
import { withProvider as withProvider2 } from "./models/withProvider";
import sortProperties from "./models/sortProperties";
import { buildInWidgets } from "./widgets";

export interface schemaIF {
	"ui:widget": string;
	props: {
		[key: string]: any;
	};
	properties: {
		[key: string]: any;
	};
	widgetType?: string;
	id?: string;
}
interface RenderItemProps {
	schema: schemaIF;
	rootPath?: any[] | undefined;
	path?: any[] | undefined;
	key?: string | undefined;
	activePageId?: string;
	pageId?: string;
}

const renderItem = (props: RenderItemProps) => {
	const { schema, key, path, rootPath, activePageId, pageId } = props;

	// render Object | field
	let child: React.ReactNode = null;

	if (schema?.properties && schema?.widgetType !== 'field') {
		child = RenderCore({ schema, parentPath: path, rootPath });
	}

	return (
		<FieldItem
			key={key}
			schema={schema}
			path={path}
			rootPath={rootPath}
			children={child}
			renderCore={RenderCore}
			activePageId={activePageId}
			pageId={pageId}
		/>
	);
};

export const RenderCore = (props): null | React.ReactNode => {
	const { schema, parentPath = [], rootPath = [], activePageId, pageId } = props;
	if (!schema || Object.keys(schema).length === 0) {
		return null;
	}

	// render Object | field
	const properties = sortProperties(Object.entries(schema.properties || {}));

	return properties.map(([key, item]) => {
		const path = [...parentPath, key];
		return renderItem({ schema: item, path, key, rootPath, activePageId, pageId});
	});
};

export const RenderRoot = withProvider2(RenderCore, buildInWidgets);

export const withProvider = withProvider2;

export * from "./models";
export * from "./schema";
export * from "./components";
export * from "./shared";
export * from "./utils";
