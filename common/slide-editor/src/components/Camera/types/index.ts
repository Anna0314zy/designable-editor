export enum CameraType {
    teacher = '1',
    student = '2',
}

export interface IComponentProps {
    useConnect?: any
    // useReport?: any
    /** 组件ID */
    id: string
    /** 页面ID */
    // pageId: string
    /** 组件样式 */
    style?: any
    /** 组件标题 */
    // title?: string
    /** 层级 */
    // children?: any
    treeNodeProps?: any,
    setDefaultName: any,
    mode?: string
    type: CameraType
    getStyle?: (args: any) => void
}
