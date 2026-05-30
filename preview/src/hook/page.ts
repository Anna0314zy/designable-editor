import { CoursewareEvent, getEventStore } from "@play/render";
import { getPageInfoById } from "../utils/resource";
import { useContext } from "react";
import { SlideInfoContext } from "@slide/render-context";
import { handleSendMessage, sendLog } from "../utils";
import { LogAct, LogName } from "../const";

const useSetSlideInfo = () => {
  let { pageInfo, setPageInfo } = useContext(SlideInfoContext);
  const updatePageList = async (
    id: string,
    pre = "",
    next = "",
    trend: string
  ) => {
    console.log("updatePageList", id, pre, next, trend);
    const { pageList, activeId } = pageInfo;

    // 先判断 activeId 是否等于 id 等于 直接 return
    if (activeId === id) return;
	const newIdList = [pre, id, next].filter(Boolean);
    // 找出所有 pageList 中的 对象中 id 不在 newIdList 的 id
	const addList = newIdList.filter((item) => {
		return !pageList.some((page) => page.id === item)
	})
	// 找出 pageList 中需要移除的数据
	const removeList = pageList.filter((item) => {
		return !newIdList.includes(item.id)
	}).map((item) => item.id)
	
	// 如果有不在当前list 中的，则移除掉
	if (removeList.length > 0) {
		console.log('updatePageList removeList', removeList)
		removeList.forEach((remove) => {
			const pageIndex = pageList.findIndex((item) => item.id === remove);
			if (pageIndex > -1) {
				pageList.splice(pageIndex, 1);
			}
		})
		
	}
	if (addList.length > 0) {
		console.log('updatePageList addList', addList)
		await Promise.all(addList.map(async (item) => {
			const pageInfo = await getPageInfoById(item);
			pageList.push(pageInfo);
		}));
	}

	

    setPageInfo((prev) => {
      return {
        ...prev,
        activeId: id,
        pageList: Array.from(new Set(pageList))
      };
    });
  };
  return [updatePageList];
};

export const usePage = () => {
  const [updatePageList] = useSetSlideInfo();
  let { pageInfo } = useContext(SlideInfoContext);
  const setSlideInfo = (msgInfo: {
    id: string;
    pre: string;
    next: string;
    trend: string;
  }) => {
    // 埋点-切页开始
    sendLog({name: LogName.ChangePage, act: LogAct.Start, id: msgInfo.id})
    const { setMsgControllerList, setMsgQueue } = getEventStore();
    const slideIdList = pageInfo.pageList.map(page => page.id)
    setMsgControllerList((old) => {
      return old.filter((item) => {
        return slideIdList.includes(item.pageId);
      });
    });
    setMsgQueue((old) => {
      return old.filter((item) => {
        return slideIdList.includes(item.pageId);
      });
    });
    const { id, pre, next, trend } = msgInfo;
    updatePageList(id, pre, next, trend);
  };
  return [setSlideInfo];
};
