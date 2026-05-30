/*
 * @Date: 2023-12-05 17:51:06
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-03-04 17:50:36
 * @FilePath: /slides-engine/editor/src/components/_config/schema-image.ts
 */
export const schemaImage_style = {
    // 'style.filter': {
    //     type: 'string',
    //     'x-decorator': 'FormItem',
    //     'x-component': 'Filter',
    // },
}

export const schemaImage_info = {
    'info.url': {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'COSUpload',
    },
    'info.jumpPage': {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'JumpPageSetting',
    },
    'info.keepRatio': {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'RatioSetter',
    },
    'info.isBackground': {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'ImgSettingBackground',
    },
}

export const imageLocale_style = {
    filter: '滤镜',
}

export const imageLocale_info = {
    jumpPage: "页面跳转",
    url: '图片操作',
    keepRatio: '锁定比例',
    isBackground: '设为背景'
}   