/*
 * @Date: 2023-12-06 14:29:48
 * @LastEditors: wangpeng
 * @LastEditTime: 2023-12-18 19:32:39
 * @FilePath: /slides-engine/play/src/components/_config/schema-shape.ts
 */
export const schemaShape_style = {
    'style.fill': {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'ColorInput',
    },
    'style.stroke': {
        type: 'string',
        'x-component': 'BorderStyleSetter',
    },
}

export const schemaShape_info = {
    // 'info.shapeType': {
    //     type: 'string',
    //     'x-decorator': 'FormItem',
    //     'x-component': 'Shape',
    // },
}

export const shapeLocale_style = {
    fill: '填充色',
    stroke: '边框',
}

export const shapeLocale_info = {
    // shapeType: '图形形状'
}