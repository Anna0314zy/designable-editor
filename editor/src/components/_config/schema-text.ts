/*
 * @Date: 2023-12-05 17:51:06
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-02-05 10:26:20
 * @FilePath: /slides-engine/editor/src/components/_config/schema-text.ts
 */
export const schemaText_style = {
    'style.font': {
        'x-component': 'FontStyleSetter',
    },
}

export const schemaText_info = {
    // 'info.content': {
    //     type: 'string',
    //     'x-decorator': 'FormItem',
    //     'x-component': 'Input',
    // },
}

export const textLocale_style = {
    font: '字体',
}

export const textLocale_info = {
    // content: "内容"
}

export const textDefaultProps = {
    style: {
        width: '400px',
        height: '200px',
        color: `rgba(35,35,35,1)`,
        fontSize: '60px',
        fontWeight: 'normal',
        textAlign: 'left',
        textDecoration: 'none',
        fontFamily: 'SimFZzhunyuan,SimSun',
        lineHeight: '1.2',
        transform: 'translate(0px, 0px) rotate(0deg)'
    }
};