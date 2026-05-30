import {CoursewareEvent} from "@play/render";
export * from './size'

export const getSearchParam = (key: string) => {
    const param = new URLSearchParams(window.location.search);
    return param.get(key);
}

export function handleSendMessage(data: any) {
    data.timestamp ??= new Date().getTime();
	return new Promise((resolve) => {
		(window.microApp as unknown as any).forceDispatch(data, resolve);
	});
}

export function sendChangeMessage() {
	handleSendMessage({
		type: CoursewareEvent.CWStateChange,
		param: {},
		timestamp: new Date().getTime(),
	});
}

export function sendLog(param) {
	handleSendMessage({
		type: CoursewareEvent.sendLog,
		param: {
			system_id: 2,
			...param
		},
		timestamp: Date.now(),
	});
}