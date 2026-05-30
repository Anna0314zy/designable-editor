import React, { useEffect, useRef, useState } from 'react'
import { usePrefix, useWorkspace } from '../hooks'
import cls from 'classnames'
import { observer } from '@slides/reactive-react'
import { Tooltip } from 'antd'

export interface IToolbarPanelProps {
  children?: React.ReactNode
  logo?: React.ReactNode
  actions?: React.ReactNode
  title?: string
  style?: React.CSSProperties
  defaultActiveKey?: number | string
  text?: string
  genMenuList?: (workspace: any) => any[]
  showGameModel:(args?:any)=>void
  hiddenGameModel:()=>void
}

const getDefaultKey = (menuList: any[]) => {
  if (menuList.length) {
    return menuList?.[0].key
  }
}

const findItem = (list: any[], key: string | number) => {
  for (let index = 0; index < list.length; index++) {
    const item = list[index]
    if (key === index) return item
    if (key === item.key) return item
  }
}
export const ToolbarPanel: React.FC<IToolbarPanelProps> = observer(({
  logo,
  actions,
  title,
  genMenuList,
  showGameModel,
  hiddenGameModel,
  ...props
}) => {
  const [isFullScreen, setIsFullScreen] = useState(document.fullscreenElement != null);
  const workspace = useWorkspace()
  const menuList = genMenuList(workspace)
  const [activeKey, setActiveKey] = useState<string | number>(
    props.defaultActiveKey ?? getDefaultKey(menuList)
  )
  const prefix = usePrefix('toolbar-panel')
  const activeKeyRef = useRef(null)
  const currentItem = findItem(menuList, activeKey)
  const currentSubMenuList = currentItem.children
  const SubMenuItem = currentItem?.SubMenuItem
  activeKeyRef.current = activeKey
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement != null);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    // 在组件卸载时移除事件监听器
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);
  const openGameFilter = (resource) => {
    const { node } = (resource && resource[0]) || {}
    showGameModel(node)
  };
  return (
    <div
      className={prefix}
      {...props}
    >
      <div className={prefix + '-menu-container'}>
        <div className={prefix + '-left'}>
          <div className={prefix + '-logo'}>{logo}</div>
          <Tooltip title={title} color='#1890ff' overlayStyle={{'maxWidth': '100%'}}>
            <div className={prefix + '-title'}>{title}</div>
          </Tooltip>
        </div>
        <div className={prefix + '-menu-panel'}>
          {menuList.map((item, index) => {
            return (
              <div key={index} className={cls(prefix + '-menu-item', { active: activeKey === item.key })} onClick={(e: any) => {
                setActiveKey(item.key)
              }}>
                <div className={prefix + '-menu-item-title'}>{item.title}</div>
              </div>
            )
          })}
        </div>
        <div className={prefix + '-right'}>
          <div className={prefix + '-actions'}>{actions}</div>
        </div>
      </div>
      <div className={prefix + '-sub-menu-container'}>
        <div style={{
          position: 'absolute',
          left: '40px',
          color: props.text === "课件自动保存失败，请重试！" ? 'red': "#1890ff"
        }}>{props.text}</div>
        {/* {
          currentItem.historyOperation &&
          <div className={prefix + '-operation'}>
            <DesignerToolsWidget />
          </div>
        } */}
        <div className={prefix + '-sub-menu-area'}>
          {currentSubMenuList.map((item, index) => {
            item.isFullScreen = isFullScreen
            return (
              <SubMenuItem key={index} item={item} openGameFilter={openGameFilter}></SubMenuItem>
            )
          })}
        </div>
      </div>
      {props.children}
    </div >
  )
})
