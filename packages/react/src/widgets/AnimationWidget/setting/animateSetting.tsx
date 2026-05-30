import React, { useEffect, useState } from "react";
import { AnimationTrigger, animations, AnimationDirectionMap, IAnimate } from '@slides/animate'
// import { useTree, useWorkbench } from "../../../hooks";
import { ITreeNode, TreeNode } from '@editor/core'
import { Select, Segmented, InputNumber } from 'antd';
import './styles.less'


interface IAnimateProps {
    animate: IAnimate
    childrenNodes: ITreeNode[]
    tree: TreeNode,
    show: boolean,
    updateAnimate?: any,
    openAnimate: any,
    page: any,
    setFocusEvent: any,
    focus: string
}

export const AnimateSettingWidget: React.FC<IAnimateProps> = ({ animate, childrenNodes, tree, show, updateAnimate, openAnimate, page, setFocusEvent, focus }) => {
    const animateConfig = animations[animate.type].find((config) => config.value === animate.name)
    console.log(animate)
    if (!animateConfig) {
        return null
    }
    const update = (value, type) => {
        console.log(value, type)
        const animates = page.props.animates
        animates.map(item => {
            if (item.id === openAnimate.id) {
                item[type] = value
            }
            return item
        })
        page.setProps({
            animates
        })
        updateAnimate()
        setFocusEvent(type)
    }
    const Direction: React.FC = () => {
        // const [direction, setDirection] = useState<any>(animate.direction)
        const animateDirection = animateConfig?.directions
        if (!Array.isArray(animateDirection)) {
            return null
        }
        const animateDirections = animateDirection.map((direction) => {
            return {
                label: AnimationDirectionMap[direction.key],
                value: direction.key
            }
        })
        if (animateDirection) {
            return (
                <div className="ani-form">
                    <label>方向</label>
                    <Segmented
                        value={animate.direction}
                        options={animateDirections}
                        onChange={(value) => update(value, 'direction')}
                    />
                </div>
            )
        }
    }

    const Trigger: React.FC = () => {

        const animateTriggers = [
            {
                label: '单击时',
                value: AnimationTrigger.Click
            },
            {
                label: '自动播放',
                value: AnimationTrigger.Auto
            }, 
            {
                label: '与上一个动画同时',
                value: AnimationTrigger.Parallel
            },
            {
                label: "上一个动画之后",
                value: AnimationTrigger.Serial
            }
        ]

        return (
            <>
            <div className="ani-form">
                <label>起始</label>
                <div className="detail">
                    <Select defaultValue={animate.trigger} style={{ width: 167 }} onChange={(value) => update(value, 'trigger')} options={animateTriggers} />
                </div>
            </div>
            </>
        )
    }

    const TriggerSource: React.FC = () => {
        const animateTriggerSources = childrenNodes.map((treeNode: ITreeNode) => {
            return {
                label: treeNode.props?.info?.name || treeNode.props.title,
                value: treeNode.id
            }
        })
            .filter((treeNode) => treeNode.value !== animate.target)

        // TODO: 代码优化
        animateTriggerSources.unshift({
            label: '画布',
            value: 'workspace'
        })
        if (animateTriggerSources) {
            return (
                <div className="ani-form">
                <label>触发</label>
                <Select defaultValue={animate.triggerSource} style={{ width: 167 }} onChange={(value) => update(value, 'triggerSource')} options={animateTriggerSources} />
                </div>
            )
        }
    }
    const Duration: React.FC = () => <div className="ani-form">
        <label>持续时长</label> <div><InputNumber min={0} max={10} autoFocus={focus === 'duration'} value={animate.duration} onChange={(count) => update(count, 'duration')} />秒</div>
     </div>

    const Delay: React.FC = () => <div className="ani-form">
        <label>延迟时间</label> <div><InputNumber min={0} max={10} autoFocus={focus === 'delay'} value={animate.delay} onChange={(count) => update(count, 'delay')}></InputNumber>秒</div>
    </div>

    return (
        <div className="extend-container" style={{display: show ? 'block': 'none'}}>
            <Direction />
            <Trigger />
            <TriggerSource />
            <Duration />
            <Delay />
        </div>
    )
}