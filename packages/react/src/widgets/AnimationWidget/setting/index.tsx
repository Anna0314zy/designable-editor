import { TreeNode, ITreeNode } from '@editor/core'
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { AnimationType, animations, IAnimation, AnimationTrigger, AnimationDirection, AnimationTypeMap, IAnimate } from '@slides/animate'
import { uid } from '@editor/shared'
import { useWorkbench } from "../../../hooks";
import { useInstanceStore } from '@play/render'
import { AnimateSettingWidget } from './animateSetting'
import { Dropdown, Space, Collapse, Button, Popconfirm, Modal, message } from 'antd';
import { DownOutlined,PlayCircleOutlined, MenuOutlined, DeleteOutlined } from '@ant-design/icons';
import type { MenuProps, CollapseProps } from 'antd';
import { observer } from '@slides/reactive-react'
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';

interface SettingWidgetProps {
    node: TreeNode
    childrenNodes: ITreeNode[]
    page: TreeNode
    tree: TreeNode
}
export const SettingWidget: React.FC<SettingWidgetProps> = observer((props) => {
    const { node, childrenNodes, page, tree } = props
    const isShowAddBtn = useMemo(() => {
        return node && !['Root','Game','Video','Camera'].includes(node.componentName);
    }, [node]);
    // 获取是否存在动画，不存在则不需要展示动画组件
    // 插入组件后，当前组件内部维护数据，不需要同步到全局
    // 选中组件后，可以设置动画
    // 动画组件的设置面板，可以设置动画的属性
    const workbench = useWorkbench()
    const { instanceMap } = useInstanceStore()
    const [focus, setFocus] = useState('')
    const currentWorkspace = workbench?.activeWorkspace || workbench?.currentWorkspace
    let pageAnimates: IAnimate[] = (page.props.animates || [])
    const [openCard, setOpenCard] = useState(null);
    const [animateGroup, setAnimateGroup] = useState([]);
    // 获取当前节点上的动画，这里不需要判断是什么节点，如果是根节点，那么就是页面的动画，如果是组件节点，那么就是组件的动画，为了后续做拓展，暂时不做限制

    // 如果没有动画，那么就不需要展示动画组件
    // TODO: 当前页面不需要动画，留着口子，后续再做拓展
    const addAnimate = (animate: IAnimation, key: AnimationType) => {
        let groups = [...animateGroup]
        let index = groups.findIndex(ani => ani[0].triggerSource === 'workspace') // 找到分组
        const newId = uid()
        const animateItem: IAnimate = {
            id: newId,
            target: node.id,
            trigger: AnimationTrigger.Click,
            triggerSource: 'workspace',
            type: key,
            duration: 0.5,
            delay: 0,
            direction: AnimationDirection.General,
            name: animate.value
        }
        index >= 0 ? groups[index].push({
            ...animateItem
        }) : groups.push({
            ...animateItem
        })
        page.setProps({
            animates: groups.flat()
        })
        // 当前新增默认打开
        setOpenCard(newId)
    }

    const animateTypes: MenuProps['items'] = Object.keys(animations).map((key) => {
        return {
            label: AnimationTypeMap[key],
            key,
            children: animations[key].map((animate) => {
                return {
                    label: animate.name,
                    key: animate.value
                }
            })
        }
    })

    const handleChange = (e: any) => {
        Object.keys(animations).forEach((key: AnimationType) => {
            animations[key].forEach((animate: IAnimation) => {
                if (animate.value === e.key) {
                    addAnimate(animate, key)
                }
            })
        })
    }

    const handleDelete = (event, animate: IAnimate) => {
        event.stopPropagation()
        const { confirm } = Modal;
        confirm({
            title: '删除动画',
            content: '确定删除此动画吗？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                const arr = [...page.props.animates]
                const index = arr.findIndex(ani => ani.id === animate.id)
                arr.splice(index, 1)
                page.setProps({
                    animates: arr
                })
                message.success('删除成功！')
            }
          });
        
    }
    const handlePreview = (event, animate) => {
        event.stopPropagation()
        const node = tree.findById(animate.target)
        currentWorkspace?.operation.animateEngine.preview(node, animate)
    }
    const clickNode = (id) => {
        const animate = pageAnimates.find(ani => ani.id === id)
        const operation = workbench.activeWorkspace.operation
        const node = tree.findById(animate.target)
        const selection = operation.selection
        animate && selection.batchSafeSelect(node.componentName === "Group" ? node.children : [node])
        setOpenCard(openCard === id ? null : id);
    }
    const onDragEnd = ({newIndex, oldIndex, collection}) => {
        if (newIndex === oldIndex) return
        const groups = [...animateGroup]
        let index = groups.findIndex(ani => ani[0].triggerSource === collection) // 找到分组
        const animates = groups[index]
        const removedElement = animates.splice(oldIndex, 1)
        animates.splice(newIndex, 0, removedElement[0]) // 设置animates顺序
        groups[index] = animates
        setAnimateGroup(groups)
        console.log(groups.flat())
        page.setProps({
            animates: groups.flat()
        })
    }

    const DragHandle = SortableHandle(() => <MenuOutlined />);
    const SortableItem = SortableElement(({value}) => {
        console.log(value)
        const animate = value
        const openAnimate = pageAnimates.find(ani => ani.id === openCard)
        return <li>
            <p className="ani-title" onClick={() => clickNode(animate.id)}>
                <DragHandle/>
                {`${AnimationTypeMap[animate.type]} - ${animations[animate.type].find(ani => ani.value === animate.name).name}`}
                <Button type="text" shape="circle" icon={<DeleteOutlined onClick={(e) => handleDelete(e, animate)}/>} size={'small'} />
                <Button type="text" shape="circle" icon={<PlayCircleOutlined onClick={(e) => handlePreview(e, animate)}/>} size={'small'} />
                
            </p>
            <AnimateSettingWidget
                show={openCard === animate.id}
                key={animate.id}
                animate={animate}
                childrenNodes={childrenNodes}
                tree={tree}
                openAnimate={openAnimate}
                updateAnimate={updateAnimate}
                page={page}
                setFocusEvent={setFocus}
                focus={focus}
            />
        </li>
    });
    const updateAnimate = () => {
        console.log(page.props.animates, 'iii')
        const result = page.props.animates.reduce((group, animate) => {
            const foundIndex = group.findIndex(group => group[0].triggerSource === animate.triggerSource);
            if (foundIndex !== -1) {
                group[foundIndex].push(animate);
            } else if (animate.triggerSource === 'workspace') {
                group.unshift([animate]);
            } else {
                group.push([animate]);
            }
            return group;
        }, []);
        setAnimateGroup(result)
    }
    useEffect(() => {
        page.props.animates && updateAnimate()
    }, [page.props.animates])
    const SortableList = SortableContainer(({children}) => {
        return <div className='drag-container'>{children}</div>;
    });
    return (
        <>
            {isShowAddBtn && <Dropdown menu={{ items: animateTypes, onClick: handleChange }}>
                <Button type="link" onClick={(e) => {
                    e.preventDefault();
                }} className="select-ani" >
                        选择动画 <DownOutlined />
                </Button>
            </Dropdown>}
            <SortableList useDragHandle helperClass="sortable-container" onSortEnd={onDragEnd}>
                {
                    animateGroup.map((items, index) => {
                        const targetNode = childrenNodes.find(item => item.id === items[0]['triggerSource'])
                        const name = targetNode ? targetNode['props']['info']?.name : ''
                        return <div key={index}>
                            <h3>{items[0]['triggerSource'] === 'workspace' ? '画布' : name}</h3>
                            <ul className="ani-list">
                                {items.map((animate: any, i: number) => (
                                    <SortableItem key={`${animate.id}`} index={i} value={animate} collection={animate.triggerSource}/>
                                ))}
                            </ul>
                        </div>
                    })
                }
            </SortableList>
    </>
    )
})