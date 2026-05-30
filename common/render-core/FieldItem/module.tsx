import { isObject, isArray, isNumber } from "../utils";

// return dataIndex、dataPath、schemaPath
const getPathObj = ({ rootPath = [], path }) => {
	const pathList = (path || "").split(".");
	const dataIndex = [];
	const schemaIndex = [];
	const dataPathList = [];

	rootPath.forEach((item: any, index: number) => {
		// dataIndex
		if (isNumber(item)) {
			dataIndex.push(item);
			return;
		}

		// schemaIndex
		if (isNumber(rootPath[index + 1])) {
			schemaIndex.push(`${item}[]`);
		} else {
			schemaIndex.push(item);
		}
	});

	// dataPath
	let list = [...rootPath];
	list.pop();
	list = [...list, ...pathList];
	list.forEach((item: any) => {
		dataPathList.push(isNumber(item) ? `[${item}]` : item);
	});
	const dataPath = dataPathList.join(".");

	// schemaPath
	const _path = isNumber(pathList[0]) ? pathList.slice(1) : pathList;
	const schemaPath = [...schemaIndex, _path].join(".");

	return {
		dataIndex,
		dataPath,
		schemaPath,
	};
};

export const getPath = (path: any) => {
	if (!path) {
		return null;
	}
	return isArray(path) ? path.join(".") : path;
};

export const getFieldProps = (
	schema,
	{ widgets, methods, path, rootPath },
	extra
) => {
	const pathObj = getPathObj({ path, rootPath });

	const fieldProps = {
		...schema.props,
		...extra,
		...methods,
		addons: {
			...extra,
			...pathObj,
		},
	};

	["placeholder", "disabled", "format"].forEach((key) => {
		if (schema[key]) {
			fieldProps[key] = schema[key];
		}
	});

	// 以 props 结尾的属性，直接透传
	Object.keys(schema).forEach((key) => {
		if (typeof key === "string" && key.toLowerCase().endsWith("props")) {
			fieldProps[key] = schema[key];
		}
	});

	// 支持 addonAfter 为自定义组件的情况
	if (isObject(fieldProps.addonAfter) && fieldProps.addonAfter.widget) {
		const AddonAfterWidget = widgets[fieldProps.addonAfter.widget];
		fieldProps.addonAfter = <AddonAfterWidget {...schema} />;
	}

	// Dynamic Mapping of Methods
	if (isObject(schema.methods)) {
		Object.keys(schema.methods).forEach((key) => {
			const name = schema.methods[key];
			fieldProps[key] = methods[name];
		});
	}

	fieldProps.schema = schema;

	// 全局Props
	if(extra.globalProps) {
		const globalProps = extra.globalProps;
		Object.keys(globalProps).forEach((key) => {
			if (typeof key === "string" && key.toLowerCase().endsWith("props")) {
				fieldProps[key] = globalProps[key];
			}
		});
	}

	return fieldProps;
};
