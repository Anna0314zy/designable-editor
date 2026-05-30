/*
 * @Date: 2023-12-05 17:51:06
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-01-02 17:13:59
 * @FilePath: /slides-engine/play/src/RegistryBehaviors.ts
 */
import {
    createBehavior,
    GlobalRegistry,
} from "@editor/core";

import { ShapeBehavior } from './components/Shape/EditingShape'
import { CardBehavior } from './components/EditingCard'
import { ImgBehavior } from './components/Img';
import { TextBehavior } from './components/Text/EditingText';
import { MarkGroupBehavior } from './components/Group/EditingMarkGroup'
import { VideoBehavior } from './components/Video';
import { AudioBehavior } from './components/Audio';
import { RichTextBehavior } from './components/RichText';
import { CameraBehavior } from "./components/Camera";
import { genPropsSchema } from './components/_config/genBehaviorTmpl'
import { GameBehavior } from "./components/Game/editingGame";

const RootBehavior = createBehavior({
    name: "Root",
    selector: "Root",
    designerProps: {
        droppable: true,
        propsSchema: genPropsSchema([{
            'info':{
                type: 'string',
                'x-component': 'CanvasSetter',
            }
        }], [{
            'style.background': {
                type: 'string',
                'x-component': 'BackgroundSetting',
            }
        }])
    },
    designerLocales: {
        "zh-CN": {
            title: "根组件",
            settings: {
                style: {
                    background: '背景',
                },
                info: {
                    name: '名称',
                    type: '页面类型'
                }
            },
        },
    },
});

GlobalRegistry.setDesignerBehaviors([
    RootBehavior,
    CardBehavior,
    MarkGroupBehavior,
    ShapeBehavior,
    ImgBehavior,
    TextBehavior,
    VideoBehavior,
    AudioBehavior,
    RichTextBehavior,
    CameraBehavior,
    GameBehavior
]);