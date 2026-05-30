/*
 * @Date: 2023-12-06 14:29:48
 * @LastEditors: wangpeng
 * @LastEditTime: 2023-12-16 17:11:00
 * @FilePath: /slides-engine/play/src/components/_config/schema-base.ts
 */
export const schemaBase_style = {
    'style.width': {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'SizeInput',
    },
    'style.height': {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'SizeInput',
    },
    'style.opacity': {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'OpacitySlider',
    },
    'style.transform': {
        type: 'string',
        'x-component': 'TransformStyleSetter',
    },
    // 'style.borderRadius': {
    //     type: 'string',
    //     'x-component': 'BorderRadiusStyleSetter',
    // },
    // 'style.border': {
    //     type: 'string',
    //     'x-component': 'BorderStyleSetter',
    // },
}

export const schemaBase_info = {
    'info.name': {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
    },
    // 'info.hidden': {
    //     type: 'string',
    //     'x-decorator': 'FormItem',
    //     'x-component': 'Switch',
    // },
}

export const baseLocale_style = {
    left: 'left',
    top: 'top',
    width: '宽度',
    height: '高度',
    // rotate: '旋转',
    opacity: '透明度',
    transform: '位置',
    border: '边框',
    borderRadius: "圆角"
}

export const baseLocale_info = {
    name: '名称',
    // hidden: '隐藏',
}   