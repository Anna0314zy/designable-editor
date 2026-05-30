/*
 * @Date: 2023-02-23 14:01:57
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-03-20 11:40:20
 * @FilePath: /slides-engine/common/slide-editor/src/components/Input/viewInput.tsx
 */
import React, {useState, useEffect} from 'react'


const ViewInput= (props) => {
  const {
    id,
    setDefaultName,
    initStyleProps, // 预览端使用-初始样式
		styleMapProps // 预览端使用
  } = props
  // 预览端使用-初始样式
  const styleItem = styleMapProps && styleMapProps[id] || {}
  const { registerInstance, instanceMap, uninstallInstance } = props.useConnect([]) as any
  useEffect(() => {
    registerInstance(id, {
      remove: ()=>{uninstallInstance(id)},
      ...props
    })
    props.mode === 'edit' && setDefaultName(instanceMap, props['x-component'])
  }, [])
  const supportedStyles = {
    'fontFamily': 'font-family',
    'fontSize': 'font-size',
    'fontStyle': 'font-style',
    'fontVariant': 'font-variant',
    'lineHeight': 'line-height',
    'fontWeight': 'font-weight',
    'color': 'color',
    'textDecoration': 'text-decoration',
  };
  const supportedTags = {
    'paragraph': 'p'
  }
  // const [initialValue] = useState("[{\"type\":\"paragraph\",\"children\":[{\"text\":\"你好呀，我的名字叫\",\"fontFamily\":\"CustomFont\",\"fontSize\":\"16px\",\"lineHeight\":\"16px\",\"fontStyle\":\"normal\",\"fontVariant\":\"normal\",\"fontWeight\":\"normal\",\"color\":\"#232323\",\"key\":0}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"张三\",\"fontFamily\":\"CustomFont\",\"fontSize\":\"16px\",\"lineHeight\":\"16px\",\"fontStyle\":\"normal\",\"fontVariant\":\"normal\",\"fontWeight\":\"normal\",\"color\":\"#232323\",\"key\":0},{\"text\":\"你好\",\"fontFamily\":\"CustomFont\",\"fontSize\":\"16px\",\"lineHeight\":\"16px\",\"fontStyle\":\"normal\",\"fontVariant\":\"normal\",\"fontWeight\":\"normal\",\"color\":\"rgba(219,26,26,1)\",\"key\":1},{\"text\":\"你好\",\"fontFamily\":\"CustomFont\",\"fontSize\":\"16px\",\"lineHeight\":\"16px\",\"fontStyle\":\"normal\",\"fontVariant\":\"normal\",\"fontWeight\":\"normal\",\"color\":\"#232323\",\"key\":2}],\"isSpill\":true},{\"type\":\"paragraph\",\"children\":[{\"text\":\"你好\",\"fontFamily\":\"CustomFont\",\"fontSize\":\"16px\",\"lineHeight\":\"16px\",\"fontStyle\":\"normal\",\"fontVariant\":\"normal\",\"fontWeight\":\"700\",\"color\":\"#232323\",\"key\":0}]}]")
  const serialize = (node) => {
    if (Array.isArray(node)) {
      return node.map((child) => serialize(child)).join('');
    }
  
    let style = 'style="';
    Object.keys(node).forEach(key => {
      if (supportedStyles[key]) style+=`${supportedStyles[key]}: ${node[key]};`
    })
    style+='"';
    if (node.children) {
      if (node.children.length === 1 && !node.children.text) {
        return `<${supportedTags[node.type]} class="styled-span">${serialize(node.children)}</${supportedTags[node.type]}>`;
      }
      return `<${supportedTags[node.type]}>${serialize(node.children)}</${supportedTags[node.type]}>`;
    }
    return `<span ${style}>${node.text}</span>`;
  };
  const { style } = props
  // const data = JSON.parse(initialValue)
  const data = props.data ? JSON.parse(props.data) : [ // 初始化数据
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]
  return (
      <div preview-id={id} className="rich-text" style={{
        width: style.width,
        height: style.height,
        transform: style.transform,
        position: 'absolute',
        textAlign: style.textAlign,
        ...initStyleProps, 
        ...styleItem}}
      >
        <div style={{width: '100%', height: '100%'}} dangerouslySetInnerHTML={{ __html: serialize(data) }} />
    </div>
  )
}

export default ViewInput;