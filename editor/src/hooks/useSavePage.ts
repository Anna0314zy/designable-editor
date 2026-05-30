/*
 * @Date: 2024-02-27 15:08:05
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-02-28 19:47:57
 * @FilePath: /slides-engine/editor/src/hooks/useSavePage.ts
 */
import { useWorkbench } from "@editor/react";
import { savePage } from "../api/page";
function generateMd5List(children, list = []) {
  if (children && children.length) {
    children.forEach((item) => {
      // 过滤掉 一些 编辑时才会存在的props
      ['uploadStatus', 'localUrl','uploadPercent'].forEach(key => {
        delete item.props[key]
      })
      if (
        item.props["x-component"] === "Img" ||
        item.props["x-component"] === "Video" ||
        item.props["x-component"] === "Audio"
      ) {
        item.props.src && list.push(item.props.src)
      }
      if (item.componentName === 'Group') list = list.concat(generateMd5List(item.children, []))
    })
    return list
  }
  return []
}
export const useSavePage = () => {
    const workbench = useWorkbench()
    const currentWorkspace = workbench.activeWorkspace;
	const currentWorkspaceId = currentWorkspace?.id;
     const saveCurrentPage = () => {
    if (import.meta.env.MODE === 'dev') {
      return Promise.resolve()
    }
		const result = currentWorkspace.serialize()
		const children = result.pageInfo.children
		const fileMd5List = generateMd5List(children, [])
		if (result.pageInfo.props.style?.backgroundImage) {
			fileMd5List.push(result.pageInfo.props.style?.backgroundImage)
		}
		return savePage({
			pageId: currentWorkspaceId,
			mainContentStructure: JSON.stringify(result),
			fileMd5List: Array.from(new Set(fileMd5List)),
      gameId: currentWorkspace.pageType === 2 && children.length ? children[0].props.gameId : undefined,
      gameTemplateId: currentWorkspace.pageType === 2 && children.length ? children[0].props.gameTemplateId : undefined,
		})
	}
  
    return [saveCurrentPage] as const;
  };
