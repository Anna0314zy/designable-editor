import React, { useEffect, useRef } from 'react'
import Moveable,{MoveableProps} from 'react-moveable'
import Selecto from 'react-selecto'
import { observer } from '@slides/reactive-react'

import { flushSync } from 'react-dom'
import {
  useViewport,
  useSelectedNode,
  useWorkspace,
  useTree,
  useDesigner,
  useGlobalData,
} from '../hooks'
import { reaction } from '@slides/reactive'
import { MouseClickEvent, SelectNodeEvent } from '@editor/core/src/events'
import { Engine, TreeNode } from '@editor/core'
// import { useInstanceStore } from '@play/render'
export const moveable_class = 'ld_moveable-item'
export const not_moveable_class = 'ld_not-moveable-item'
export const group_class = 'ld_moveable-group-item'
export let groupRect =  null
const setNodeProps = (treeNode, styleInfo) => {
  if (treeNode) {
    treeNode.props.style = {
      ...(treeNode.props.style || {}),
      ...styleInfo,
    }
    if(treeNode.componentName === "Camera") {
      // 如果当前选中的 camer 组件 添加  x y 属性
      const regex = /translate\((\S+), (\S+)\)/;
      if(treeNode.props.style.transform) {
        const match = treeNode.props.style.transform.match(regex);
        treeNode.props.style.x = match[1];
        treeNode.props.style.y = match[2];
      }
    
    }
  }
  
}

// 判断两个数组是否相等
const isEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false
  }
  return arr1.every((item, index) => item === arr2[index])
}
interface MoveableContainerProps {
  setSettingTitle: React.Dispatch<React.SetStateAction<string>>
  ables:any
  moveableProps?: MoveableProps
}
export const MoveableContainer = observer(
  (props:MoveableContainerProps ) => {
    const moveableRef = useRef<Moveable>(null)
    const selectoRef = useRef<Selecto>(null)
    const viewPort = useViewport()
    const workspace = useWorkspace()
    const selectedNode = useSelectedNode()
    const tree = useTree()
    const selectedNodes = tree.operation.selection.selectedNodes
    let initialX = 0
    let initialY = 0
    let initialRotate = 0
    let lastRect = null
    const [targets, setTargets] = React.useState<
      Array<HTMLElement | SVGElement>
    >([])

    const viewportElement = viewPort.viewportElement

    const [selectIdList, setSelectIdList] = React.useState<Array<string>>([])

    const canvas_class = 'ld-viewport-canvas-wrapper'

    const canvasWrapper = viewportElement?.querySelector(`.${canvas_class}`) as
      | HTMLElement
      | SVGElement

    // const { instanceMap } = useInstanceStore()

    const useSelectEffect = (engine: Engine) => {
      // 监听大纲树
      engine.subscribeTo(MouseClickEvent, (event) => {
        const { target } = event.data
        const outlineEl = (target as HTMLElement)?.closest(`
                *[${engine.props.outlineNodeIdAttrName}]
                `)
        if (outlineEl) {
          const nodeId = outlineEl?.getAttribute(
            engine.props.outlineNodeIdAttrName
          )
          // 获取 node 元素
          const node = tree.findById(nodeId)
          // 如果为组，则进行特殊处理
          if (node.componentName === 'Group') {
            const ids = node.children.map(cn => cn.id)
            setSelectIdList(ids)
          } else {
            setSelectIdList([nodeId])
          }
        }
      })
      engine.subscribeTo(SelectNodeEvent, (event) => {
        const { data } = event
        const { source } = data
        const sourceId = (source as TreeNode[]).map((item) => item.id)
        const targetId = targets.map((item) => item.dataset.designerNodeId)
        // 触发了selectNodeEvent后选中的树节点不存在当前targets里
        const diff = sourceId.filter((item) => !targetId.includes(item))
        const diffNodes = diff.filter((id) => id !== tree.id)
        setSelectIdList(diffNodes)
      })
    }

    useDesigner((engine) => {
      useSelectEffect(engine)
    })

    const { viewportPercentage } = useGlobalData()
    // 画布缩放的时候，moveable视图强制更新
    useEffect(() => {
      if (moveableRef.current) {
        setTargets(()=>[])
        const nodes = selectedNodes.filter((node) => node)
        if (nodes.length === 0) {
          return null
        }
        const isRoot = selectedNodes.some((node) => node.id === node.root.id)
        if (!isRoot) {
          moveableRef.current.waitToChangeTarget().then(() => {
            moveableRef.current!.updateRect()
          })
        }
      }
    }, [viewportPercentage])

    useEffect(() => {
      if (selectIdList.some((id) => id === tree.id)) {
        setTargets([canvasWrapper])
      }
      if (viewportElement) {
        const targetList = selectIdList
          .map((id) => {
            return viewportElement.querySelector(
              `.${moveable_class}[data-designer-node-id="${id}"]`
            ) as HTMLElement | SVGElement
          })
          .filter((target) => target)
        if (!isEqual(targetList, targets)) {
          setTargets(targetList)
        }
      }
    }, [selectIdList])

    // 获取所有的元素包括画布
    const elementGuidelines = Array.from(
      viewportElement
        ? viewportElement.querySelectorAll(`.${moveable_class}`)
        : []
    ).concat(canvasWrapper)
    // const handleKeyDown = (e) => {
    //   if (e.key === 'Backspace' || e.key === 'Delete') {
    //     const target = e.target
    //     const dataset = target.dataset
    //     // 富文本编辑器中有焦点的时候删除键不删除节点
    //     if (Number(dataset.isFocused) !== 1) {
    //       removeSelectedNodes()
    //     }
    //   }
    // }
    useEffect(() => {
      // TODO：对页面中的焦点进行判断，如果焦点不在视口内，就不监听删除键
      // if(targets.length > 0) {
      //     document.addEventListener('keydown', handleKeyDown)
      // } else {
      //     document.removeEventListener('keydown', handleKeyDown)
      // }
      const moveableElementList = Array.from(
        viewPort.viewportElement?.querySelectorAll(`.${moveable_class}`)
      ) as (HTMLElement | SVGElement)[]
      moveableElementList.forEach((moveableElement) => {
        moveableElement.dataset.isSelect = '0'
        const nodeId = moveableElement.dataset.designerNodeId
        const node = tree.findById(nodeId)
        if (node) {
          node.props.isSelect = false
        }
      })
      const ids =
        targets
          .map((target) => {
            target.dataset.isSelect = '1'
            const nodeId = target.dataset.designerNodeId
            const node = tree.findById(nodeId)
            if (node) {
              node.props.isSelect = true
            }
            return target.dataset.designerNodeId
          })
          .filter((id) => id) || []
      // 为空数组时 batchSafeSelect 内部直接跳过了，导致选中节点 selectedNodes 未清空
      if (ids.length) {
        workspace.operation.selection.batchSafeSelect(ids)
      } else {
        workspace.operation.selection.clear()
        workspace.operation.selection.batchSafeSelect([tree.id])
      }
    }, [targets])

    useEffect(() => {
      const dispose = reaction(
        () => {
          return JSON.stringify(selectedNode?.props)
        },
        (newValue, oldValue) => {
          if (newValue !== oldValue) {
            console.log(
              'file: MoveableContainer.tsx:121 ~ dispose ~ newValue !== oldValue:',
              newValue !== oldValue
            )
          }
          // console.log('prototype Change', moveableRef)
        }
      )
      return dispose
    }, [selectedNode])

    // 属性设置面板title
    useEffect(() => {
      // console.log(props, 'propsdsamk')
      // 需要重新获取selectedNodes，因为selectedNodes可能变化不及时
      const selectedNodes = tree.operation.selection.selectedNodes
      const hasRoot = selectedNodes.some((node) => node.id === node.root.id)
      const settingTitle = !hasRoot
        ? 'panels.PropertySettings'
        : 'panels.CanvasSettings'
      props.setSettingTitle(settingTitle)
    }, [props, targets])
    const setGroupTransform = (groupNode, x, y) => {
      const rect = moveableRef.current.getRect()
      const {left, top, rotation} = rect
      initialX = initialX ? initialX : left / viewportPercentage
      initialY = initialY ? initialY : top / viewportPercentage
      const moveLeft = initialX + x;
      const moveTop = initialY + y;
      console.log(left / viewportPercentage, x ,777777)
      setNodeProps(groupNode, {
        transform: `translate(${moveLeft}px, ${moveTop}px) rotate(${rotation}deg)`,
      })
    }
    const setGroupTransform2 = (groupNode, rotate) => {
      const transform = groupNode.props.style.transform
      // const rotateMatch = groupNode.props.style.transform.match(/rotate\(([^)]+)\)/);
      const rect = moveableRef.current.getRect()
      const {rotation} = rect
      initialRotate = initialRotate !== 0 ? initialRotate : rotation
      console.log(initialRotate, rotate, 7777)
      
      setNodeProps(groupNode, {
        transform: transform.replace(/rotate\([^)]+\)/, `rotate(${initialRotate + rotate}deg)`),
      })
    }
    const setGroupTransform3 = (groupNode) => {
      // const transform = groupNode.props.style.transform
      // const rotateMatch = groupNode.props.style.transform.match(/rotate\(([^)]+)\)/);
      const rect = moveableRef.current.getRect()
      const {left, top, offsetHeight, offsetWidth ,rotation } = rect
      // const width = parseFloat(groupNode.props.style.width) * widthScale
      // const height = parseFloat(groupNode.props.style.height) * heightScale
      
      setNodeProps(groupNode, {
        width: offsetWidth / viewportPercentage,
        height: offsetHeight / viewportPercentage,
        transform: `translate(${left / viewportPercentage}px, ${top / viewportPercentage}px) rotate(${rotation}deg)`,
      })
    }
    const moveableProps = {
      edge: true,
      throttleDrag: 0,
      onDrag: ({ target, style }) => {
        const node = tree.findById(target!.dataset.designerNodeId)
        if (node.parent.componentName === 'Group') return
        const transformValue = style.transform.replace(
          /[-+]?[0-9]*\.?[0-9]+/g,
          (match) => {
            return Math.round(parseFloat(match))
          }
        )
        target!.style.transform = transformValue
        setNodeProps(node, {
          transform: transformValue,
        })
      },
      throttleResize: 0,
      onResize: ({ target, width, height, delta, drag }) => {
        const node = tree.findById(target!.dataset.designerNodeId)
        if (node.parent.componentName === 'Group') return
        const roundedWidth = Math.round(width)
        const roundedHeight = Math.round(height)
        const transformValue = drag.transform.replace(
          /[-+]?[0-9]*\.?[0-9]+/g,
          (match) => {
            return Math.round(parseFloat(match))
          }
        )
        target.style.transform = transformValue
        delta[0] && (target!.style.width = `${roundedWidth}px`)
        delta[1] && (target!.style.height = `${roundedHeight}px`)
        setNodeProps(node, {
          width: `${roundedWidth}px`,
          height: `${roundedHeight}px`,
          transform: transformValue,
        })
      },

      scalable: false,
      throttleRotate: 0,
      onRotate: ({ target, style }) => {
        const transformValue = style.transform.replace(
          /translate\((-?\d+\.?\d*)px, (-?\d+\.?\d*)px\)|rotate\((-?\d+\.?\d*)deg\)/g,
          (match, x, y, d) => {
            if (x != null && y != null) {
              return `translate(${Math.round(parseFloat(x))}px, ${Math.round(
                parseFloat(y)
              )}px)`
            } else if (d != null) {
              return `rotate(${Math.round(parseFloat(d))}deg)`
            }
          }
        )
        target!.style.transform = transformValue
        setNodeProps(tree.findById(target!.dataset.designerNodeId), {
          transform: transformValue,
        })
      },
      pinchable: false,
      snappable: true,
      snapDirections: {
        top: true,
        left: true,
        bottom: true,
        right: true,
        center: true,
        middle: true,
      },

      snapThreshold: 5,
      onDragGroup: (e) => {
        let hasChanged = false
        for (let ev of e.events) {
          const { left, top } = ev
          const parentEl = ev.target.parentElement.parentElement
          if (parentEl.closest(`.${group_class}`)) {
            if (!hasChanged) {
              setGroupTransform(tree.findById(parentEl.dataset.designerNodeId), left, top)
              hasChanged  =true
            } else {
              continue
            }
          } else {
            ev.target.style.transform = ev.transform
            setNodeProps(tree.findById(ev.target!.dataset.designerNodeId), {
              transform: ev.transform,
            })
          }
        }
      },
      onDragGroupEnd: () => {
        initialX = 0
        initialY = 0
      },
      onResizeGroupStart: ({ setMin, setMax }) => {
        setMin([0, 0])
        setMax([0, 0])
      },
      onResizeGroup: (e) => {
        console.log(e, moveableRef.current.getRect(), 989898)
        lastRect = lastRect ? lastRect : moveableRef.current.getRect()
        e.events.forEach((ev) => {
          ev.target.style.width = `${ev.width}px`
          ev.target.style.height = `${ev.height}px`
          ev.target.style.transform = ev.drag.transform
          setNodeProps(tree.findById(ev.target!.dataset.designerNodeId), {
            width: `${ev.width}px`,
            height: `${ev.height}px`,
            transform: ev.drag.transform,
          })
        })
        // setGroupTransform3(tree.findById(parentEl.dataset.designerNodeId), left, top, widthScale, heightScale)
      },
      onResizeGroupEnd: (e) => {
        const parentEl = e.events[0].target.parentElement.parentElement
        if (parentEl.closest(`.${group_class}`)) {
          setGroupTransform3(tree.findById(parentEl.dataset.designerNodeId))
        }
        if (lastRect) {
          const rect = moveableRef.current.getRect()
          const moveLeft = rect.left - lastRect.left
          const moveTop = rect.top - lastRect.top
          e.events.forEach((ev) => {
            // ev.target.style.width = `${ev.width}px`
            // ev.target.style.height = `${ev.height}px`
            const transformMatch = ev.lastEvent.transform.match(/translate\(([^,]+),([^)]+)\)/)
            const left = parseFloat(transformMatch[1]) - moveLeft / viewportPercentage
            const top = parseFloat(transformMatch[2]) - moveTop / viewportPercentage
            const transform = ev.lastEvent.transform.replace(/translate\(-?\d+(\.\d+)?px,\s*-?\d+(\.\d+)?px\)/, `translate(${left}px, ${top}px)`);
            ev.target.style.transform = transform

            setNodeProps(tree.findById(ev.target!.dataset.designerNodeId), {
              // width: `${ev.width}px`,
              // height: `${ev.height}px`,
              transform: transform,
            })
          })
        }
        lastRect = null
      },
      onRotateGroup: (e) => {
        console.log(e.events[0], moveableRef.current.getRect().rotation, 7777)
        const parentEl = e.events[0].target.parentElement.parentElement
        const { rotate } = e.events[0]
        setGroupTransform2(tree.findById(parentEl.dataset.designerNodeId), rotate)
      },
      onRotateGroupEnd: () => {
        initialRotate = 0
      },
      ...props.moveableProps,
      minWidth: 202,
      maxWidth: 500
    }
    return (
      <>
        <Moveable
          ables={props.ables}
          props={{
            editable: true,
          }}
          target={targets}
          origin={false}
          ref={moveableRef}
          flushSync={flushSync}
          snapContainer={viewportElement}
          elementGuidelines={elementGuidelines}
          horizontalGuidelines={[0, '25%', '50%', '75%', '100%']}
          verticalGuidelines={[0, '25%', '50%', '75%', '100%']}
          useResizeObserver={true}
          useMutationObserver={true}
          scrollable={true}
          {...moveableProps}
        />
        <Selecto
          ref={selectoRef}
          selectableTargets={[`.${moveable_class}`]}
          hitRate={0}
          selectByClick={true}
          selectFromInside={false}
          toggleContinueSelect={['shift']}
          ratio={0}
          dragContainer={'.ld-viewport'}
          keyContainer={window}
          onDragStart={(e: any) => {
            const target = e.inputEvent.target
            const isMoveable = target.classList.contains(moveable_class)
            if (
              (moveableRef.current!.isMoveableElement(target) && !isMoveable) ||
              targets!.some((t) => t === target || t.contains(target))
            ) {
              e.stop()
            }
          }}
          onSelectEnd={(e) => {
            setTimeout(() => {
              groupRect = moveableRef.current.getRect()
            })
            if (e.isDragStartEnd) {
              e.inputEvent.preventDefault()
              moveableRef.current!.waitToChangeTarget().then(() => {
                moveableRef.current!.dragStart(e.inputEvent)
              })
            }

            if (['makeGroup', 'makeUnGroup'].includes(e.inputEvent.target.id)) {
              // 编组 或 解组后 选中状态会清空
              window.setTimeout(() => {
                setTargets([])
              }, 200)
              return
            }

            if (e.inputEvent.shiftKey) {
              setTargets(e.selected)
            } else if (e.inputEvent.ctrlKey) {
              setTargets(e.selected)
            } else {
              const result = new Set<HTMLElement | SVGElement>();
              // 组合数据整合
              [...e.selected].forEach((el) => {
                const groupEl:HTMLElement | SVGElement = el.closest(`.${moveable_class}.${group_class}`)
                if (groupEl) {
                  const children = Array.from(
                    groupEl.querySelectorAll(`.${moveable_class}`)
                  ) as (HTMLElement | SVGElement)[]
                  for (const child of children) {
                    result.add(child)
                  }
                } else {
                  result.add(el)
                }
              })

              setTargets([...result])
            }
          }}
        />
      </>
    )
  }
)
