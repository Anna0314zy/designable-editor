import { SHAPE_PATH_FORMULAS, SHAPE_ARRAY } from '../utils';
import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
interface ShapeComponentIF {
    useConnect: any,
    useReport: any,
    id: string,
    pageId: string,
    shapeKey: string,
    style: any,
    mode: string,
    treeNodeProps: any,
    [key: string]: any
}

export const ShapeComponent = (props:ShapeComponentIF) => {
    const {
        useConnect,
        id,
        pageId,
        shapeKey,
        style,
        mode,
        treeNodeProps,
        setDefaultName,
        initStyleProps, // 预览端使用-初始样式
		styleMapProps // 预览端使用
    } = props
    const {
        instanceMap,
        registerInstance,
        uninstallInstance
    } = useConnect([]);

    const styleItem = styleMapProps && styleMapProps[id] || {}

    useEffect(() => {
        registerInstance(id, {
            remove: ()=>{uninstallInstance(id)},
            ...props
        })
        if(mode === 'edit') {
            setDefaultName(instanceMap, props['x-component'])
        }
    }, [])

    const {width,height} = style
    const widthNumber = Number(width.replace('px', ''))
    const heightNumber = Number(height.replace('px',''))
    const shape = SHAPE_ARRAY.find(item => item.key === shapeKey)
    if(shape) {
        if(shape.pathFormula) {
            const pathFormula = SHAPE_PATH_FORMULAS[shape.pathFormula]
            if('editable' in pathFormula) {
                shape.viewBox = [widthNumber, heightNumber]
                shape.path = pathFormula.formula(widthNumber, heightNumber, (pathFormula.defaultValue as number))
                // shape.keypoint = pathFormula.defaultValue
            } else {
                shape.path = pathFormula.formula(widthNumber, heightNumber)
            }
        }
    }
    const shapeStyle = {
        ...style,
        position: 'absolute',
    }
    delete shapeStyle.borderStyle
    const editRender = () => {
        return (
            <div className='shape-component' {...treeNodeProps} style={shapeStyle}>
            {shape && <svg width={widthNumber} height={heightNumber} overflow="visible">
                <g
                    transform={`scale(${widthNumber / shape.viewBox[0]}, ${heightNumber / shape.viewBox[1]}) translate(0,0) matrix(1,0,0,1,0,0)`}
                >
                    <path
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="butt"
                        strokeMiterlimit="8"
                        d={shape.path}
                        fill={style.fill || 'rgba(24,144,255,1)'}
                        stroke={style.borderStyle !== 'none' ? style.borderColor || 'rgba(0,0,255,1)' : 'none'}
                        strokeWidth={style.borderWidth || 4}
                        strokeDasharray={style.borderStyle === 'dashed' ? '5,5' : style.borderStyle}
                    ></path>
                </g>
            </svg>}
            </div>
        )
    }

    const previewRender = () => {
        return (
            <div className='shape-component' preview-id={id} style={{...shapeStyle, ...initStyleProps, ...styleItem}}>
                {shape && <svg width={widthNumber} height={heightNumber} overflow="visible" style={{pointerEvents:"none"}}>
                    <g
                        transform={`scale(${widthNumber / shape.viewBox[0]}, ${heightNumber / shape.viewBox[1]}) translate(0,0) matrix(1,0,0,1,0,0)`}
                    >
                        <path
                            vectorEffect="non-scaling-stroke"
                            strokeLinecap="butt"
                            strokeMiterlimit="8"
                            d={shape.path}
                            fill={style.fill || 'rgba(24,144,255,1)'}
                            stroke={style.borderStyle !== 'none' ? style.borderColor || 'rgba(0,0,255,1)' : 'none'}
                            strokeWidth={style.borderWidth || 4}
                            strokeDasharray={style.borderStyle === 'dashed' ? '5,5' : style.borderStyle}
                        ></path>
                    </g>
                </svg>}
        </div >)
    }
    return (
        mode === 'edit' ? editRender() : previewRender()
    )
}