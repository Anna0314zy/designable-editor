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
} from "../_config/schema-base"

import {
    schemaText_info,
    schemaText_style,
    textLocale_info,
    textLocale_style,
    textDefaultProps
} from "../_config/schema-text"

import { genPropsSchema } from '../_config/genBehaviorTmpl'


export const TextBehavior = createBehavior({
    name: 'Text',

    // 当选中画布中的节点(node)时，如果 selector 返回true，则会在右侧面板展示此配置表单，表单内容会同步到 node.props 中
    selector: (node) =>
        node.componentName === 'Text' && node.props['x-component'] === 'Text',

    designerProps: {
        propsSchema: genPropsSchema([schemaBase_info, schemaText_info], [schemaBase_style, schemaText_style]),
        defaultProps: {
            ...textDefaultProps
        },
        getComponentProps() {
            return {}
        }
    },


    designerLocales: {
        'zh-CN': {
            title: '文本',
            settings: {
                info: {
                    ...baseLocale_info,
                    ...textLocale_info
                },
                style: {
                    ...baseLocale_style,
                    ...textLocale_style
                }
            },
        },
    },
})


export const TextResource = createResource({
    title: {
        "zh-CN": "文本"
    },
    icon: "TextResource",
    elements: [
        {
            componentName: "Text",
            props: {
                title: "文本",
                "x-component": "Text",
            },
        },
    ],
});

export const Text = (props) => {
    const {treeNodeProps, ...componentProps} = props

    return (
        <div mode="edit" title={componentProps.title} {...treeNodeProps} {...componentProps}
            {...{
                'data-content-editable': "info.content",
                'data-content-editable-node-id': componentProps['data-designer-node-id']
            }}
            style={{
                position: 'absolute',
                background: '#eee',
                padding: '10px 20px',
                border: '1px solid #ddd',
                ...componentProps.style,
            }}
        >
            <div>
            {componentProps.content || '请修改文本文案'}
            </div>
        </div>
    )
}