import React from 'react'
import { useDesigner } from '@editor/react'
import { observer } from '@slides/reactive-react'
import { Dropdown, Modal } from 'antd'
import { useNodeGrouped, useNodeUnGrouped } from '../hooks/useMarkNodeGroup'

const { confirm } = Modal;
export const ContextMenu = observer(
    (props) => {
        const engine = useDesigner()

        const [isShowGroup, makeGroup] = useNodeGrouped(engine)
        const [isShowUnGroup, makeUnGroup] = useNodeUnGrouped(engine)
        const unGroup = (e) => {
            confirm({
                title: '解组',
                content: '确定要解组吗？解组后编组相关动画会相应删除',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    makeUnGroup(e)
                }
              });
        }
        const items = [
        ];

        if (isShowGroup) {
            items.push({
                label: (
                    <div id="makeGroup" onClick={makeGroup}>
                        编组
                    </div>
                ),
                key: 'markGroup',
            })
        }

        if (isShowUnGroup) {
            items.push({
                label: (
                    <div id="makeUnGroup" onClick={(e) => unGroup(e)}>
                        解组
                    </div>
                ),
                key: 'markUnGroup',
            })
        }

        console.log('isShowGroup: ' + isShowGroup + ';  isShowUnGroup: ' + isShowUnGroup)

        return (
            <Dropdown menu={{ items }} trigger={['contextMenu']} disabled={!items.length}>
                {props.children}
            </Dropdown>
        )
    }
)