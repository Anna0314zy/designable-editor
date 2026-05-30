import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Editor, Transforms, createEditor, Range, Text} from 'slate'
import CustomEditor from './utils/styleOperate'
import { Slate, Editable, withReact, ReactEditor,useSlate } from 'slate-react'
import StandardTemplate from './utils/standardTemplate'
import { areObjectsEqual } from './utils'
import {SPLIT_STATUS, KEYUP_TIME,KEY_CODE_LIST, KEY_CODE_EVENT} from "./utils/constant"
import {GET_CURSOR_INDEX, GET_TEXT_INFO, GET_CURSOR_PATH, GET_CONCAT_CURSOR} from './utils/cursorOperate'
import FontFaceObserver from 'fontfaceobserver'
import { fontConfigList } from '@slide/fonts'
let enterLen = 0
let paste = false
let deleteFlag = false
let standardTemplate: any = null
let timer: any = null
// const UUID = generateUUID()

const EditInput = (props) => {
  const {id, setDefaultName, mode, isSelect, ...others} = props
  // const editorRef = useRef(null);
  const splitStatus = useRef(SPLIT_STATUS.NORMAL)
  let isCommand = useRef(false)
  let isNotCommand = useRef(false)
  // 是否输入法
  const isInputMethod = useRef(false)
  // 光标当前位置
  const cursorIndex = useRef(0)
  // 合并的textInfo信息，用来查找合并后光标
  const textInfo:any = useRef(null)
  // 是否聚焦
  const [isFocused, setIsFocused] = useState(0)
  // 是否触发样式修改
  const isStyleChange = useRef(true)
  // new Highlight实例
  let inLineHightlight = useRef(null)
  // DOM Range实例
  let inlineRange = useRef(null)
  // range字符数量
  let rangeCount = useRef(0)
  // 编辑器实例
  let slateTextRef = useRef(null)
  // 框选区的样式，用来动态计算每行的lingHeight和fontsize
  let rangeStyle = useRef(null)
  // 字体加载状态
  const [fontLoad, setFontLoad] = useState(false)
  // 挂载完毕
  const isMount = useRef(false)
  // console.log(props.style, fontConfigList, 999)
  const observers = [];
  fontConfigList.forEach(font => {
    const obs = new FontFaceObserver(font.fontFamily);
    observers.push(obs.load());
  })
  !fontLoad && Promise.all(observers)
  .then(function(fonts) {
    console.info('字体已加载完毕', fonts)
    setFontLoad(true)
  })
  .catch(function(err) {
    console.warn('Some critical font are not available:', err);
  });
  
  const [editor] = useState(() => withReact(createEditor())) // 编辑器实例
  const [initialValue, setInitialValue] = useState(props.data ? JSON.parse(props.data) : [ // 初始化数据
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ])
  // const {viewportRatio, viewportPercentage} = props.useGlobalData()
  // const viewport = props.useViewport()
  // function handleChangeViewportPercentage(clientWidth, clientHeight) {
  //   // console.log(viewport, viewportRatio, viewportPercentage, props.style.transform)
  //   let wrapperWidth = clientWidth
  //   let wrapperHeight = clientHeight
  //   if (clientHeight / clientWidth > viewportRatio) {
  //     wrapperWidth = 1280 * viewportPercentage
  //     wrapperHeight = wrapperWidth * viewportRatio
  //   } else {
  //     wrapperHeight = 1280 * viewportRatio * viewportPercentage
  //     wrapperWidth = wrapperHeight / viewportRatio
  //   }
  //   return {wrapperWidth, wrapperHeight}
  //   // setWrapperStyle({ wrapperWidth, wrapperHeight, clientWidth, clientHeight })
  // }
  // const {wrapperWidth, wrapperHeight} = handleChangeViewportPercentage(viewport.width, viewport.height)
  // console.log(handleChangeViewportPercentage(viewport.width, viewport.height))
  if(!standardTemplate) { // 字符计算class实例
    standardTemplate = new StandardTemplate()
  }
  const { registerInstance, instanceMap, uninstallInstance } = props.useConnect([]) as any
  useEffect(() => { // 公共组件初始化及销毁方法
    registerInstance(id, {
      remove: ()=>{uninstallInstance(id)},
      ...props
    })
    if(mode === 'edit') {
      setDefaultName(instanceMap, props['x-component'])
    }
  }, [registerInstance, id, uninstallInstance])
  const mergeLetter = () => { // 合并字符
    if(splitStatus.current === SPLIT_STATUS.CONCAT) {
      return
    }
    // debugger
    !textInfo.current && (textInfo.current = GET_TEXT_INFO(editor))
    // 设置当前为 合并状态
    splitStatus.current = SPLIT_STATUS.CONCAT
    let data = standardTemplate.concatLine(editor.children); // 合并数据
    let cursorParams = GET_CONCAT_CURSOR(data, textInfo.current); // 根据textInfo信息获取合并数据后的坐标
    insertNode(data)

    Transforms.setSelection(editor, {
      anchor: cursorParams,
      focus: cursorParams,
    });
    // 选中样式后，后续文字按新样式书写，暂时去掉此功能，--------勿删------
    // Object.keys(props.style).forEach((key) => {
    //   if (DEFAULT_FONT[key]) {
    //     Editor.addMark(editor, key, props.style[key])
    //   }
    // })
  }
  useEffect(() => {// 拖拽文本框，字符重新计算
    isMount.current && onKeyUpOver()
    isMount.current = true
  }, [props.style.width])
  /**
   * @description: 触发重新渲染 
   * @param {any} data slate.js 需要的数据结构
   * @return {*}
   */
  const insertNode = (data: any): void  => { // 拆分后的最终数据，添加到文本框中
    Transforms.select(editor, {
      anchor: Editor.start(editor, []),
      focus: Editor.end(editor, []),
    })
    Editor.deleteFragment(editor)
    const newArray = data.map(element => {
      return {
        ...element,
        children: element.children.map((item, index) => {
          return {
            ...item, // 复制原有的属性
            key: index
          };
        })
      }
    });
    Transforms.insertNodes(editor, newArray, { at: [0] });
    Transforms.splitNodes(editor);
    // slate默认会新增一个空行，此处删除
    Transforms.removeNodes(editor, {
      at: Editor.end(editor, []),
    });
  }

  /**
   * @description: 合并数据，添加定时器 指定事件内不在拆分
   * @return {*}
   */
  const onKeyUpOver = (isEnd = false): void => {
    if(isInputMethod.current) { // 如果是输入法时 不进行拆分
      return
    }
    if(timer) {
      clearTimeout(timer)
    }
    if(!isEnd) {
      mergeLetter()
    }
    timer = setTimeout(() => {
      splitStatus.current = SPLIT_STATUS.NORMAL
      cursorIndex.current = GET_CURSOR_INDEX(editor) // 获取光标所在全局索引
      setInitialValue(editor.children as any)
    }, KEYUP_TIME)
  }
  // 初始化 监听键盘输入法事件
  useEffect(() => { // 页面初始化监听事件
    const compositionStart = (): void => {
      if(timer) {
        clearTimeout(timer)
      }
      isInputMethod.current = true
      mergeLetter()
    }
  
    const compositionEnd = (event) => {
      isInputMethod.current = false
      // 结束合并状态
      onKeyUpOver()
    }
    const updatePaste = () => {
      enterLen = 0
      paste = true
    }
    document.addEventListener('paste', updatePaste)
    document.addEventListener('compositionstart', compositionStart)
    document.addEventListener('compositionend', compositionEnd)
    return () => {
      document.removeEventListener('paste', updatePaste);
      document.removeEventListener('compositionstart', compositionStart)
      document.removeEventListener('compositionend', compositionEnd);
    };
  }, [])
  useEffect(() => {
    console.log(isSelect, 456 )
    if (!isSelect) {
      // ReactEditor.blur(editor)
      Transforms.setSelection(editor, {
        anchor: Editor.end(editor, []),
        focus: Editor.end(editor, []),
      });
      if (CSS && (CSS as any).highlights) {
        (CSS as any).highlights.clear();
      }
    }
  }, [isSelect])
  useEffect(() => {
    if (!editor.selection) return
    if (!isStyleChange.current) {
      isStyleChange.current = true
      return
    }
    // 修改整体样式
    if (isSelect && !isFocused && Range.isCollapsed(editor.selection)) {
      Transforms.select(editor, {
        anchor: Editor.start(editor, []),
        focus: Editor.end(editor, []),
      })
      return
    }
    editor && CustomEditor.SetFontStyle(editor, props.style, rangeStyle.current)
  }, [props.style])
  const calculateParagraph = () => {
    standardTemplate.initCalcDom()
    const arr = standardTemplate.splitGlobalText(editor.children, []) // 拆分字符数据
    const info = standardTemplate.reorganizeData(arr) // 拆分字符详细信息
    const width = props.style.width.replace('px', '')
    const data = standardTemplate.composeLine(info, Number(width)) // 重构后数据
    return data
  }
  // initialValue 监听数据改变触发重新渲染编辑器
  useEffect(() => {
    if(splitStatus.current === SPLIT_STATUS.CONCAT || !fontLoad) return
      const data = calculateParagraph() // 获取计算后的数据
      let position = GET_CURSOR_PATH(data, cursorIndex.current, editor)
      // if (data.length > editor.children.length && !Range.isCollapsed(position)) {
      //   onKeyUpOver()
      //   return
      // }
      insertNode(data)
      position = trackSelection(position)
      if (enterLen) {
        position = {
          anchor: {
            path: [enterLen, 0],
            offset: 0
          },
          focus: {
            path: [enterLen, 0],
            offset: 0
          },
        }
      }
      Transforms.setSelection(editor, position)
      textInfo.current = null
      CustomEditor.setFontSize(editor)
      // Transforms.setSelection(editor, position)
  }, [initialValue, fontLoad]);
  const trackSelection = (position) => {
    if (!Range.isCollapsed(position)) { // 选中范围修改样式可以记录范围，连续修改
      let x,y,path,offset;
      let count = rangeCount.current
      // if (Range.isBackward(position)) {
      // 从前往后框选选 focus 从后往前框选选 offset
      path = Range.isBackward(position) ? position.focus.path : position.anchor.path 
      offset = Range.isBackward(position) ? position.focus.offset : position.anchor.offset
      // }
      for (let i = path[0]; i < editor.children.length; i++) {
        const textChildren = (editor.children[i] as unknown as any).children
        for (let j = i === path[0] ? path[1] : 0; j<textChildren.length; j++) {
          const textLen = textChildren[j].text.length
          const baseLen = i === path[0] && j === path[1] ? offset : 0
          if (baseLen+count <= textLen) {
            offset = baseLen+count
            x = i;
            y = j;
            count = 0
            break
          } else {
            count = baseLen + count - textLen
          }
        }
        if (!count) break
      }
      position = {
        focus: Range.isBackward(position) ? position.focus : position.anchor,
        anchor: { path: [x,y], offset}
      }
      if (!Editor.isStart(editor, position.anchor, [])) {
        try { 
          setTimeout(() => {
            inlineRange.current = ReactEditor.toDOMRange(editor, position)
            if (inlineRange.current) {
              // @ts-ignore
              inLineHightlight.current = new Highlight(inlineRange.current)
              // @ts-ignore
              ;(CSS as unknown as any).highlights.set("range-selected", inLineHightlight.current);
            }
          })
        } catch (error) {
          console.log(error)
        }
      }
    }
    return position
  }
  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      case 'paragraph':
        return <DefaultElement {...props} />
      default:
        return <span>Unknown Element</span>;
    }
  }, [])

  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />
  }, [])

  const Leaf = props => {
    return (
      <span
        {...props.attributes}
        style={{
          color: props.leaf.color,
          fontSize: props.leaf.fontSize,
          fontWeight: props.leaf.fontWeight,
          fontStyle: props.leaf.fontStyle,
          lineHeight: props.leaf.lineHeight,
          textDecoration: props.leaf.textDecoration,
          fontFamily: props.leaf.fontFamily || 'SimFZzhunyuan,SimSun'
        }}
      >
        {props.children}
      </span>
    )
  }
  // const CustomCursor = () => { // 虚拟光标勿删（后续优化）
  //   const editor = useSlate();
  //   const cursorRef = useRef(null);
  //   const updateCursorPosition = () => {
  //     const { selection } = editor;
  //     const regex = /(-?\d+(\.\d+)?)/g;
  //     const [x, y] = props.style.transform.match(regex).map(Number);
  //     if (selection) {
  //       // const domNode = findDOMNode(cursorRef.current);
  //       const selectRange = window.getSelection()
  //       if ((selectRange.anchorOffset || selectRange.focusOffset)) {
  //         const range = window.getSelection().getRangeAt(0);
  //         const rect = range.getBoundingClientRect(); // 获取的针对屏幕的尺寸
  //         console.log(range, rect ,'...')
  //         const scrollWidth = viewport.viewportElement.scrollWidth > viewport.width ? viewport.viewportElement.scrollWidth : viewport.width
  //         const scrollHeight = viewport.viewportElement.scrollHeight > viewport.height ? viewport.viewportElement.scrollHeight : viewport.height
  //         // viewport视口尺寸，包括外部留白,offsetX偏移值视（左侧slide）
  //         // wrapperWidth、wrapperHeight 画布宽高
  //         cursorRef.current.style.left = `${(rect.left-viewport.offsetX-((scrollWidth - wrapperWidth)/2)+viewport.viewportElement.scrollLeft)/viewportPercentage - x}px`;
  //         cursorRef.current.style.top = `${(rect.top-viewport.offsetY-((scrollHeight - wrapperHeight)/2)+viewport.viewportElement.scrollTop)/viewportPercentage - y}px`;
  //         cursorRef.current.style.height = `${rect.height * 1.3}px`;
  //         // cursorRef.current.style.transform = props.style.transform
  //       }
  //     }
  //   };

  //   useEffect(() => {
  //     updateCursorPosition();
  //   }, [editor.selection]);

  //   return <span ref={cursorRef} className="custom-cursor" />;
  // };
  const CodeElement = props => {
    return (
      <pre {...props.attributes}>
        <code>{props.children}</code>
      </pre>
    )
  }
  
  const DefaultElement = elementProps => {
    return <p {...elementProps.attributes}
    //  style={{
    //   fontSize: elementProps.element.fontSize,
    //   lineHeight: elementProps.element.lineHeight
    // }}
    >{elementProps.children}</p>
  }
  const getCurrentStyle = () => {
    // const [match] = Editor.nodes(editor, {
    //   at: editor.selection,
    //   mode: 'all',
    // });
    // Editor.marks(editor)
    // props.setStyle(Editor.marks(editor))
    const editorElement = slateTextRef.current;
    let propsHeight = props.style.height ? props.style.height.replace('px', '') : '0'
    let height = Number(propsHeight) > editorElement.clientHeight ? props.style.height : editorElement.clientHeight+'px';
    let style = Editor.marks(editor)
    // props.span = Editor.marks(editor)
    style = {
      ...style,
      height
    }
    props.getStyle(style)
    rangeStyle.current = {...style}
    isStyleChange.current = false
  }
  const { treeNodeProps, style } = props

  // useEffect(() => { // 选中文本框初始化光标在文章末尾
  //   props.isSelect && inLineHightlight.current && inLineHightlight.current.delete(inlineRange.current) &&
  //   Transforms.setSelection(editor, {
  //     anchor: Editor.end(editor, []),
  //     focus: Editor.end(editor, []),
  //   })
  // }, [props.isSelect])
  const onChange = (value) => {
    props.setData(JSON.stringify(editor.children)) // 数据保存预览端
    getCurrentStyle()
    rangeCount.current = Editor.string(editor, editor.selection).length // 计算selection文字的数量，方便重新select
    // 处于合并状态不触发重新拆分
    // enter && (splitStatus.current = SPLIT_STATUS.NORMAL)
    if(splitStatus.current === SPLIT_STATUS.CONCAT) {
      return
    }
    splitStatus.current = SPLIT_STATUS.NORMAL
    if(!areObjectsEqual(value,initialValue)) {
      if (paste || deleteFlag) { // 粘贴，删除段落的操作
        textInfo.current = GET_TEXT_INFO(editor)
        mergeLetter()
        cursorIndex.current = GET_CURSOR_INDEX(editor)
        splitStatus.current = SPLIT_STATUS.NORMAL
        paste = false
        deleteFlag = false
        textInfo.current = null
      }
      setInitialValue(value as any)
    }
  }
  return (
    <div {...treeNodeProps} style={{width: style.width, height: style.height || 'auto', fontSize: '16px', transform: style.transform, position: 'absolute', textAlign: style.textAlign}} >
      <div ref={slateTextRef} className="rich-text">
      <Slate editor={editor} initialValue={initialValue}  onChange={onChange}>
        <Editable
          // id={`edit-${UUID}`}
          data-is-focused={isFocused}
          renderElement={renderElement}
          placeholder='请输入文字'
          // Pass in the `renderLeaf` function.
          renderLeaf={renderLeaf}
          onDoubleClick={() => {
            ReactEditor.focus(editor)
            if (isFocused) return
            Transforms.setSelection(editor, {
              anchor: Editor.end(editor, []),
              focus: Editor.end(editor, []),
            })
            // inLineHightlight.current && inLineHightlight.current.delete(inlineRange.current)
            setIsFocused(1)
          }}
          onBlur={() => {
            if (!Range.isCollapsed(editor.selection)) {
              if (!Editor.isStart(editor, editor.selection.anchor, [])) { // 鼠标离开文本框，保证range范围存在
                try {
                  setTimeout(() => {
                    inlineRange.current = ReactEditor.toDOMRange(editor, editor.selection)
                    if (inlineRange.current) {
                      // @ts-ignore
                      inLineHightlight.current = new Highlight(inlineRange.current)
                      // @ts-ignore
                      CSS.highlights.set("range-selected", inLineHightlight.current);
                    }
                  })
                } catch (error) {
                  console.log(error)
                }
              }
            }
            // trackSelection(editor.selection)
            setIsFocused(0)
          }}
          // onMouseDown={getCurrentStyle}
          onKeyUp={(event) => {
            if((event.metaKey || event.altKey || event.ctrlKey)) {
              isCommand.current = true
              return
            }
            if(!isNotCommand.current) {
              return
            } 
            if(KEY_CODE_LIST.includes(KEY_CODE_EVENT(event)))  {
              return
            }
            onKeyUpOver(true)
          }}
          onKeyDown={event => {
            enterLen = 0
            // 光标选中不同时 需要return
            if(event.metaKey || event.altKey || event.ctrlKey) {
              isCommand.current = true
              isNotCommand.current = false
              return
            }
            isNotCommand.current = true
            const {focus, anchor} = editor.selection as any
            const isSelectionDiff = areObjectsEqual(focus,anchor)
            !isSelectionDiff && (deleteFlag = true)
            if (event.key === 'Enter') {
              enterLen = focus.path[0] + 1
            }
            // const {focus, anchor} = editor.selection
            // const isSelectionDiff = areObjectsEqual(focus,anchor)
            if(!isSelectionDiff) {
              return
            }

            if (!KEY_CODE_LIST.includes(KEY_CODE_EVENT(event)))  {
              mergeLetter()
              return
            }
          }}
        />
        {/* <CustomCursor /> */}
      </Slate>
      </div>
    </div>
  )
}

export default EditInput