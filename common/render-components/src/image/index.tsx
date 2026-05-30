import React, { useEffect, useReducer, useState,memo } from "react";
import { IComponentProps } from "./type";
import { ImageComponent as ImageComponent2 } from "./Image";
import {LogAct, LogName, LogState, ResourceType} from '../const'
// props中会有linkage属性，格式：{sourceId,targetId,sourceEvent,targetAction,}
import { getUrls } from "../utils";

declare global {
	interface Window {
		__MICRO_APP_ENVIRONMENT__?: any;
	}
}

enum JUMP_PAGE {
	NEXT = 'next'
}
export const ImageComponent = memo((props: IComponentProps) => {
	const {
		useConnect,
		useReport,
		id,
		mode,
		style,
		treeNodeProps,
		setDefaultName,
		src,
		localUrl,
		children,
		initStyleProps, // 预览端使用-初始样式
		styleMapProps,
		info // 预览端使用
		// setComponentProps
	} = props;
	const { registerInstance, instanceMap, uninstallInstance } = useConnect(
		[]
	) as unknown as any;

	const styleItem = styleMapProps && styleMapProps[id] || {}

	const { resourceReport, ReportStatus, ResourceStatus } = useReport();

	const [urls, setUrls] = useState<string[]>([]);
	useEffect(() => {
		console.log("img registerInstance:");
		registerInstance(id, {
			remove: () => {
				resourceReport({
					type: 'REMOVE',
					payload: {
					  componentId: id,
					  pageId: props.pageId,
					  resourceId: src,
					  resourceType: props['x-component'],
					  resourceUrl: src,
					  resourceStatus: ResourceStatus.NONE,
					},
				  })
				uninstallInstance(id);
				// 万一用户删除了 异步还没完成 就会报错 资源可以最后统一根据实例处理
				// removeResource?.({elementId:id})
			},
			...props,
		});
		if (mode === "edit") {
			setDefaultName(instanceMap, props["x-component"]);
		}
	}, [registerInstance, id, uninstallInstance,ReportStatus]);

	useEffect(() => {
		const { resourceData } = props.globalConfig;
		const { fileList } = props.globalProps;
		if (src) {
			const urls = getUrls(resourceData, fileList, src, "pic");
			setUrls(urls);
		}
	}, [props.globalProps.fileList, src]);

	useEffect(() => {
		if(mode === 'preview') {
			// 埋点-资源加载开始
			if(props.sendLog) {
				const sendLog = props.sendLog
				sendLog({name: LogName.LoadResource, act: LogAct.Start, id: id, option:{ resource_type: ResourceType.Img, md5: src }})
			}
		}
		resourceReport({
			type: ReportStatus.UPDATE,
			payload: {
				componentId: id,
				pageId: props.pageId,
				resourceId: src,
				resourceType: props["x-component"],
				resourceUrl: src,
				resourceStatus: ResourceStatus.LOADING,
			},
		});
	}, [src]);

	useEffect(() => {
		resourceReport({
			type: ReportStatus.ADD,
			payload: {
				componentId: id,
				resourceId: src,
				pageId: props.pageId,
				resourceType: props["x-component"],
				resourceUrl: src,
				resourceStatus: ResourceStatus.NONE,
			},
		});
	}, []);

	const onError = () => {
		if(mode === "preview") {
			// 埋点-资源加载失败
			const sendLog = props.sendLog
			sendLog({name: LogName.LoadResource, act: LogAct.End, id: id, option:{ resource_type: ResourceType.Img, md5: src, state: LogState.Error }})
		}
		resourceReport({
			type: ReportStatus.UPDATE,
			payload: {
				componentId: id,
				resourceId: src,
				pageId: props.pageId,
				resourceType: props["x-component"],
				resourceUrl: src,
				resourceStatus: ResourceStatus.ERROR,
			},
		});
	};

	// 图片加载成功时触发的事件回调
	const onLoad = (url) => {
		if(mode === "preview") {
			// 埋点-资源加载成功
			const sendLog = props.sendLog
			sendLog({name: LogName.LoadResource, act: LogAct.End, id: id, option:{ resource_type: ResourceType.Img, md5: src, url:url, state: LogState.Success }})
		}
		if(!src) return
		resourceReport({
			type: ReportStatus.UPDATE,
			payload: {
				componentId: id,
				resourceId: src,
				pageId: props.pageId,
				resourceType: props["x-component"],
				resourceUrl: src,
				resourceStatus: ResourceStatus.LOADED,
			},
		});
	};
	const handleImageClick = () => {
		// todo 是否放到controller 中
		const { jumpPage } = info;
		if(jumpPage === JUMP_PAGE.NEXT && window.__MICRO_APP_ENVIRONMENT__) {
			window.microApp && window.microApp.dispatch({
				type: 'setNextPageId',
			});
		}
	}
	// 渲染
	return (
		<div
			className="img-component"
			{...treeNodeProps}
			preview-id={id}
			style={{ ...style, position: "absolute", ...initStyleProps, ...styleItem }}
		>
			<div style={{ width: "100%", height: "100%", position: "relative" }} onClick={handleImageClick}>
				<ImageComponent2
					onLoad={onLoad}
					onError={onError}
					urls={urls}
					localUrl={localUrl}
					style={{
						width: "100%",
						height: "100%",
						borderRadius: "inherit",
					}}
                   />
				{children}
			</div>
		</div>
	);
})
