import React from 'react'
import { observer } from '@slides/reactive-react'
import { usePrefix } from '../../hooks'
import cls from 'classnames'
export interface IPageTypeLabelWidgetProps {
    rootProps?: Record<string, any>
}
export const PageTypeLabelWidget: React.FC<IPageTypeLabelWidgetProps> =
    observer((props: IPageTypeLabelWidgetProps) => {
        const {rootProps} = props
        const {info}=rootProps
        const prefix = usePrefix('page-type-label')
        return (
            <div className={cls(prefix,'preview-type-label')}>{info.type}</div>
        )
    })