import { ShapeResource } from './components/Shape/EditingShape'
import { ImgResource } from './components/Img'
import { TextResource } from './components/Text/EditingText'
import { RichTextResource } from './components/RichText'

import { SubMenuItem } from './components/menu'
import { VideoResource } from './components/Video'
import { AudioResource } from './components/Audio'
import { GameResource } from './components/Game/editingGame'
import { CameraResource } from './components/Camera'
import { PageType } from '@editor/react/src/widgets/AddPageWidget'

const normalMenu = [
  {
    key: 'ShapeComponent',
    title: '形状',
    icon: 'ShapeResource',
    resource: ShapeResource,
  },
  {
    key: 'RichTextComponent',
    title: '富文本',
    icon: 'TextResource',
    resource: RichTextResource,
  },
  {
    key: 'MediaResourceList',
    title: '资源',
    icon: 'Resource',
    resource: [ImgResource],
  },
  {
    key: 'CameraResourceList',
    title: '视频流',
    icon: 'Resource',
    resource: CameraResource,
  },

]

const videoMenu = [
  {
    key: 'MediaResourceList',
    title: '资源',
    icon: 'Resource',
    resource: [VideoResource],
  },
]

const gameMenu = [
  {
    key: 'GameComponent',
    title: '游戏',
    icon: 'GameResource',
    resource: GameResource,
  },
]

export const GenMenuList = (workspace) => {
  const pageType = Number(workspace.pageType)
  const getComponentList = (pageType: PageType) => {
    if (pageType === PageType.normalPage) {
      return normalMenu
    }
    if (pageType === PageType.videoPage) {
      return videoMenu
    }
    if (pageType === PageType.gamePage) {
      return gameMenu
    }
  }
  return [
    {
      key: 'component',
      title: '元素',
      historyOperation: true,
      children: getComponentList(pageType),
      SubMenuItem,
    },
    {
      key: 'view',
      title: '视图',
      children: [
        {
          key: 'FullScreen',
          title: '全屏展示',
          icon: 'FullScreen',
        },
      ],
      SubMenuItem,
    },
    // {
    //   key: 'preview',
    //   title: '播放',
    //   children: [
    //     {
    //       key: 'PreviewNow',
    //       title: '从当前播放',
    //       icon: 'PreviewNow',
    //     },
    //     {
    //       key: 'PreviewFromStart',
    //       title: '从头播放',
    //       icon: 'PreviewFromStart',
    //     },
    //   ],
    //   SubMenuItem,
    // },
  ]
}
