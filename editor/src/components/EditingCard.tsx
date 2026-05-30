import React from "react";

import {
    createResource,
    createBehavior,
} from "@editor/core";

import {
    schemaBase_info,
    schemaBase_style,
    baseLocale_info,
    baseLocale_style,
} from "./_config/schema-base"

import { genPropsSchema } from './_config/genBehaviorTmpl'


export const CardResource = createResource({
    title: {
        "zh-CN": "容器",
        "en-US": "Card",
    },
    icon: "CardSource",
    elements: [
        {
            componentName: "Card",
            props: {
                title: "容器",
            },
        },
    ],
});

export const CardBehavior = createBehavior({
    name: "Card",
    selector: "Card",
    designerProps: {
        droppable: true,
        propsSchema: genPropsSchema([schemaBase_info], [schemaBase_style]),
        defaultProps: {
            style: {
                width: '150px',
                height: '100px',
                transform: 'translate(10px, 0px) rotate(0deg)'
            }
        }
    },
    designerLocales: {
        "zh-CN": {
            title: "容器",
            settings: {
                info: {
                    ...baseLocale_info,
                },
                style: {
                    ...baseLocale_style
                }
            },
        },
    },
});

export const Card = (props) => {
    const {treeNodeProps, ...componentProps} = props

    return (
        <div
            {...treeNodeProps}
            {...componentProps}
            style={{
                position: 'absolute',
                background: '#eee',
                border: '1px solid #ddd',
                padding: '10px',
                height: 100,
                width: 150,
                ...componentProps.style,
            }}
        >
            <div>
                我是内容
                {componentProps.children ? componentProps.children : <span>拖拽字段进入该区域</span>}
            </div>
        </div>
    )
}


