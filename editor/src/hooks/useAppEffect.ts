/*
 * @Date: 2024-02-01 15:44:17
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-03-11 19:54:01
 * @FilePath: /slides-engine/editor/src/hooks/useAppEffect.ts
 */
import { useEffect,useCallback } from "react"
import useAppFn from './useAppFn'
import { updateSysToken } from '../api/auth'
import { getSlides, canEdit } from '../api/slides'
import {host} from '../api'
import {message} from 'antd'
import { getToken } from '../utils/common'
import {
	getCosConfig,
} from "../api/upload";
import { createLocalMockPage } from './useAppFn'

const useAppEffect = (props) => {
	const {slideId, setLoading, setGlobalResource, setCurrentWorkspaceId, setWorkspaceList, currentWorkspaceId, workspaceList, lastWorkspaceId, workbench, setNoPermission,setGlobalData} = props
  const {saveCurrentPage, syncOriginSort, initSlideData, handleCreatePageId} = useAppFn(props)
  const regex = /(\d+\.\d+\.\d+)/;
  const TaskVersion = localStorage.getItem("TaskVersion");
  const homeUrl = import.meta.env.VITE_HOME_SERVER.replace(
    regex,
    TaskVersion || "1.0.0"
  );
  let somebodyEdit = false
  useEffect(() => {
    workspaceList.length && syncOriginSort()
  }, [workspaceList])
  //  获取资源列表存储路径
	const getFileFolder = useCallback(async () => {
    if (import.meta.env.MODE === 'dev') {
      setGlobalData((preData) => {
        return {
          ...preData,
          fileFolder: 'local-mock',
        };
      });
      return
    }
		const data = await getCosConfig();
		setGlobalData((preData) => {
			return {
				...preData,
				...data,
			};
		});
	}, [setGlobalData]);
	useEffect(() => {
		getFileFolder();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
  // 页面初始化数据
	useEffect(() => {
    if (import.meta.env.MODE === 'dev') {
      const page = createLocalMockPage()
      const currentWorkspace = workbench.ensureWorkspace({
        ...page.pageInfo,
        pageType: page.pageType,
      })
      currentWorkspace.engine.setCurrentTree({
        ...page.pageInfo,
        pageType: page.pageType,
      })
      setGlobalResource([])
      setCurrentWorkspaceId(page.id)
      setWorkspaceList([{
        ...page.pageInfo,
        pageType: page.pageType,
      }])
      setLoading(false)
      return
    }
    if (!slideId) {
      message.error('请输入正确的课件id')
      return
    }
    const init = async () => {
      const res = await getSlides({ slideId, containedAllResourcesFlag: true })
      setLoading(false)
      let initData = []
      if (res.slideStructure) { // 已有课件挂载
        const { pageList, mapResourceObj } = initSlideData(res.pageContentDtoList, JSON.parse(res.slideStructure))
        setGlobalResource(mapResourceObj)
        initData = pageList.filter((item) => item)
      } else { // 无课件新课件创建第一页
        // 创建课件页
        const { page } = await handleCreatePageId()
        initData = [page]
      }
      if (initData.length) {
        const pageInfoList = initData.map((item) => {
          const data = { ...item.pageInfo, pageType: item.pageType }
          if (item.section) data.section = item.section
          if (item.next) data.next = item.next
          return data
        })
        pageInfoList.forEach((item) => {
          const currentWorkspace = workbench.ensureWorkspace(item)
          currentWorkspace.engine.setCurrentTree(item)
        })
        setCurrentWorkspaceId(pageInfoList[0].id)
        setWorkspaceList(pageInfoList)
      }
    }
    canEdit({ slideId }).then((res) => {
      if (!res.lockedFlag && import.meta.env.MODE !== 'dev') {
        // 上锁中，其他人正在编辑
        somebodyEdit = true
        setLoading(false)
        setNoPermission(res.currentLockEmpName)
        return
      }
      init()
    })
  }, [])
  useEffect(() => {
    const setToken = async () => {
      if (import.meta.env.MODE === 'dev') return
      const systemToken: string = getToken()
      if (!systemToken) {
        location.replace(homeUrl)
        return
      } else {
        const res = await updateSysToken({ systemToken }).catch(() => {
          location.replace(homeUrl)
        })
        if (res?.systemToken) {
          localStorage.setItem('systemToken', res.systemToken)
        }
      }
    }
    const handleBeforeUnload = (event) => {
      // 删除锁定
      !somebodyEdit && navigator.sendBeacon(`${host}/classroom-slides/slides/${slideId}/exit-edit`);
      const confirmationMessage = '';
      event.returnValue = confirmationMessage;
      return confirmationMessage;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    const autoSave = setInterval(() => saveCurrentPage(true), 60000)
    const updateToken = setInterval(setToken, 30 * 60000)
    return () => {
      clearInterval(autoSave)
      clearInterval(updateToken)
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [])
  useEffect(() => {
    const currentWorkspace = workbench.currentWorkspace
    const activeWorkspace = workbench.activeWorkspace
    if (currentWorkspaceId !== currentWorkspace?.id) {
      workbench.switchWorkspace(currentWorkspaceId)
    }
    if (activeWorkspace?.id !== currentWorkspaceId) {
      const current = workbench.findWorkspaceById(currentWorkspaceId)
      workbench.setActiveWorkspace(current)
    }
    workbench.activeWorkspace && saveCurrentPage()
    lastWorkspaceId.current = currentWorkspaceId
  }, [workbench, currentWorkspaceId])
}

export default useAppEffect
