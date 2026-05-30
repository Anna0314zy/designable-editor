import React, {Fragment, useEffect} from 'react'
import { useField, Field, observer } from '@slides/react'
import { useTree } from '@editor/react'
import { Input } from '@slides/antd'
import { FoldItem } from '../FoldItem'
import { InputItems } from '../InputItems'
import { Label } from '../Label'
import { useWorkbench } from '@editor/react'

export enum PageType {
	normalPage = 1,
	gamePage = 2,
	videoPage = 3,
}

export const PageTypeLabel = [
	{
		label: "课件页",
		key: PageType.normalPage,
	},
	{
		label: "游戏页",
		key: PageType.gamePage,
	},
	{
		label: "视频页",
		key: PageType.videoPage,
	},
];

export const CanvasSetter: React.FC = observer((props) => {
    const workbench = useWorkbench()
    const currentWorkspace =
      workbench?.activeWorkspace || workbench?.currentWorkspace
    const pageTypeItem = PageTypeLabel.filter(item => Number(item.key) === Number(currentWorkspace.pageType))

    const root = useTree()
    if(root && root.props && root.props.info) {
        root.props.info.type = pageTypeItem.length > 0 ? pageTypeItem[0]['label'] : '课件页'
    }
    const field = useField()
    useEffect(()=>{},[])
    return (
        <Fragment>
            <FoldItem label={field.title.name}>
                <FoldItem.Base>
                    <InputItems>
                        <InputItems.Item>
                            <Field
                                name="name"
                                component={[Input,{placeholder: root?.props?.info?.name}]}
                            />
                        </InputItems.Item>
                    </InputItems>
                </FoldItem.Base>
            </FoldItem>
            <FoldItem label={field.title.type}>
                <FoldItem.Base>
                    <Label value={root?.props?.info?.type} />
                </FoldItem.Base>
            </FoldItem>
        </Fragment>
    )
})
