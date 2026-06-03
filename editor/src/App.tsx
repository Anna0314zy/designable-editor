import React, { useState, useRef, useCallback } from 'react'
import {
  Designer,
  IconWidget,
  ViewPanel,
  Workspace,
  OutlineTreeWidget,
  StudioPanel,
  CompositePanel,
  WorkspacePanel,
  ToolbarPanel,
  ViewportPanel,
  ContentPanel,
  StatusbarPanel,
  MainLayoutPanel,
  MarkPanel,
  AnimationWidgetWithErrorBoundary as AnimationWidget,
} from '@editor/react'
import { GlobalDataContext, GlobalResourceContext } from '@editor/react/src/globalDataContext'
import { SettingsForm } from '@editor/react-settings-form'
import { observer } from '@slides/reactive-react'
import { createDesigner } from '@editor/core'
import settingComponents from './settingComponents'
import Preview from './components/Preview'
// import {COSUpload} from './settingComponents/COSUpload'

import { Space, Button, message } from 'antd'
import { TreeContent, ViewContentComponent } from './components/TreeContent'
import { ContextMenu } from './components/ContextMenu'
import { GenMenuList } from './ToolbarData'
import { PageType } from '@editor/react/src/widgets/AddPageWidget'
import { deletePage as deletePageApi } from './api/page'
import { getUrlParameter, changeMenu, clearToken } from './utils/common'
import { logout as logoutApi } from './api/auth'
import { Moveable as MoveableContainer } from './components/Moveable'
import { ShortcutProvider } from './components/ShortcutProvider'
import { CommandProvider } from './commands/CommandProvider'
import { ThumbnailPanelWithCommands as ThumbnailPanel } from './components/ThumbnailPanelWithCommands'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { fontBootstrap, fontConfigList, FontFormatCollection } from '@slide/fonts'
import useAppFn from './hooks/useAppFn'
import useAppEffect from './hooks/useAppEffect'
import GameModal from './components/GameModal'

import './RegistryBehaviors'
import "antd/dist/reset.css";
import "./assets/normalize.css";
interface Iprops {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setNoPermission: React.Dispatch<React.SetStateAction<string>>
}
fontBootstrap(fontConfigList, './', [FontFormatCollection.woff])

// 生成的设计器
const engine = createDesigner()
/**
 * 渲染App 组件。
*
* @return {JSX.Element} 渲染后的组件。
*/
const App: React.FC<Iprops> = ({ setLoading, setNoPermission }) => {
  const slideId = getUrlParameter('id') || "06564451-2fb7-4e3d-80f5-3292825ff038"
  const slideTitle = getUrlParameter('title') || '课件标题'
  const productId = getUrlParameter('productId')
  const [workspaceList, setWorkspaceList] = useState([])
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState('')
  const lastWorkspaceId = useRef('')
  const workbench = engine.workbench
  const [saveText, setSaveText] = useState('')
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [globalResource, setGlobalResource] = useState([])
  const intervalMS = 60 * 60 * 1000
  // 属性设置面板title
  const [settingTitle, setSettingTitle] = useState('panels.PropertySettings')
  // 默认视口16:9
  const VIEW_PORT_RATIO = 0.75 //4:3 16:9的是0.5625
  const [globalData, setGlobalData] = useState<Record<string, any>>({
    viewportRatio: VIEW_PORT_RATIO,
    viewportSize: [1280, 960]
  })
  const previewRef = useRef(null)
  const gameModalRef = useRef(null)
  const resourceHost = globalData.cdnPathList?.[0] || globalData.cdnPath || ''
  const redirectToLogin = useCallback(() => {
    const regex = /(\d+\.\d+\.\d+)/
    const taskVersion = localStorage.getItem('TaskVersion')
    const homeUrl = import.meta.env.VITE_HOME_SERVER.replace(
      regex,
      taskVersion || '1.0.0'
    )
    const redirect = encodeURIComponent(window.location.href)
    location.replace(`${homeUrl}#/login?redirect=${redirect}`)
  }, [])
  const effectProps = {
    slideId,
    setLoading,
    setNoPermission,
    setGlobalResource,
    setCurrentWorkspaceId,
    setWorkspaceList,
    workbench,
    lastWorkspaceId,
    workspaceList,
    setSaveText,
    currentWorkspaceId,
    setGlobalData
  }
  // 加载effect及公共方法
  useAppEffect(effectProps)
  const { saveCurrentPage, updateThumbnail, handleCreatePageId } = useAppFn(effectProps)

  // 注册字体
  useRegisterSW({
    onRegistered(r) {
      r && setInterval(() => {
        r.update()
      }, intervalMS)
    }
  })
 const handlePreview = async() => {
  // await saveCurrentPage(false, false)
  previewRef.current.open()   
 }
  const handleLogout = async () => {
    setLogoutLoading(true)
    try {
      await logoutApi()
    } catch {
      message.warning('退出登录接口异常，已清理本地登录态')
    } finally {
      clearToken()
      redirectToLogin()
    }
  }
  // 课件行为按钮组件
  const Actions = observer(() => {
    return (
      <Space style={{ marginRight: 10 }}>
        <Button onClick={handlePreview}>预览</Button>
        <Button onClick={() => saveCurrentPage(false, true)}>保存</Button>
        {/* <Button danger loading={logoutLoading} onClick={handleLogout}>退出登录</Button> */}
      </Space>
    )
  })

  // Logo组件
  const Logo: React.FC = () => (
    // <IconWidget infer="Logo" style={{ margin: 10, height: 24, width: 24 }} />
    <></>
  )
  const showGameModel = (node) => {
    gameModalRef.current.open(node)
  }
  const hiddenGameModel = useCallback(() => {
    gameModalRef.current.cancel()
  },[])
  const handleDeletePage = useCallback((params) => {
    return deletePageApi(params)
  }, [])
  if (!currentWorkspaceId || workspaceList.length === 0) return null
  return (
    <GlobalDataContext.Provider value={{ globalData, setGlobalData }}>
      <GlobalResourceContext.Provider value={{ globalResource, setGlobalResource }}>
        <Designer engine={engine}>
          <CommandProvider>
            <ShortcutProvider />
            {/* <Workbench> */}
            <StudioPanel>
              <ToolbarPanel
                showGameModel={showGameModel}
                hiddenGameModel={hiddenGameModel}
                logo={<Logo />}
                actions={<Actions />}
                title={slideTitle}
                genMenuList={GenMenuList}
                text={saveText}
              ></ToolbarPanel>
              <ContentPanel>
                <MainLayoutPanel>
                  <ThumbnailPanel
                    resourceHost={resourceHost}
                    thumbnailList={workspaceList}
                    currentWorkspaceId={currentWorkspaceId}
                    components={ViewContentComponent}
                    changeMenu={changeMenu}
                    setWorkspaceList={setWorkspaceList}
                    setCurrentWorkspaceId={setCurrentWorkspaceId}
                    handleCreatePageId={handleCreatePageId}
                    deletePage={handleDeletePage}
                  ></ThumbnailPanel>
                  <ContextMenu>
                    <div style={{ display: 'flex', flex: '1' }}>
                      {workspaceList.map(({ id, pageType }) => {
                        return id !== currentWorkspaceId ? null : (
                          <Workspace id={id} key={id} pageType={pageType}>
                            <WorkspacePanel>
                              <ViewportPanel>
                                <ViewPanel
                                  type="DESIGNABLE"
                                  resourceHost={resourceHost}
                                  extra={
                                    <>
                                      <MoveableContainer
                                        setSettingTitle={setSettingTitle}
                                        lastWorkspaceId={lastWorkspaceId}
                                        saveCurrentPage={saveCurrentPage}
                                      />
                                    </>
                                  }
                                >
                                  <TreeContent />
                                </ViewPanel>
                              </ViewportPanel>
                              <MarkPanel>
                                {/* <ResourceManager></ResourceManager> */}
                              </MarkPanel>
                            </WorkspacePanel>
                          </Workspace>
                        )
                      })}
                    </div>
                  </ContextMenu>
                  <CompositePanel direction={'right'} showNavTitle={true}>
                    <CompositePanel.Item title={settingTitle} icon="Setting">
                      <SettingsForm updateThumbnail={() => { updateThumbnail() }} extra={{ ...settingComponents }} />
                    </CompositePanel.Item>
                    {workbench.currentWorkspace.pageType ===
                      PageType.normalPage && (
                      <CompositePanel.Item
                        title="panels.OutlinedTree"
                        icon="Outline"
                      >
                        <OutlineTreeWidget />
                      </CompositePanel.Item>
                    )}
                    {/* <CompositePanel.Item title="panels.History" icon="History">
                  <HistoryWidget />
                </CompositePanel.Item> */}
                    <CompositePanel.Item title="panels.Animation" icon="Animation">
                      <AnimationWidget />
                    </CompositePanel.Item>
                  </CompositePanel>
                </MainLayoutPanel>
              </ContentPanel>
              <StatusbarPanel
                workspaceList={workspaceList}
              ></StatusbarPanel>
            </StudioPanel>
            {/* </Workbench> */}
            <GameModal ref={gameModalRef}/>
            <Preview selfRef={previewRef} slideId={slideId} pageId={currentWorkspaceId} slideTitle={slideTitle} productId={productId}  fileList={globalResource}/>
          </CommandProvider>
        </Designer>
    
      </GlobalResourceContext.Provider>

    </GlobalDataContext.Provider>
  )
}

export default App
