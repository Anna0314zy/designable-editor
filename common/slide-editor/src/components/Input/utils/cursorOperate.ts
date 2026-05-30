/*
 * @Date: 2023-12-05 10:02:56
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-01-11 16:49:46
 * @FilePath: /slides-engine/common/slide-editor/src/components/Input/utils/cursorOperate.ts
 */
import {Editor, Element, Text, Range} from 'slate'

/**
 * @description: 获取编辑器中总字符长度 
 * @param {*} nodes
 * @return {*} number
 */
export const GET_EDITOR_TEXT_LENGTH = (nodes) => {
    return nodes.reduce((length, node) => {
      if (Text.isText(node)) {
        return length + node.text.length;
      } else if (Element.isElement(node)) {
        return length + GET_EDITOR_TEXT_LENGTH(node.children);
      }
      return length;
    }, 0);
};

/**
 * @description: 获取计算光标所需的数据
 * @param {*} editor
 * @return {
 *    index 全局分块索引
 *    offset 偏移值
 * }
 */
export const GET_TEXT_INFO = (editor) => { // 获取全篇中光标所在index及offset
    const cursorPositon = editor.selection
    let index = -1
    if (!cursorPositon) {
      return {index:0, offset: 0}
    }
    for (let i = 0; i < editor.children.length; i++) {
      index++
      let textBlocks = editor.children[i].children
      for (let j = 0; j<textBlocks.length; j++) {
        j !== 0 && index++
        if (i === cursorPositon.focus.path[0] && j === cursorPositon.focus.path[1]) break
      }
      if (i === cursorPositon.focus.path[0]) break
    }
    return {
      index,
      offset: cursorPositon?.focus.offset,
    }
}

/**
 * @description: 获取合并后的坐标位置
 * @param {*} resetTextData 合并的数据
 * @param {*} cursorParams GET_TEXT_INFO返回的数据
 * @return {
 *    path 光标地址
 *    offset 光标偏移值
 * } 
 */
export const GET_CONCAT_CURSOR = (resetTextData, textInfo) => {
    const { index, offset } = textInfo
    console.log(resetTextData)
    let path = [-1,-1]
    let currentIndex = -1
    for(let i = 0;i < resetTextData.length; i++) {
      path[0]++
      const children = resetTextData[i].children
      for(let j = 0; j < children.length; j++) {
        currentIndex++
        if(currentIndex === index) {
          path[1] = j
          break
        }
      }
      if(currentIndex === index) break
    }
    return {
      path,
      offset
    }
}

/**
 * @description: 获取全局光标索引
 * @param {*} editor
 * @return {*} number
 */
export const GET_CURSOR_INDEX = (editor) => {
    // enter = false
    let index = 0
    const [x, y] = editor.selection?.anchor.path
    for (let i = 0; i <= x; i++) {
      const children = editor.children[i].children
      for (let j = 0; j < children.length; j++) {
        if (j === y && i === x) {
          break
        }
        index += children[j]['text'].length
      }
    }
    return index + editor.selection?.anchor.offset
}

/**
 * @description: 获取拆分后的坐标位置
 * @param {*} data 渲染的数据
 * @param {*} index 对应的索引
 * @return {
 *    path 光标地址
 *    offset 光标偏移值
 * } 
 */
export const GET_CURSOR_PATH = (data, index, editor) => {
    // {anchor, focus} = editor.selection
    if (!editor.selection) return {
      anchor:{
        path: [0, 0],
        offset: 0
      },
      focus:{
        path: [0, 0],
        offset: 0
      }
    }
    console.log(Range.isCollapsed(editor.selection))
    if (!Range.isCollapsed(editor.selection)) { // 选中范围修改样式可以记录范围，连续修改
      return editor.selection
    }
    if(Editor.isStart(editor, editor.selection.anchor, [])) {
      return {
        anchor:{
          path: [0, 0],
          offset: 0
        },
        focus:{
          path: [0, 0],
          offset: 0
        }
      }
    }
    let textLen = 0;
    let pathX = 0, pathY = 0, offset = 0;
    for(let i = 0; i < data.length; i ++) {
      let children = data[i].children;
      for(let childIndex = 0; childIndex < children.length; childIndex ++ ) {
        textLen += children[childIndex].text.length;
        if(textLen >= index) {
          pathX = i;
          pathY = childIndex
          offset = children[childIndex].text.length - (textLen - index)
          break
        }
      }
      if(pathX || pathY || offset) break
    }
    return {
      anchor:{
        path: [pathX, pathY],
        offset
      },
      focus:{
        path: [pathX, pathY],
        offset
      }
    }
}
