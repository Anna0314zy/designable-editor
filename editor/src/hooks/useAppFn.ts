/*
 * @Date: 2024-02-01 15:23:23
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-02-28 19:46:50
 * @FilePath: /slides-engine/editor/src/hooks/useAppFn.ts
 */
import { useCallback } from "react"
import { saveSlides } from '../api/slides'
import { createPageId, savePage } from '../api/page'
import { message } from 'antd'
import { PageType, items } from '@editor/react/src/widgets/AddPageWidget'

let localPageIndex = 1

const useAppFn = (props) => {
  const {lastWorkspaceId, workspaceList, setSaveText, slideId, setWorkspaceList, currentWorkspaceId, workbench}  = props
  // 保存课件
  const syncOriginSort = () => {
    const slideData = workspaceList.map((page, index) => ({
      id: page.id,
      pageType: page.pageType,
      sortIndex: index,
      section: page.section && page.section.map(section => ({ ...section, secPack: false })),
      next: page.next && page.next.map(section => ({ ...section, secPack: false })),
      title: page.props.info.name || ''
    }))
    saveSlides({ slideId, slideStructure: JSON.stringify(slideData) })
  }
  // 创建首页课件页
	const handleCreatePageId = async (node?) => {
    const pageType = node ? Number(node.pageType) : PageType.normalPage
    console.log('createPageId----')
    const res = await createPageId({
      slideId,
      pageType
    })
    const pageInfo = items.filter(item => item.key === pageType)
    const page = {
      id: res.pageId,
      pageType,
      pageInfo: {
        children: [],
        componentName: 'Root',
        hidden: false,
        id: res.pageId,
        props: {
          info: {
            type: pageInfo[0]['label']
          },
          style: {},
          animates: []
        },
        sourceName: ''
      }
    }
    savePage({
      pageId: res.pageId,
      mainContentStructure: JSON.stringify(page)
    })
    return { pageId: res.pageId, page }
  }
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
  const saveCurrentPage = useCallback(async (autoSave?: boolean, showMessage = false) => {
    try {
      const isNotDelete = workbench.workspaces.length === workspaceList.length
      console.log(workbench.workspaces, lastWorkspaceId.current, autoSave, 'ppppp')
      if (autoSave === true || (isNotDelete && lastWorkspaceId.current)) { // 自动保存 || 手动保存 || 切页保存
        const activeData = workbench.workspaces.find(page => page.id === lastWorkspaceId.current)
        const result = activeData.serialize()
        console.log(result, 'lll')
        const children = result.pageInfo.children
        const fileMd5List = generateMd5List(children, [])
        if (result.pageInfo.props.style?.backgroundImage) {
          fileMd5List.push(result.pageInfo.props.style?.backgroundImage)
        }
        autoSave === true && setSaveText('课件保存中...')
        try {
          console.log('%c 课件保存data', 'color: #409EFF')
          await savePage({
            pageId: lastWorkspaceId.current,
            gameId: activeData.pageType === 2 && children.length ? children[0].props.gameId : undefined,
            gameTemplateId: activeData.pageType === 2 && children.length ? children[0].props.gameTemplateId : undefined,
            mainContentStructure: JSON.stringify(result),
            fileMd5List: Array.from(new Set(fileMd5List))
          })
          if (autoSave === true) {
            setSaveText('课件自动保存成功！')
            setTimeout(() => {
              setSaveText('')
            }, 10000)
          } else {
            if (showMessage) message.success("课件保存成功！")
          }
          return Promise.resolve()
        } catch (error) {
          if (autoSave === true) {
            setSaveText('课件自动保存失败，请重试！')
            setTimeout(() => {
              setSaveText('')
            }, 10000)
          } else {
            message.error("课件保存失败，请重试！")
          }
          return Promise.reject()
        }
      }
    } catch (error) {
      autoSave === true && setSaveText('课件自动保存失败，请重试！')
      setTimeout(() => {
        setSaveText('')
      }, 10000)
      return Promise.reject()
    }
  }, [workspaceList, lastWorkspaceId, setSaveText, workbench.workspaces])
  // 解构数据为画布数据
	const initSlideData = (data, sort) => {
		const mapFromPagetArray = new Map();
		const pageList = [];
		let mapResourceObj = [];
		data.forEach(obj => {
			mapFromPagetArray.set(obj.pageId, obj);
		});
		for (let i = 0; i < sort.length; i++) {
			const pageId = sort[i]["id"]
			console.log(mapFromPagetArray.get(pageId))
			if (mapFromPagetArray.get(pageId)) {
				// 判断JSON.parse是否成功
				try {
					const pageData = JSON.parse(mapFromPagetArray.get(pageId).mainContentStructure)
					if (sort[i]['section']) {
						pageData.section = sort[i]['section']
					}
					if (sort[i]['next']) {
						pageData.next = sort[i]['next']
					}
					pageList.push(pageData)
					const fileList = mapFromPagetArray.get(pageId).fileResourceDtoList || []
					mapResourceObj = mapResourceObj.concat(fileList.map((v) => ({ ...v, pageId })))
				} catch (e) {
					console.log(e)
					continue
				}
			}
		}
		return { pageList, mapResourceObj }
	}
  const updateThumbnail = () => {
    const index = workspaceList.findIndex(item => item.id === currentWorkspaceId)
    setWorkspaceList(v => {
      const origin = v[index]
      const newSpace = { ...origin, ...workspaceList[index].props }
      v.splice(index, 1, newSpace)
      return [...v]
    })
  }
  return {saveCurrentPage, syncOriginSort, updateThumbnail, handleCreatePageId, initSlideData}
}

export default useAppFn
