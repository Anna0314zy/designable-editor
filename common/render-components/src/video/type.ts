
export interface IComponentProps {
    useConnect?: any
    useReport?: any
    useEventStore?: any
    md52Url?: any,
    src?: any,
    /** 组件ID */
    id: string
    /** 编辑模式 */
    mode: any
    /** 页面ID */
    pageId: string
    /** 组件样式 */
    style?: any
    /** 组件标题 */
    title?: string
    /** 层级 */
    children?: any
    setDefaultName?: any
    globalProps: any,
    globalConfig: any,
    useResourceData: any,
    treeNodeProps: any,
    info: any
    setLoading?:React.Dispatch<React.SetStateAction<boolean>>
    activePageId?: string
    sendLog?:any
  }