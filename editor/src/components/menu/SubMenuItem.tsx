import React from 'react'
import { IconWidget, TextWidget, usePrefix } from '@editor/react'
import { DownOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Dropdown, Space } from 'antd'
import { ShapePanel } from '@slide/slide-shape'
import './style.less'
import { COSUpload } from '../../settingComponents/COSUpload'
import { CameraDown } from './Camera/CameraDown'
export const SubMenuItem = (props) => {
  const { item } = props
  const { title, icon, key, resource, isFullScreen } = item
  const { node } = (resource && resource[0]) || {}

  const prefix = usePrefix('toolbar-panel')

  const ShapeComponent: MenuProps['items'] = [
    {
      label: <ShapePanel node={node} />,
      key: '0',
    },
  ]
  const allResourceMenu: MenuProps['items'] = [
    {
      key: "Img",
      label: (
        <COSUpload
          type="pic"
          title="图片"
          data-designer-source-id={resource?.[0]?.[0]?.node?.id}
          node={resource?.[0]?.[0]?.node}
        />
      ),
    },
    {
      key: "Video",
      label: (
        <COSUpload
          type="video"
          title="视频"
          data-designer-source-id={resource?.[0]?.[0]?.node?.id}
          node={resource?.[0]?.[0]?.node}
        />
      ),
    },
    // {
    //   key: "AudioResource",
    //   label: (
    //     <COSUpload
    //       type="audio"
    //       title="音频"
    //       data-designer-source-id={resource?.[2]?.[0]?.node?.id}
    //       node={resource?.[2]?.[0]?.node}
    //     />
    //   ),
    // },
  ]

  const genResourceMenu = () => {
    return resource.map((item) => {
      const { elements } = item[0]
      const element = elements[0]
      const { componentName } = element
      const menu = allResourceMenu.find((item) => item.key === componentName)
      return menu
    })
  }

  const handleMenuItemClick = (key: string, resource:any) => {
    switch (key) {
      case 'FullScreen': {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
        break
      }
      case 'PreviewNow': {
        break
      }
      case 'GameComponent': {
        props.openGameFilter(resource)
        break
      }
      default:
        console.log('default')
    }
  }

  switch (key) {
    case 'ShapeComponent': {
      return (
        <div className={prefix + '-sub-menu-item'}>
          <Dropdown menu={{ items: ShapeComponent }} trigger={['click']}>
            <a onClick={(e) => e.preventDefault()}>
              <Space size={0}>
                {icon && (
                  <IconWidget
                    className={prefix + '-sub-menu-item-icon'}
                    infer={icon}
                    style={{ width: 16, height: 16 }}
                  />
                )}
                <div className={prefix + '-sub-menu-item-title'}>{title}</div>
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
      )
      break
    }
    case 'MediaResourceList': {
      return (
        <div className={prefix + '-sub-menu-item'}>
          <Dropdown
            menu={{
              items: genResourceMenu(),
            }}
            trigger={['click']}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space size={0}>
                {icon && (
                  <IconWidget
                    className={prefix + '-sub-menu-item-icon'}
                    infer={icon}
                    style={{ width: 16, height: 16 }}
                  />
                )}
                <div className={prefix + '-sub-menu-item-title'}>{title}</div>
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
      )
      break
    }
    case 'RichTextComponent':
    case 'VideoComponent': {
      return (
        <div
          className={prefix + '-sub-menu-item'}
          key={node.id}
          data-designer-source-id={node.id}
        >
          {icon && (
            <IconWidget
              className={prefix + '-item-icon'}
              infer={icon}
              style={{ width: 16, height: 16 }}
            />
          )}
          <span className={prefix + '-item-text'}>
            {
              <TextWidget>
                {title || node.children[0]?.getMessage('title')}
              </TextWidget>
            }
          </span>
        </div>
      )
      break
    }
    case 'CameraResourceList': {
      return (
       <CameraDown prefix={prefix} nodeId={node.id}/>
      )
      break
    }

    case 'GameComponent':
    case 'PreviewNow':
    case 'PreviewFromStart':
      return (
        <div
          className={prefix + '-sub-menu-item'}
          key={key}
          onClick={() => handleMenuItemClick(key, resource)}
        >
          {icon && (
            <IconWidget
              className={prefix + '-sub-menu-item-icon'}
              infer={icon}
              style={{ width: 16, height: 16 }}
            />
          )}
          <span className={prefix + '-sub-menu-item-title'}>{title}</span>
        </div>
      )
      break
    case 'FullScreen': {
      return (
        <div
          className={prefix + '-sub-menu-item'}
          key={key}
          onClick={() => handleMenuItemClick(key, resource)}
        >
          {icon && (
            <IconWidget
              className={prefix + '-sub-menu-item-icon'}
              infer={icon}
              style={{ width: 16, height: 16 }}
            />
          )}
          <span className={prefix + '-sub-menu-item-title'}>{isFullScreen ? '退出全屏' : '全屏展示'}</span>
        </div>
      )
      break
    }
    case 'default': {
      return (
        <div
          className={prefix + '-sub-menu-item'}
          key={key}
          onClick={() => handleMenuItemClick(key, resource)}
        >
          {icon && (
            <IconWidget
              className={prefix + '-sub-menu-item-icon'}
              infer={icon}
              style={{ width: 16, height: 16 }}
            />
          )}
          <span className={prefix + '-sub-menu-item-title'}>{title}</span>
        </div>
      )
      break
    }
  }
}
