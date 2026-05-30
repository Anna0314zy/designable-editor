import {
	useState,
	useContext,
	useEffect,
	useRef,
} from "react";
import Slide from "./App";
import {
	HoxRoot,
	CoursewareEvent,
	Mode,
	Signalling,
	useEventStore,
} from "@play/render";
import { SlideInfoContext, SizeContext } from "@slide/render-context";
import { useRootController, useHandleResize } from "./hook";
import { getSearchParam, handleSendMessage, sendLog } from "./utils";
import { LogAct, LogName } from "./const";

const mode = (getSearchParam("mode") || Mode.Receiver) as Mode;
const player = getSearchParam("player") || "preview";
export const signalling = new Signalling({ mode, player });

const Slides = () => {
	const size = useContext(SizeContext);
	const { pageInfo } = useContext(SlideInfoContext);
	const globalData = window.microApp.getGlobalData() as unknown as any;
	const globalConfig = { resourceData: globalData["resource"] };
	const pageList = pageInfo.pageList;
	const activeId = pageInfo.activeId;
	const targetRef = useRef(null);
	const hasSendResult = useRef(false);
	const hasVideo = useRef(false);
	const timeoutId = useRef<any>(null);

	// 设置一个函数来处理 DOM 稳定之后的情况
	function onDomStable(observer) {
		observer.disconnect();
		if(!hasSendResult.current) {
			handleSendMessage({
				type: CoursewareEvent.SetPageIdResult,
				param: { id: activeId, result: "success" },
			});
		}
	}

	useEffect(() => {
		if(activeId.length === 0) return
		const slides = document.querySelectorAll(
			`[preview-root]`
		) as unknown as HTMLElement[];
		const activeSlide = Array.from(slides).find((slide) => slide.getAttribute("preview-root") === activeId);
		const observer = new MutationObserver((mutationsList, observer) => {
			// 有新的 DOM 变化时，重置定时器
			clearTimeout(timeoutId.current);
			// 遍历每一个发生变化的 MutationRecord
			for (let mutation of mutationsList) {
				if (mutation.addedNodes.length > 0) {
					// 检查是否为图片元素
					const addedNode = mutation.addedNodes[0] as unknown as any;
					const isMedia = (addedNode.tagName && addedNode.tagName.toLowerCase() === 'img') || (addedNode.tagName && addedNode.tagName.toLowerCase() === 'picture') || (addedNode.tagName && addedNode.tagName.toLowerCase() === 'video') || false;
					if (isMedia) {
						// 统计页面中图片元素的数量
						const imageElements = activeSlide.querySelectorAll('img');
						const videoElements = activeSlide.querySelectorAll('video');
						if(videoElements.length > 0) {
							hasVideo.current = true
						}
						let totalMedia = imageElements.length + videoElements.length;
						let loadedMedia = 0;
						console.log("file: main.tsx:57 ~ observer ~ loadedImages:", loadedMedia, totalMedia)
						const imgLoadHandler = () => {
							loadedMedia++;
							// 检查所有图片是否加载完毕
							if (loadedMedia === totalMedia) {
								// video加载权重更大
								if(!hasSendResult.current && !hasVideo.current) {
									observer.disconnect();
									hasSendResult.current = true
									// fix: 首屏GPU绘制图片慢，延迟发送结果
									setTimeout(()=>{
										handleSendMessage({
											type: CoursewareEvent.SetPageIdResult,
											param: { id: activeId, result: "success" },
										});
									}, 100)
								}
							}
						}
						const mediaLoadHandler = () => {
							loadedMedia++;
							// 检查所有图片是否加载完毕
							if (loadedMedia === totalMedia) {
								if(!hasSendResult.current) {
								console.log("file: main.tsx:76 ~ setTimeout ~ handleSendMessage:", handleSendMessage)
									observer.disconnect();
									hasSendResult.current = true
									// fix: 首屏GPU绘制图片慢，延迟发送结果
									setTimeout(()=>{
										handleSendMessage({
											type: CoursewareEvent.SetPageIdResult,
											param: { id: activeId, result: "success" },
										});
									}, 100)
								}
							}
						}
						if(totalMedia > 0 ) {
							// 监听图片加载完成事件
							imageElements.forEach((imageElement) => {
								imageElement.addEventListener('load', imgLoadHandler);
								// 监听图片加载失败事件
								imageElement.addEventListener('error', imgLoadHandler);
							});
							videoElements.forEach((videoElement) => {
								videoElement.addEventListener('loadeddata', mediaLoadHandler);
								// 监听视频加载失败事件
								videoElement.addEventListener('error', mediaLoadHandler);
							})
						}
					}
				}
			}
			timeoutId.current = setTimeout(()=>{onDomStable(observer)}, 200);
		});
		if (targetRef.current) {
			observer.observe(targetRef.current, { childList: true, subtree: true, attributes: true, attributeFilter: ['activeid'] });
			targetRef.current.setAttribute("activeId", activeId);
		}
		// 埋点-切页结束
		sendLog({ name: LogName.ChangePage, act: LogAct.End, id: activeId });
		return () => {
			observer.disconnect();
			hasSendResult.current = false;
		};
	}, [activeId]);

	useEffect(() => {
		handleSendMessage({
			type: CoursewareEvent.Ready,
			param: {},
		});
	}, []);

	return (
		<div
			ref={targetRef}
			className="slides-preview"
			style={{
				pointerEvents: mode === Mode.Receiver ? "none" : "auto",
			}}
		>
			<div
				className="preview-container"
				style={{
					position: "relative",
					height: "960px",
					width: "1280px",
					transform: `scale(${size.scale})`,
					transformOrigin: "0 0",
					overflow: "hidden",
				}}
			>
				{pageList.map((item, index) => {
					return (
						<Slide key={item.id} pageInfo={item} globalConfig={globalConfig} style={{ zIndex: item.id === activeId ? 10 : -1 }} />
					);
				})}
			</div>
		</div>
	);
};

const RootEl = ({ setSize }) => {
	const flag = useRef(false);
	const [updateSize] = useHandleResize();
	if (!flag.current) {
		updateSize(null, setSize);
		flag.current = true;
	}
	useRootController(setSize);
	return null;
};

const Check = () => {
	const { msgQueue, msgControllerList } = useEventStore();
	if (mode === Mode.Sender) {
		signalling.forceCheck();
	}
	// if (msgControllerList) {
	// 	console.log("file: main.tsx:100 ~ Check ~ msgControllerList:", msgControllerList)
	// }
	if (msgQueue) {
		// signalling.check()
		// 获取state类型的数组
		const queue = JSON.parse(JSON.stringify(msgQueue));
		const stateQueue = queue.filter((item) => item.msgType === "state") || [];
		const stateQueueMap = {};
		stateQueue.forEach((item) => {
			if (!stateQueueMap[item.id]) {
				stateQueueMap[item.id] = [];
			}
			stateQueueMap[item.id].push(item);
		});
		// stateQueueMap中每一项按照timestamp排序
		Object.keys(stateQueueMap).forEach((key) => {
			stateQueueMap[key].sort((a, b) => a.timestamp - b.timestamp);
		});
		// 取每一项的最后一项，形成一个数组
		const stateQueueList = Object.keys(stateQueueMap).map(
			(key) => stateQueueMap[key][stateQueueMap[key].length - 1]
		);
		// console.log(
		// 	"file: EventSequence.tsx:218 ~ stateQueueList:",
		// 	stateQueueList
		// );
		window.microApp.setGlobalData({ msgQueue: [...stateQueueList] });
	}
	return null;
}

const Main = () => {
	const [size, setSize] = useState({
		wrapperHeight: window.innerHeight,
		wrapperWidth: window.innerWidth,
		clientHeight: window.innerHeight,
		clientWidth: window.innerWidth,
		scale: 1
	})
	const [pageInfo, setPageInfo] = useState({
		pageList: [],
		activeId: "",
		nextId: "",
	})
	return (
		<HoxRoot>
			<SlideInfoContext.Provider
				value={{ pageInfo: pageInfo, setPageInfo: setPageInfo }}
			>
				<SizeContext.Provider value={size}>
					<RootEl setSize={setSize} />
					<Slides />
					<Check />
				</SizeContext.Provider>
			</SlideInfoContext.Provider>
		</HoxRoot>
	);
};

export default Main;
