import { getEventStore, msgStore } from "../models/context";
import { PostMessageClient } from "./PostMessageClient";
import { Mode } from "../shared";
declare global {
	interface Window {
		microApp: {
			addDataListener(
				mainDataListener: (info: {
					type: any;
					param: any;
					timestamp: any;
				}) => void,
				arg1: boolean
			): unknown;
			dispatch(data: any): unknown;
			getGlobalData(): unknown;
			setGlobalData: (data: any) => void;
		};
	}
}

export interface IEventSequenceProps {
	searchParams: string;
	handleSendMessage: any;
	currentPageId: any;
	setAnimateInstanceStatus: any;
	animateComplete: any;
	activePageId: any;
}

export class Signalling {
	mode: Mode;
	index: number;
	timerId: number;
	messageClient: PostMessageClient;
	player: string;

	constructor({ mode, player }) {
		this.mode = mode;
		this.player = player;
		this.index = 0;
		this.timerId = -1;
		if (this.player === "preview") {
			// 此处模拟场景
			this.messageClient = new PostMessageClient({ mode, player });
		} else {
			// 发送数据
			this.messageClient = new PostMessageClient({
				mode,
				player,
			});
		}

		this.receive();

		if (mode === Mode.Sender) {
			this.check();
		}
	}

	forceCheck() {
		this.check();
	}

	delay(ms) {
		return new Promise((res) => {
			this.timerId = window.setTimeout(res, ms);
		});
	}

	// 发送端调用逻辑
	async check() {
		const { msgQueue } = getEventStore();
		console.log(
			"file: EventSequence.tsx:79 ~ Signalling ~ check ~ msgQueue:",
			msgQueue
		);

		if (msgQueue.length < this.index) {
			return;
		}
		const sendQueue = msgQueue.filter(
			(item) => !item.marked && item.msgType !== "state"
		);

		if (sendQueue.length > 0) {
			for (const item of sendQueue) {
				await this.messageClient.sendWithRetry(item);
			}
		}
	}

	// 恢复数据
	async recover(queue) {
		msgStore.setCache(queue);
		const { msgControllerList, msgQueue, addMsg } = getEventStore();
		console.log(
			"file: EventSequence.tsx:107 ~ Signalling ~ recover ~ msgControllerList:",
			msgControllerList, queue
		);
		for (const info of queue) {
			const filterList = msgControllerList.filter(
				(item) =>
					item.id === info.id &&
					info.msgType === item.msgType &&
					info.msgName === item.msgName &&
					info.pageId === item.pageId
			);
			if (filterList.length > 0) {
				const item = filterList[filterList.length - 1];
				console.log(
					"file: EventSequence.tsx:116 ~ Signalling ~ recover ~ item:",
					item,
					info
				);
				const msg = msgQueue.find(
					(item) =>
						item.id === info.id &&
						info.msgType === item.msgType &&
						item.msgName === item.msgName &&
						info.pageId === item.pageId
				);
				console.log(
					"file: EventSequence.tsx:118 ~ Signalling ~ recover ~ msg:",
					msg
				);
				if (msg) {
					if (msg.msgName.indexOf("player") > -1) {
						await item?.controller?.(info.msgDetail);
					}
					if (msg.msgName.indexOf("animate") > -1) {
						if (
							msg.msgDetail.status === "pending" &&
							info.msgDetail.status !== "pending"
						) {
							await item?.controller?.(info.msgDetail);
						}
					}
				} else {
					console.log(
						"file: EventSequence.tsx:126 ~ Signalling ~ recover ~ item:",
						item, info
					);
					await item?.controller?.(info.msgDetail);
					addMsg(info);
				}
			}
		}
		console.log("恢复数据完成");
	}

	// 接收端逻辑
	receive() {
		// 接收到数据
		this.messageClient.onMessage((msgInfo) => {
			if (this.mode === Mode.Receiver) {
				const { msgControllerList, addMsg } = getEventStore();
				console.log(
					"file: EventSequence.tsx:162 ~ Signalling ~ this.messageClient.onMessage ~ msgControllerList:",
					msgControllerList
				);
				const filterList = msgControllerList.filter(
					(item) =>
						item.id === msgInfo.id &&
						msgInfo.msgType === item.msgType &&
						msgInfo.msgName === item.msgName &&
						msgInfo.pageId === item.pageId
				);
				const item = filterList[filterList.length - 1];
				const result = item?.controller?.(msgInfo.msgDetail);
				Promise.resolve(result).then(() => {
					addMsg(msgInfo);
				});
			}
		});
	}
}
