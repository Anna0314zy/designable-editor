/*
 * @Date: 2024-01-10 17:40:21
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-02-26 19:02:32
 * @FilePath: /slides-engine/editor/src/components/_config/genBehaviorTmpl.ts
 */
export const componentMap = {
    Shape: '形状',
    Group: '编组',
    Video: '视频',
    Audio: '音频',
    Img: '图片',
    RichText: '文本',
    Camera: '视频流'
}
export const genPropsSchema = (infoList, styleList) => {
    const infoProperties = infoList.reduce((acc, item) => {
        acc = { ...acc, ...item }
        return acc;
    }, {});

    const styleProperties = styleList.reduce((acc, item) => {
        acc = { ...acc, ...item }
        return acc;
    }, {});

    return {
        type: 'object',
        properties: {
            'info-properties': {
                type: 'void',
                title: '属性',
                'x-component': 'CollapseItem',
                properties: infoProperties,
            },

            'style-properties': {
                type: 'void',
                title: '样式',
                'x-component': 'CollapseItem',
                properties: styleProperties
            },
        },
    }
}

export const setDefaultName = (list, type, node) => {
    const compLen: number = Object.keys(list).filter(key => list[key] && list[key]['x-component'] === type).length
    node.props.info = {
        ...node.props.info,
        name: node.props.info ? node.props.info.name : componentMap[type] + (compLen + 1)
    }
    // node.props.title = componentMap[type] + (compLen + 1)
}