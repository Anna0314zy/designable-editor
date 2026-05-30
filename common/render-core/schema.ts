import {schemaIF} from "./index";
export const schema = {
    "ui:widget": "Div",
    "props": {
        style: {
            background: "red",
        }
    },
    "properties": {
        "姓名": {
            "ui:widget": "B",
            "title": "简单输入框",
            props: {
                "content": "王洪莹"
            }
        },
        "姓名2": {
            "ui:widget": "B",
            "title": "简单输入框",
            props: {
                "content": "王洪莹"
            }
        },
        "题目": {
            "ui:widget": "I",
            "title": "标题",
            props: {
                "content": "来一起玩"
            }
        },
        "对对对": {
            "ui:widget": "P",
            "title": "简单输入框",
            props: {
                "content": "难忘的一天"
            }

        },
    }
};

export const nodeSchema = {
    "id": "nzv7uvxij2p",
    "componentName": "Root",
    "sourceName": "",
    "props": {
        "style":{}
    },
    "hidden": false,
    "children": [{
        "id": "u9jpg17uwpv",
        "componentName": "Video",
        "sourceName": "",
        "props": {
            "title": "视频",
            "style": {
                "transform": "translate(789.297425884782px, 365.3022733903364px)"
            },
            "x-component": "Video",
        },
        "hidden": false,
        "children": []
    }]
};

export const animationSchema = {
    "id": "aaaaaaaa",
    "componentName": "Root",
    "sourceName": "",
    "props": {
        "style": {
            "backgroundColor": "rgba(148,132,228,1)"
        },
        "animates": [{
            "id": "1dpy1fgvoxv",
            "target": "nmyyme1tnim",
            "trigger": "auto",
            "triggerSource": "workspace",
            "type": "entrance",
            "duration": 1,
            "delay": 0,
            "direction": "general",
            "name": "bounceIn"
        }]
    },
    "hidden": false,
    "children": [{
        "id": "zubgam180bq",
        "componentName": "Shape",
        "sourceName": "",
        "props": {
            "title": "形状",
            "style": {
                "width": "100px",
                "height": "100px",
                "transform": "translate(443.3246924573728px, 562.1344942449127px)"
            },
            "x-component": "Shape",
            "shapeKey": "chord",
        },
        "hidden": false,
        "children": []
    }, {
        "id": "nmyyme1tnim",
        "componentName": "Img",
        "sourceName": "",
        "props": {
            "title": "图片",
            "x-decorator": "FormItem",
            "x-component": "Img",
            "style": {
                "transform": " translate(599px, 362px) ",
                "width": "300px",
                "height": "300px"
            },
            "src": "https://class-slides-res-test-1313601664.cos.ap-beijing.myqcloud.com/image/a2bf9b1a-8a11-4681-86e8-e253d07fb80a.png",
        },
        "hidden": false,
        "children": []
    }]
};

// schema 的转换映射
const nodeSchemaToNode = (nodeSchema) => {
    return {
        id: nodeSchema.id,
        'ui:widget': nodeSchema.componentName,
        sourceName: nodeSchema.sourceName,
        props: nodeSchema.props,
        hidden: nodeSchema.hidden,
    };
};

export const nodeSchemaToSchema = (nodeSchema) => {
    const schema = nodeSchemaToNode(nodeSchema) as unknown as schemaIF;

    if (nodeSchema.children) {
        schema.properties = {};
        nodeSchema.children.forEach((child) => {
            schema.properties[child.id] = nodeSchemaToSchema(child);
        });
    }

    return schema;
};