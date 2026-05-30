import { useEffect, useMemo, useState } from "react";
import { moveable_class } from "@editor/react";

import {
	Engine,
	SelectNodeEvent,
	ContextMenuEvent,
	SwitchWorkspaceEvent,
} from "@editor/core";

function debounce(fn, delay) {
	let timer = null;
	return function (...args) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			fn(...args);
		}, delay);
	};
}

const setNodeProps = debounce((node, styleInfo) => {
	console.log('setNodeProps', node, styleInfo)
	node.props.style = {
		...(node.props.style || {}),
		...styleInfo
	}
}, 500)

export const useMovableControl = (engine: Engine, moveableContainerRef, settingFormRef) => {
	const [targetType, setTargetType] = useState('image')
	const [target, setTarget] = useState([])

	useEffect(() => {
		engine.subscribeTo(SelectNodeEvent, () => {
			const nodes = engine.getAllSelectedNodes()
			// const nodeSet = new Set<TreeNode>();
			// const groupNameSet = new Set();

			// nodes.forEach((item) => {
			// 	const element = engine.workbench.activeWorkspace.viewport.findElementById(item.id)

			// 	if (element && element.classList.contains(`${moveable_class}`)) {
			// 		nodeSet.add(item)

			// 		if (item.props.group) {
			// 			groupNameSet.add(item.props.group)
			// 		}
			// 	}
			// })

			// if (groupNameSet.size && engine.workbench.activeWorkspace) {
			// 	const tree = engine.workbench.activeWorkspace.operation.tree;
			// 	let isNeedAddGroupItem = false

			// 	tree.eachTree((node) => {
			// 		if (node.props.group && groupNameSet.has(node.props.group)) {
			// 			if (!nodeSet.has(node)) {
			// 				isNeedAddGroupItem = true;
			// 				nodeSet.add(node)
			// 			}
			// 		}
			// 	})

			// 	if (isNeedAddGroupItem) {
			// 		engine.workbench.activeWorkspace.operation.selection.batchSafeSelect([...nodeSet].map(item => item.id));
			// 	}
			// }

			const targetList = [...nodes].reduce((acc, node) => {
				const dom = engine.workbench.activeWorkspace.viewport.findElementById(node.id);

				if (dom && dom.classList.contains(`${moveable_class}`)) {
					dom.node = node;
					acc.push(dom);
				}

				return acc;
			}, [])

			setTarget(targetList)
			if (targetList.length === 1) {
				setTargetType('table')
			}

			console.log('targetList: ', targetList)
		})

		engine.subscribeTo(SwitchWorkspaceEvent, () => {
			setTarget([])
		})

		engine.subscribeTo(ContextMenuEvent, () => {
			console.log('ContextMenuEvent')
		})
	}, [engine, moveableContainerRef])

	const moveableProps = useMemo(() => {
		return {
			// 移动的目标
			target,

			/* Resize event edges */
			edge: targetType === 'table' ? true : false,

			/* draggable */
			draggable: targetType === 'table' ? true : false,

			throttleDrag: 0,

			// onDragStart: (info) => {
			// 	console.log("onDragStart", info);
			// },
			onDrag: ({
				target,
				style
			}) => {
				// const roundedLeft = Math.round(left);
				// const roundedTop = Math.round(top);
				const transformValue = style.transform.replace(/[-+]?[0-9]*\.?[0-9]+/g, match => {
					return Math.round(parseFloat(match));
				});
				target!.style.transform = transformValue;

				console.log('transformValue: ', transformValue)
				setNodeProps(target.node, { transform: transformValue })


				// if (target!.node.style) {
				// 	target!.node.style.transform = transformValue;
				// } else {
				// 	target!.node.style = {
				// 		transform: transformValue
				// 	}
				// }
				// 
				// settingFormRef.current.setValues({ style: { transform: transformValue } })
				// target!.style.left = `${roundedLeft}px`;
				// target!.style.top = `${roundedTop}px`;

			},
			// onDragEnd: (info) => {
			// 	console.log("onDragEnd", target, info);
			// },

			/* When resize or scale, keeps a ratio of the width, height. */
			keepRatio: false,

			/* resizable*/
			/* Only one of resizable, scalable, warpable can be used. */
			resizable: true,
			throttleResize: 0,
			// onResizeStart: (info) => {
			// 	console.log("onResizeStart", info);
			// },
			onResize: ({
				target, width, height, delta
			}) => {
				const roundedWidth = Math.round(width);
				const roundedHeight = Math.round(height);
				delta[0] && (target!.style.width = `${roundedWidth}px`);
				delta[1] && (target!.style.height = `${roundedHeight}px`);
				setNodeProps(target.node, { width: `${roundedWidth}px`, height: `${roundedHeight}px` })
			},
			// onResizeEnd: (info) => {
			// 	console.log("onResizeEnd", target, info);
			// },

			/* scalable */
			/* Only one of resizable, scalable, warpable can be used. */
			scalable: false,

			/* rotatable */
			rotatable: true,
			throttleRotate: 0,

			// onRotateStart: (info) => {
			// 	console.log("onRotateStart", info);
			// },
			// onRotate: (info) => {
			// 	console.log("onRotate", info);
			// 	info.target!.style.rotate = info.absoluteRotate + 'deg'
			// 	info.target!.style.transform = 'translate(0px, 0px)';
			// },
			onRotate: ({
				target,
				style
			}) => {
				const transformValue = style.transform.replace(/translate\((-?\d+\.?\d*)px, (-?\d+\.?\d*)px\)|rotate\((-?\d+\.?\d*)deg\)/g, (match, x, y, d) => {
					if (x != null && y != null) {
						return `translate(${Math.round(parseFloat(x))}px, ${Math.round(parseFloat(y))}px)`;
					} else if (d != null) {
						return `rotate(${Math.round(parseFloat(d))}deg)`;
					}
				});
				// console.log("onRotate", dist);
				target!.style.transform = transformValue;
				setNodeProps(target.node, { transform: transformValue })
			},

			// onRotateEnd: (info) => {
			// 	console.log("onRotateEnd", info);
			// },

			// Enabling pinchable lets you use events that
			// can be used in draggable, resizable, scalable, and rotateable.
			pinchable: false,

			// onPinchStart: (info) => {
			// 	// pinchStart event occur before dragStart, rotateStart, scaleStart, resizeStart
			// 	console.log("onPinchStart", info);
			// },
			// onPinch: (info) => {
			// 	// pinch event occur before drag, rotate, scale, resize
			// 	console.log("onPinch", info);
			// },
			// onPinchEnd: (info) => {
			// 	// pinchEnd event occur before dragEnd, rotateEnd, scaleEnd, resizeEnd
			// 	console.log("onPinchEnd", info);
			// },

			/* snappable */
			snappable: true,

			snapDirections: { "top": true, "left": true, "bottom": true, "right": true, "center": true, "middle": true },

			elementSnapDirections: { "top": true, "left": true, "bottom": true, "right": true },

			onDragGroup: ({ events }) => {
				events.forEach(ev => {
					ev.target.style.transform = ev.transform;
				});
			},
			onResizeGroupStart: ({ setMin, setMax }) => {
				setMin([0, 0]);
				setMax([0, 0]);
			},
			onResizeGroup: ({ events }) => {
				events.forEach(ev => {
					ev.target.style.width = `${ev.width}px`;
					ev.target.style.height = `${ev.height}px`;
					ev.target.style.transform = ev.drag.transform;
				});
			},
			onRotateGroup: ({ events }) => {
				events.forEach(ev => {
					ev.target.style.transform = ev.drag.transform;
				});
			},
		}
	}, [targetType, target])

	return { moveableProps, target }
}