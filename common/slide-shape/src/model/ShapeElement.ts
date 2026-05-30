// 定义形状元素类型

import { ShapePathFormulasKeys } from "../utils/shapes";

/**
 * BaseElement 接口定义了一个元素的基础属性。
 */
export interface BaseElement {
    id: string; // 元素的唯一标识符
    left: number; // 元素的左上角在其父元素中的水平位置
    top: number; // 元素的左上角在其父元素中的垂直位置
    width: number; // 元素的宽度
    height: number; // 元素的高度
    rotate: number; // 元素的旋转角度，单位是度
    name: string; // 元素的名称或类型
}

/**
 * ShapeGradient 接口定义了一个形状的渐变属性。
 */
export interface ShapeGradient {
    type: 'linear' | 'radial'; // 渐变的类型，可以是 'linear'（线性）或 'radial'（径向）
    color: [string, string]; // 渐变的颜色，是一个包含两个字符串的数组，每个字符串代表一个颜色
    rotate: number; // 渐变的旋转角度，单位是度
}

/**
 * ShapeBorder 接口定义了一个形状的边框属性。
 */
export interface ShapeBorder {
    style?: 'solid' | 'dashed' | 'dotted'; // 边框的样式，可以是 'solid'（实线）、'dashed'（虚线）或 'dotted'（点线）
    width?: number; // 边框的宽度
    color?: string; // 边框的颜色
}

/**
 * ShapeText 接口定义了一个形状的文本属性。
 */
export interface ShapeText {
    content: string; // 文本内容
    fontSize: number; // 字体大小
    color: string; // 字体颜色
    fontFamily: string; // 字体家族
    fontWeight: number; // 字体粗细
    fontStyle: 'normal' | 'italic'; // 字体样式，可以是 'normal'（正常）或 'italic'（斜体）
    textAlign: 'left' | 'center' | 'right'; // 文本对齐方式，可以是 'left'（左对齐）、'center'（居中对齐）或 'right'（右对齐）
}

/**
 * ShapeShadow 接口定义了一个形状的阴影属性。
 */
export interface ShapeShadow {
    color: string; // 阴影的颜色
    offsetX: number; // 阴影的水平偏移量
    offsetY: number; // 阴影的垂直偏移量
    blur: number; // 阴影的模糊度
}

/**
 * ShapeElement 接口定义了一个形状元素的属性，它继承了 BaseElement 接口的属性。
 */
export interface ShapeElement extends BaseElement {
    type: 'shape'; // 元素的类型，这里固定为 'shape'
    viewBox: [number, number]; // 视图框的大小，是一个包含两个数字的数组
    path: string; // 形状的路径，是一个 SVG 路径字符串
    gradient?: ShapeGradient; // 形状的渐变属性，是一个可选的 ShapeGradient 对象
    fill: string; // 形状的填充颜色
    fixedRatio: boolean; // 是否固定形状的宽高比
    border: ShapeBorder; // 形状的边框属性，是一个 ShapeBorder 对象
    opacity?: number; // 形状的透明度，是一个可选的数字，范围是 0（完全透明）到 1（完全不透明）
    flipH: boolean; // 是否水平翻转形状
    flipV?: boolean; // 是否垂直翻转形状，是一个可选的布尔值
    shadow?: ShapeShadow; // 形状的阴影属性，是一个可选的 ShapeShadow 对象
    special?: boolean; // 标记是否为特殊形状，标记一些难以解析的形状，比如路径使用了除L、Q、C、A之外的类型。打包的时候会导出为图片
    text?: ShapeText; // 形状内文本
    pathFormula?: ShapePathFormulasKeys; // 形状路径计算公式。形状的大小变化时仅由宽高基于viewBox的缩放比例计算，不会改变形状的形状。如果需要改变形状的形状，可以使用此属性，在更新viewBox的时候重新计算path重新绘制形状
    keypoint?: number // 关键点位置百分比
}