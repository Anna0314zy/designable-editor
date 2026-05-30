import React from "react";
import { group_class } from '@editor/react'
import { GroupComponent } from '@ld/slide-editor'
import {
    useConnect,
    useReport,
  } from '@play/render'

import {
    createResource,
    createBehavior,
} from "@editor/core";
import { setDefaultName } from '../_config/genBehaviorTmpl'
import {
    schemaBase_info,
    schemaBase_style,
    baseLocale_info,
    baseLocale_style,
} from "../_config/schema-base"

import { genPropsSchema } from '../_config/genBehaviorTmpl'


export const MarkGroupResource = createResource({
    id: 'mark_group_source_id',
    title: {
        "zh-CN": "编组",
    },
    icon: "MarkGroupSource",
    elements: [
        {
            componentName: "Group",
            props: {
                title: "编组",
                'x-component': 'Group',
            },
        },
    ],
});

export const MarkGroupBehavior = createBehavior({
    name: "Group",
    selector: "Group",
    designerProps: {
        droppable: true,
        propsSchema: genPropsSchema([schemaBase_info], [schemaBase_style]),
        defaultProps: {
            style: {
            }
        },
        getComponentProps(node) {
            return {
              useConnect,
              useReport,
              id: node.id,
              pageId: node.root.id,
              isSelect: node.props.isSelect,
              setDefaultName: (list, type) => {setDefaultName(list, type, node)},
            }
        },
    },
    designerLocales: {
        "zh-CN": {
            title: "编组",
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

export const Group = (props) => {
    const {treeNodeProps} = props
    return (
        <GroupComponent className={`${group_class} ${treeNodeProps.className || ''}`} {...props} mode="edit"/>
    )
};


