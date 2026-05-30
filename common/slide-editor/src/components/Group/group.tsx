/*
 * @Date: 2024-02-26 10:05:29
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-02-26 19:47:36
 * @FilePath: /slides-engine/common/slide-editor/src/components/Group/group.tsx
 */
import React, {FC, useEffect} from 'react'

interface GroupProps {
    children: React.ReactNode,
    useConnect?: any,
    id: string,
    setDefaultName?: any,
    mode?: string
    styleMapProps?: any,
    style: any
    treeNodeProps?: any
    initStyleProps?: any
    className?: string
}
const Group: FC<GroupProps> = (props) => {
    const {id, children, mode, setDefaultName, styleMapProps, style, treeNodeProps, initStyleProps, className} = props
    // 预览端使用-初始样式
    const styleItem = styleMapProps && styleMapProps[id] || {}
    const { registerInstance, instanceMap, uninstallInstance } = props.useConnect([]) as any
    useEffect(() => {
        registerInstance(id, {
          remove: ()=>{uninstallInstance(id)},
          ...props
        })
        mode === 'edit' && setDefaultName(instanceMap, props['x-component'])
      }, [])
    return (
        <>
            {mode === 'edit' ?  
                <div {...treeNodeProps} className={className} style={{position: 'absolute',...style}}>
                    <div style={{width: '100%', height: '100%'}}>
                        {children}
                    </div>
                </div> : 
                <div preview-id={id} style={{position: 'absolute',...style, ...initStyleProps, ...styleItem}}>
                  <div style={{width: '100%', height: '100%'}}>
                        {children}
                    </div>
                </div>
            }
        </>
    )
}

export default Group;