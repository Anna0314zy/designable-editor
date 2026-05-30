import { createContext, useState, useCallback, useReducer } from "react";
import { createGlobalStore, createStore } from "hox";
export const FRContext = createContext(null);

export const ConfigContext = createContext(null);

export const msgStore = (() => {
	class Store {
		public _cache = [];
		constructor() {}
		setCache(queue: any) {
			this._cache = queue;
		}

		getCache() {
			return this._cache;
		}
	}
	return new Store();
})();

export enum ReportStatus {
	ADD = "ADD",
	UPDATE = "UPDATE",
	REMOVE = "REMOVE",
}

export enum ResourceStatus {
	NONE = "NONE",
	LOADING = "LOADING",
	LOADED = "LOADED",
	ERROR = "ERROR",
}

const ResourceInfo = {
	pageId: "",
	componentId: "",
	resourceId: "",
	resourceType: "",
	resourceUrl: "",
	resourceStatus: ResourceStatus.NONE as ResourceType,
};

export const ResourceActionInfo = {
	type: ReportStatus.ADD as ReportType,
	payload: ResourceInfo,
};

// 提取上方变量的类型
type ReportType = keyof typeof ReportStatus;
type ResourceType = keyof typeof ResourceStatus;
type ResourceInfoType = typeof ResourceInfo;
type ResourceActionType = typeof ResourceActionInfo;

const isSameResource = (a: ResourceInfoType, b: ResourceInfoType) => {
	return a.componentId === b.componentId && a.pageId === b.pageId;
};

// 资源上报的 hook 逻辑
const useResourceHook = () => {
	const [resourceList, dispatch] = useReducer(
		(preState: Array<ResourceInfoType> = [], action: ResourceActionType) => {
			switch (action.type) {
				// 添加一条资源上报信息
				case ReportStatus.ADD:
					if (preState.find((item) => isSameResource(item, action.payload))) {
						return preState;
					} else {
						return [...preState, action.payload];
					}
				// 更新一条资源上报信息
				case ReportStatus.UPDATE:
					return preState.map((item) => {
						if (isSameResource(item, action.payload)) {
							return action.payload;
						}
						return item;
					});
				// 移除一条资源上报信息
				case ReportStatus.REMOVE:
					return preState.filter(
						(item) => !isSameResource(item, action.payload)
					);
			}

			console.error(`Unknown action: ${action.type}`);
		},
		[]
	);

	// 资源列表、上报资源的方法
	return { resourceList: resourceList || [], dispatch };
};

export const [useResourceStore, getResourceStore] =
	createGlobalStore(useResourceHook);

// 受控组件上报自身的 hook 逻辑
export const [useInstanceStore, getInstanceStore] = createGlobalStore(() => {
	const [instanceMap, setInstanceMap] = useState({});
	// 以key为id，value为实例 存储组件实例上的信息
	const registerInstance = useCallback(
		(id, instance) => {
			setInstanceMap((old) => {
				if (old[id] === instance) {
					return old;
				}
				return { ...old, [id]: instance };
			});
		},
		[setInstanceMap]
	);

	const uninstallInstance = useCallback(
		(id) => {
			// 删除old中的属性为id的属性
			setInstanceMap((old) => {
				if (old[id]) {
					delete old[id];
				}
				return old;
			});
		},
		[setInstanceMap]
	);

	// window.instanceMap = instanceMap;

	// instanceMap: 所有注册的受控组件映射，registerInstance：注册受控组件的方法
	return {
		instanceMap,
		registerInstance,
		uninstallInstance,
	};
});

// 获取受控组件信息的优化 hook, 只关心 ids 这些组件的注册完成，它们的变动会引起本身的 render
export const useConnect = (ids: Array<string>) => {
	return useInstanceStore((store) => ids.map((id) => store.instanceMap[id]));
};

// 获取资源上报信息的优化 hook, 因为在组件中他们只关心上报、别的上报不应该影响自身 render
export const useReport = () => {
	const { resourceList, dispatch } = useResourceStore(() => []);
	return {
		resourceList,
		resourceReport: dispatch,
		ReportStatus,
		ResourceStatus,
	};
};

export const genPageResource = () => {
	return createStore(useResourceHook);
};

// 消息序列的 hook 逻辑
export const [useEventStore, getEventStore] = createGlobalStore(() => {
	// 消息序列列表（组件id, 消息类型, 消息名称, 消息详情）
	// 消息类型： 'event' | 'state'
	const [msgQueue, setMsgQueue] = useState([]);
	// 组件的消息主控逻辑注册，同步后通过它来模拟交互
	const [msgControllerList, setMsgControllerList] = useState([]);

	// 接收端直接调用，不会传 isSender，通过 copyLog 可以查看同步到的 消息序列
	const addMsg = useCallback(
		({ id, msgName, msgDetail, msgType, pageId }, isSender = false) => {
			setMsgQueue((pre) => [
				...pre,
				{
					id,
					msgName,
					msgDetail,
					msgType,
					pageId,
					timeStamp: Date.now(),
					isSender,
				},
			]);
		},
		[setMsgQueue]
	);

	const copyLog = () => {
		return JSON.stringify(msgQueue);
	};

	/**
	 * 发送端notice 的参数， 同步后会作为 controller 的参数，在接收端执行还原
	 */
	const registerMsg = useCallback(
		(id, msgName, msgType, pageId) => ({
			// 通过各种交互事件会触发notice，接收端会同步notice的信令
			notice(msgDetail) {
				addMsg({ id, msgName, msgType, msgDetail, pageId }, true);
				// 消息序列管理器 [mode=sender] 中读取， 并派发信号
			},

			// 注册组件对应接收到消息后的处理逻辑函数
			register(controller) {
                const cache = msgStore.getCache();
                const cacheInfo = cache.find((item) => item.pageId === pageId && item.msgType === msgType && item.id === id && item.msgName === msgName);
                if(cacheInfo) {
                    controller(cacheInfo.msgDetail);
                }
				setMsgControllerList((old) => [
					...old,
					{ id, msgType, msgName, pageId, controller },
				]);
				// 通过（消息序列管理器 [mode=receiver])、收到信令，执行注入方法
			},
		}),
		[setMsgControllerList, addMsg]
	);

	return {
		copyLog,
		addMsg,
		msgQueue,
		msgControllerList,
		registerMsg,
		setMsgControllerList,
		setMsgQueue,
	};
});
