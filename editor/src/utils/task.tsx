import { v4 as uuidv4 } from "uuid";
import { removeTask, editTask } from "../api/upload";
import { TreeNode, Workspace } from "@editor/core";
import { savePage } from "../api/page";
import { message } from "antd";
import { getUrlParameter } from "./common";
import {
	ITask,
	Status,
	Method,
	TaskForm,
	FollowUpLinkageType,
	GroupType,
	taskTypes,
} from "@editor/typing";
export interface IGameInfo {
	gameType: string;
	haveTestQuestions?: boolean;
	gameId: number;
	gameTemplateId: number;
	gameName: string;
}
interface IGameSetterProps {
	gameType: GroupType;
	elementId: string;
	gameInfo?: IGameInfo;
}
export const addGameTasksExt = ({
	courseTaskList,
	gameInfo,
}: {
	courseTaskList: (ITask & { taskExt?: Record<string, any> })[];
	gameInfo: IGameInfo;
}) => {
	const { gameType, haveTestQuestions, gameId, gameTemplateId } = gameInfo;
	return courseTaskList.map((item) => {
		if (item.taskType === "startGame") {
			// haveTestQuestions 可能不存在
			return {
				...item,
				taskExt: {
					...(item?.taskExt || {}),
					gameType,
					...(haveTestQuestions !== undefined ? { haveTestQuestions } : {}),
					gameId,
					gameTemplateId,
				},
			};
		}
		return item;
	});
};
export const addVideoTask = async ({
	elementId,
	pageId,
}: {
	elementId: string;
	pageId: string;
}) => {
	// 先要保存当前页信息 保存完之后添加任务
	// 添加需要添加任务的内容 添加的时候自动保存 保存完之后添加任务
	try {
		const slideId = getUrlParameter("id");
		const courseTaskList = getVideoTasks({ elementId });
		await editTask({
			slideId,
			pageId,
			elementId,
			courseTaskList,
		});
	} catch (e) {
		if (e.message) message.error(e.message);
	}
};
export const deleteTaskContent = async ({
	data,
	currentWorkspace,
}: {
	data: TreeNode;
	currentWorkspace: Workspace;
}) => {
	if (!["Video", "Game"].includes(data.componentName)) return;
	const currentData = currentWorkspace.serialize();
	try {
		// await savePage({
		// 	pageId: currentData.id,
		// 	mainContentStructure: JSON.stringify(currentData),
		// });
		// 删除任务
		await removeTask({ pageId: currentData.id, elementId: data.id });
	} catch (e) {
		if (e.message) message.error(e.message);
	}
};
//删除页的时候 删除任务
// export const delTask = async ({
// 	pageId,
// 	elementId,
// }: {
// 	pageId: string;
// 	elementId: string;
// }) => {
// 	return await removeTask({ pageId, elementId });
// };

export const addGameTasks = async ({
	currentData,
	gameInfo,
	elementId,
}: {
	currentData: any;
	gameInfo: IGameInfo; // props
	elementId: string;
}): Promise<void> => {
	//生成任务
	let courseTaskList: ITask[] = [];
	const { gameType } = gameInfo;
	switch (gameType) {
		case "pkGame":
			courseTaskList = getTaskPkGame({
				gameType,
				elementId,
				gameInfo,
			});
			break;
		case "normalGame":
			courseTaskList = getTaskNormalGame({
				gameType,
				elementId,
				gameInfo,
			});
			break;
		case "starRainingGame":
			courseTaskList = getTaskStarGame({
				gameType,
				elementId,
				gameInfo,
			});
			break;
		case "workGame":
			courseTaskList = getTaskWorkGame({
				gameType,
				elementId,
				gameInfo,
			});
			break;
	}

	const slideId = getUrlParameter("id");
	try {
		//删除任务
		// taskExt扩展字段说明:
		const newCourseTaskList = addGameTasksExt({ courseTaskList, gameInfo });
		await editTask({
			slideId,
			pageId: currentData.id,
			elementId,
			courseTaskList: newCourseTaskList,
		});
		return Promise.resolve();
	} catch (e) {
		if (e.message) message.error(e.message);
		return Promise.reject();
	}
};
export const getTaskPkGame = ({
	gameType,
	elementId,
	gameInfo,
}: IGameSetterProps) => {
	const groupName: GroupType = gameType;
	const base = {
		groupId: uuidv4(),
		groupName: groupName,
		// pageId: currentPageData.id,
		description: "小组PK游戏，课中高潮环节，请老师好好把握",
		taskDurationSecond: 60,
		countdownDisplay: Status.yes,
		endMethod: Method.manual,
		skipStatus: Status.no,
		retryStatus: Status.no,
		followUpLinkageType: FollowUpLinkageType.none,
		words: "",
		taskForm: TaskForm.initiatedTask,
		elementId,
	};
	const defaultData: ITask[] = taskTypes
		.filter((v) => v.groupName === groupName)
		.map((item, index) => {
			const obj = {
				...base,
				taskType: item.taskType,
				taskName: `[小组PK] ${item.name}`,
			};
			switch (index) {
				case 0:
					obj.description = "小组PK游戏，课中高潮环节，请老师好好把握";
					obj.followUpLinkageType = FollowUpLinkageType.auto;
					break;
				case 1:
					obj.description = "全员表扬的环节，请表扬大家的积极表现";
					obj.countdownDisplay = Status.no;
					obj.followUpLinkageType = FollowUpLinkageType.auto;
					break;
				case 2:
					obj.description = "冠军小组上台，让大家一起恭喜他们";
					obj.countdownDisplay = Status.no;
					obj.followUpLinkageType = FollowUpLinkageType.auto;
					break;
				case 3:
					obj.countdownDisplay = Status.no;
					obj.description =
						"各自小组上台，让他们鼓励自己，并且根据名次他们会获得相应的金币奖励。手动结束环节即会直接关闭环节，请注意";
					break;
				default:
					break;
			}
			if (item.taskType === "startGame") {
				return {
					...obj,
					taskName: `[小组PK] ${gameInfo.gameName}`,
					endMethod: Method.auto,
				};
			}
			return obj;
		});
	return defaultData;
};
export const getTaskNormalGame = ({
	gameType,
	elementId,
	gameInfo,
}: IGameSetterProps) => {
	const base = {
		groupId: uuidv4(),
		groupName: gameType,
		description: "可发给学生的游戏，发起任务学生即开始进行游戏",
		taskDurationSecond: 60,
		countdownDisplay: Status.yes,
		endMethod: Method.auto,
		skipStatus: Status.no,
		retryStatus: Status.no,
		followUpLinkageType: FollowUpLinkageType.none,
		words: "",
		taskForm: TaskForm.initiatedTask,
		elementId,
	};
	const defaultData: ITask[] = taskTypes
		.filter((v) => v.groupName === gameType)
		.map((item) => {
			const obj = {
				...base,
				taskType: item.taskType,
				taskName: `[${item.name}] ${gameInfo.gameName}`,
			};
			return obj;
		});
	return defaultData;
};
export const getTaskStarGame = ({
	gameType,
	elementId,
	gameInfo,
}: IGameSetterProps) => {
	const base = {
		groupId: uuidv4(),
		groupName: gameType,
		description:
			"给学生发红包的特殊游戏，倒计时结束，游戏结束，也可随时手动结束",
		taskDurationSecond: 60,
		countdownDisplay: Status.yes,
		endMethod: Method.auto,
		skipStatus: Status.no,
		retryStatus: Status.no,
		followUpLinkageType: FollowUpLinkageType.none,
		words: "",
		taskForm: TaskForm.initiatedTask,
		elementId,
		taskExt: {
			coinAmount: "100",
		},
	};
	const defaultData: ITask[] = taskTypes
		.filter((v) => v.groupName === gameType)
		.map((item) => {
			const obj = {
				...base,
				taskType: item.taskType,
				taskName: `[${item.name}] ${gameInfo.gameName}`,
			};
			return obj;
		});
	return defaultData;
};
export const getTaskWorkGame = ({
	gameType,
	elementId,
	gameInfo,
}: IGameSetterProps) => {
	const base = {
		groupId: uuidv4(),
		groupName: gameType,
		description: "作品类的游戏，完成的作品会显示在点评界面中",
		taskDurationSecond: 60,
		countdownDisplay: Status.yes,
		endMethod: Method.auto,
		skipStatus: Status.no,
		retryStatus: Status.no,
		followUpLinkageType: FollowUpLinkageType.none,
		words: "",
		taskForm: TaskForm.initiatedTask,
		elementId,
	};
	const defaultData: ITask[] = taskTypes
		.filter((v) => v.groupName === gameType)
		.map((item, index) => {
			const obj = {
				...base,
				taskType: item.taskType,
				taskName: `[作品] ${item.name}`,
			};
			if (index === 0) {
				obj.taskName = `[作品] ${gameInfo.gameName}`;
				obj.followUpLinkageType = FollowUpLinkageType.auto;
			}
			if (index === 1) {
				obj.description =
					"可对作品进行点评，放大某作品后，可以点击1人上台，此作品学员即可上台。手动点击结束任务会直接关闭此环节，请注意";
				obj.endMethod = Method.manual;
				obj.countdownDisplay = Status.no;
			}
			return obj;
		});
	return defaultData;
};
// 生成视频任务
const getVideoTasks = ({ elementId }: { elementId: string }) => {
	return [
		{
			groupId: uuidv4(),
			groupName: "playVideo",
			taskName: "视频",
			taskType: "playVideo",
			description:
				"开始任务，点击视频区播放按钮，任务为提示您操作的倒计时，不影响你对视频的操作",
			taskDurationSecond: 60,
			endMethod: Method.auto,
			skipStatus: Status.yes,
			followUpLinkageType: FollowUpLinkageType.none,
			retryStatus: Status.no,
			elementId: elementId,
			words: "",
			taskForm: TaskForm.promptTask,
			countdownDisplay: Status.yes,
		},
	];
};
export const handleSavePage = async (currentWorkspace) => {
	const currentData = currentWorkspace.serialize();
	try {
		await savePage({
			pageId: currentData.id,
			mainContentStructure: JSON.stringify(currentData),
		});
	} catch (e) {
		if (e.message) message.error(e.message);
	}
};
export const addNormalGameTasks = async ({
	treeNode,
	currentWorkspace,
}: {
	treeNode: TreeNode;
	currentWorkspace: Workspace;
}) => {
	const currentData = currentWorkspace.serialize();
	const gameInfo = treeNode.props as IGameInfo;
	const slideId = getUrlParameter("id");
	try {
		const courseTaskList = addGameTasksExt({
			courseTaskList: getTaskNormalGame({
				gameType: "normalGame",
				elementId: treeNode.id,
				gameInfo,
			}),
			gameInfo,
		});
		await editTask({
			slideId,
			elementId: treeNode.id,
			pageId: currentData.id,
			courseTaskList,
		});
	} catch (e) {
		if (e.message) message.error(e.message);
	}
};
export const retryRequest = async  (func,maxRetries = 3,): Promise<any> =>{
	let retries = 1;
	while (retries <= maxRetries) {
		try {
			const res = await func();
			return res;
		} catch (error) {
			console.log('%c 重试请求', 'color: #409EFF')
			retries++;
		}
	}
}
