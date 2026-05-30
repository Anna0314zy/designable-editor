import React, { CSSProperties } from 'react';

export interface IComponentProps {
  useConnect?: any
  useReport?: any
  useResourceData?: any,
  /** 组件ID */
  id: string
  /** 页面ID */
  pageId: string
  /** 组件样式 */
  style?: any
  /** 组件标题 */
  title?: string
  /** 层级 */
  children?: any
  treeNodeProps?: any,
  setDefaultName?: any,
  mode?: string,
  md52Url?: any,
  src?: string,
  'x-component': string,
  globalConfig?: any,
  globalProps?: any,
  getInitState?: any
  fileId?:number | string
  localUrl?:string;
  initStyleProps?: any
  styleMapProps?: any
  info?: any
  sendLog?: any
}
export interface IResourceStateProps {
  /** 图片地址 */
  url?: string;

  /** 图片渲染状态 */
  status: 'pending' | 'success' | 'error';

  /** 图片当前状态 */
  state: 'normal' | 'active';

  /** 图片加载失败原因 */
  error?: string;

  /** 组件类型 */
  type: 'image' | 'video'

  /** 图片展示模式 */
  mode: 'edit' | 'preview';

  /** 组件ID */
  id: string;
}

export interface ILdImageProps {
  /** 图片展示模式 */
  mode: 'edit' | 'preview';

  /** 图片显示 */
  visible: boolean;

  /** 图片宽度 */
  width?: number | string;

  /** 图片高度 */
  height?: number | string;

  /** 图片类名 */
  className?: string;

  /** 图片样式 */
  style?: CSSProperties;

  /** 图片地址 */
  src: string;

  /** 图片描述 */
  alt?: string;

  /** 图片是否可预览，点击放大 */
  preview?: boolean;

  /** 图片加载失败容错地址 */
  fallback?: string;

  /** 加载占位，为 true 时使用默认占位 */
  placeholder?: boolean;

  // /** 图片参数信息 */
  // info: ILdImageInfoProps;

  /** 图片资源状态 */
  resourceStateChange: (event?: IResourceStateProps) => void;

  // /** 图片资源状态 */
  // resourceState: IResourceStateProps;

  /** 图片加载失败时触发的事件回调 */
  onError?: (event?: Event) => void;

  /** 图片加载成功时触发的事件回调 */
  onLoad?: (event?: Event) => void;

  /** 图片加载中时触发的事件回调 */
  onLoadStart?: (event?: Event) => void;

  /** 图片卸载时触发的事件回调 */
  onUnmount?: (event?: Event) => void;

  /** 图片加载完成时触发的事件回调 */
  onMount?: (event?: Event) => void;

  /** 图片更新加载完成时触发的事件回调 */
  onUpdate?: (event?: Event) => void;

  /** 图片渲染完成时触发的事件回调 */
  onRender?: (event?: Event) => void;
  // render?: (event: Event) => void;

}
