import { useCallback } from "react";
import { UnMakeGroupNodeEvent, MakeGroupNodeEvent } from "@editor/core";
import { Engine, TreeNode } from "@editor/core";
import {groupRect} from '@editor/react/src/containers/MoveableContainer'
import { useGlobalData } from '@editor/react'


export const useNodeGrouped = (engine: Engine) => {
  const { viewportPercentage } = useGlobalData()
  const isShowGroup = (() => {
    const currentWorkspace = engine.workbench.currentWorkspace;
    const selection = currentWorkspace.operation.selection;
    const selectedNodes = selection.selectedNodes;

    return (
      selectedNodes &&
      selectedNodes.length > 1 &&
      selectedNodes.every((node) => {
        return node && node.componentName !== "Group" && node.depth === 1;
      })
    );
  })();

  const makeGroup = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      const currentWorkspace = engine.workbench.currentWorkspace;
      const rootTreeNode = currentWorkspace.operation.tree;

      const sourceNodes = [engine.findNodeById("mark_group_source_id")];
      const selection = currentWorkspace.operation.selection;
      const selectedNodes = selection.selectedNodes;

      if (rootTreeNode.allowAppend(sourceNodes)) {
        const newTreeNode = rootTreeNode.append(
          ...TreeNode.filterDroppable(sourceNodes, rootTreeNode)
        )[0];

        if (newTreeNode.allowAppend(selectedNodes)) {
          newTreeNode.append(...selectedNodes);
        }
        currentWorkspace.operation.dispatch(
          new MakeGroupNodeEvent({
            target: newTreeNode,
            source: selectedNodes,
          })
        );
        const left = groupRect.left / viewportPercentage
        const top = groupRect.top / viewportPercentage
        // const rotation = groupRect.rotation / viewportPercentage
        // const rect: any = document.getElementsByClassName('moveable-area')[0]
        const style = {
          width: (groupRect.offsetWidth / viewportPercentage) + 'px',
          height: (groupRect.offsetHeight / viewportPercentage) + 'px',
          transform: `translate(${left}px, ${top}px) rotate(${groupRect.rotation}deg)`,
        }
        newTreeNode.setProps({
          style
        })
        selectedNodes.forEach(node => {
          const matchResult = node.props.style.transform.match(/translate\(([^,]+),([^)]+)\)/);
          const matchResult2 = node.props.style.transform.match(/rotate\(([^)]+)\)/);
          const rotate = parseFloat(matchResult2[1])
          const offsetX = parseFloat(matchResult[1]) - left;
          const offsetY = parseFloat(matchResult[2]) - top;
          node.setProps({
            style: {
              ...node.props.style,
              transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotate - groupRect.rotation}deg)`
            }
          })
        })
        // 分组之后，对于分组下元素进行再次全选处理
        selection.batchSafeSelect(selectedNodes)
      }
    },
    [engine, viewportPercentage]
  );

  return [isShowGroup, makeGroup] as const;
};

export const useNodeUnGrouped = (engine: Engine) => {
  const isShowUnGroup = (() => {
    const currentWorkspace = engine.workbench.currentWorkspace;
    const selection = currentWorkspace.operation.selection;
    const selectedNodes = selection.selectedNodes;

    if (selectedNodes && selectedNodes.length) {
      const parent = selectedNodes[0].parent;
      return (
        parent &&
        !parent.isRoot &&
        selectedNodes.every((n) => n.parent === parent)
      );
    }
    return false;
  })();
  // // 使用勾股定理计算斜边长度
  // const calculateHypotenuse = (a, b) => {
  //   return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
  // }
  // // 将角度转换为弧度
  // const degreesToRadians = (degrees) => {
  //   return degrees * (Math.PI / 180);
  // }

  // // 计算弦长
  // const chordLength = (radius, angleDegrees) => {
  //   const angleRadians = degreesToRadians(angleDegrees);
  //   return 2 * radius * Math.sin(angleRadians / 2);
  // }

  // // 计算直角边长度
  // const sideLengths = (radius, chordLength) => {
  //   const a = chordLength / 2 - Math.sqrt(Math.pow(radius, 2) - Math.pow(chordLength / 2, 2));
  //   const b = Math.sqrt(Math.pow(radius, 2) - Math.pow(chordLength / 2, 2));
  //   return { x: a, y: b };
  // }
  const makeUnGroup = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      const currentWorkspace = engine.workbench.currentWorkspace;
      const rootTreeNode = currentWorkspace.operation.tree;

      const selection = currentWorkspace.operation.selection;
      const selectedNodes = selection.selectedNodes;
      const parent = selectedNodes[0].parent;
      //  删除解组后的动画
      let animateList = [...currentWorkspace.operation.tree.props.animates]
      if (animateList && parent.componentName === 'Group') {
        animateList = animateList.filter(ani => ani.target !== parent.id && ani.triggerSource !== parent.id)
        currentWorkspace.operation.tree.setProps({
          animates: animateList
        })
      }
      if (
        rootTreeNode.allowAppend(selectedNodes) &&
        parent.componentName === "Group"
      ) {
        const childNode = parent.children;
        rootTreeNode.append(...childNode);
        parent.remove();
        currentWorkspace.operation.dispatch(
          new UnMakeGroupNodeEvent({
            target: parent,
            source: selectedNodes,
          })
        );
        // 把内部子组件恢复到编组前的位置
        const parentMatch = parent.props.style.transform.match(/translate\(([^,]+),([^)]+)\)/);
        const parentMatch2 = parent.props.style.transform.match(/rotate\(([^)]+)\)/);
        const parentRotate = parseFloat(parentMatch2[1])
        // const 
        selectedNodes.forEach(node => {
          const matchResult = node.props.style.transform.match(/translate\(([^,]+),([^)]+)\)/);
          const matchResult2 = node.props.style.transform.match(/rotate\(([^)]+)\)/);
          const rotate = parseFloat(matchResult2[1])
          const offsetX = parseFloat(matchResult[1]) + parseFloat(parentMatch[1]);
          const offsetY = parseFloat(matchResult[2]) + parseFloat(parentMatch[2]);
          node.setProps({
            style: {
              ...node.props.style,
              transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotate + parentRotate}deg)`
            }
          })
        })
        // 解除分组，之后直接去除选中
        selection.batchSafeSelect([parent.getRootNode()])
      }
    },
    [engine.workbench.currentWorkspace]
  );

  return [isShowUnGroup, makeUnGroup] as const;
};
