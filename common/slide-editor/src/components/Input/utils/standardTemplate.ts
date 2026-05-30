import FontCache from "./cache"
import { FontType } from '../../../type/font'
import {DEFAULT_FONT} from './constant'
import {deepClone} from '.'

// 字体放大一百倍，由于字体小的话 英文字符出现小数点算起来误差较大 需×100 去减少误差
const BASE_SCALE = 10
interface StyleObject {
  [key: string ]: any;
}
  
interface FontStyle {
  fontFamily: string, // 字体
  fontSize: number, // 字体大小
  // fontStretch: string, 字体拉伸 主流浏览器不支持 暂时不要
  fontStyle: string, // 字体样式 斜体等
  fontVariant: string, // 字体变体， 如小型大写字母
  fontWeight: string | number // 字体粗细
}
interface FontStrList {
  width: string,
  height: string,
  descent: string,
  ascent: string
}
export default class StandardTemplate {
  private parent:HTMLElement | any // body下元素
  private caliper:HTMLElement | any // span标签获取实际字符宽度
  private vernier:HTMLElement | any// span下div标签 方便后期做行高计算
  public _fontStyle: FontStyle
  public fontStrList: FontStrList[]
  public width:number
  private lineBreakChars: string[]
  constructor(){
    this.width = 0
    this.lineBreakChars = ['\u000b', '\n', '\r' ]
  }

  /**
   * @description: 合并数据 如font-style等同行合并
   * @param {*} info
   * @return {*}
   */
  mergeFontText(info) {
    const transformedData:any = [];
    let lastStartData:any = {};
    
    for (const item of info) {
      if (item.isStart) {
        // 创建新的对象并插入到新数组中
        const newData = { ...item, splitIndexList: [] };
        transformedData.push(newData);
        lastStartData = newData;
      } else {
        // 将当前索引添加到 splitIndexList 中
        let splitIndex = lastStartData.textInfo.length
        lastStartData.splitIndexList.push(splitIndex)

        // 将当前数据的 textInfo 合并到上一个 isStart 为 true 的数据的 textInfo 中
        lastStartData.textInfo = lastStartData.textInfo.concat(item.textInfo);
        // 累加 width
        lastStartData.width += item.width;
        
      }
    }
    return transformedData
  }

  /**
   * @description: 数据按行拆分
   * @param {*} info 所有字区域详情
   * @param {*} width 编辑器区域宽度
   * @return {*}
   */
  composeLine(info: FontType[], width) {
    // debugger
    let editAllValue:any = []
    let resetFontInfo = this.mergeFontText(info) // 改造数据，根据isStart拆分成多个行集合方便后续计算，新增splitIndexList字段，累加方便分割样式span
    // console.log(resetFontInfo, 'pppppp')
    resetFontInfo.forEach((textItem) => {
      let lineWidth = width || 0 // 当前行宽度
      const editValue: any[]  = this.composeLineBlock(textItem, lineWidth) // 拼接成单行block
      editAllValue = editAllValue.concat(editValue)
    })
    
    return editAllValue // 生成最终json数据
  }

  /**
   * @description: 英文符号校验
   * @param {*} text
   * @param {*} isTrue
   * @return {*}
   */
  isSpecialText(text, isTrue) {
    if(isTrue) {
     return  /^[A-Za-z]$/.test(text) || /^[.,;:?!'"()[\]{}\-/\\]$/.test(text)
    }
    return !/^[A-Za-z]$/.test(text) && !/^[.,;:?!'"()[\]{}\-/\\]$/.test(text)
  }

  /**
   * @description: 递归将数据拆分 当超过宽度是 将前一个到最前方的值形成一个数组 
   * @param {*} textItem
   * @param {*} lineWidth
   * @param {any} splitArr
   * @return {*}
   */
  composeLineBlock(textItem, lineWidth, splitArr: any[] = []) {
    let width = Number((lineWidth * BASE_SCALE).toFixed(2));
    const { textInfo } = textItem
    for(let i = 0; i < textInfo.length; i ++) {
      if(lineWidth !== 0) {
        width -= textInfo[i].width
      }
      
      //  文字宽度大于当前行宽度时换行处理
      if(width < 0) {
          // 最后一个是英文字符，向前追溯，保证单词连贯性
        if (this.isSpecialText(textInfo[i].text, true)) {
          for (let j = i; j >= 0; j--) {
            if (this.isSpecialText(textInfo[j].text, false)) {
              i = j + 1
              break
            }
          }
        }
        
        // 将当前字符前面字符整体创建为新的一行
        let splitList: number[] = textItem.splitIndexList
        // 截取当前行字符数据，并将splitList 索引列表中大于当前字符长度的字符截取
        const filteredSplitList = splitList.filter(item => item <= i);
        // debugger
        let children = this.splitArrayByIndexes(textInfo.slice(0,i), filteredSplitList)
        splitArr.push({
          type: 'paragraph',
          children: children,
          isSpill: textItem.isSpill || undefined,
          fontSize: textItem.fontSize,
          lineHeight: textItem.lineHeight,
        })

        // 将已经渲染行的数据移除 
        let resetTextInfo = textInfo.slice(i);
        let len: number = textInfo.length - resetTextInfo.length;
        let splitIndex:number[] = [];

        // 将索引列表中已经渲染的索引删除，并将剩余索引长度减去已经渲染的列表长度
        for (const item of textItem.splitIndexList) {
          if (item > len) {
            splitIndex.push(item - len);
          }
        }
        // 将剩余行新起一行继续计算
        let composeTextItem = Object.assign({}, {...textItem, splitIndexList: splitIndex}, {isSpill: true}, {
          textInfo: resetTextInfo
        })
        this.composeLineBlock(composeTextItem,lineWidth, splitArr)
        break
      } else {
        // 文字结束时将剩余字符插入
        if( i === textInfo.length - 1) {
          let splitList = textItem.splitIndexList
          // 将剩余字符根据索引进行截取
          let children = this.splitArrayByIndexes(textInfo, splitList)
          splitArr.push({
            type: 'paragraph',
            children: children,
            isSpill: textItem.isSpill || undefined,
            fontSize: textItem.fontSize,
            lineHeight: textItem.lineHeight,
          })
        }
      }
    }
    return splitArr
  }

  /**
   * @description: 根据拆分的索引重组数据
   * @param {*} arr
   * @param {*} indexes
   * @return {*}
   */
  splitArrayByIndexes(arr:any[], indexes:number[]) {
    const result:any = [];
    let start = 0;
    for (const index of indexes) {
      // 获取截断后的首个字的样式 当前段样式都是一样的
      const {
        fontFamily,
        fontSize,
        fontStyle,
        fontVariant,
        lineHeight,
        fontWeight,
        color,
        textDecoration
      }  = arr.slice(start, index)[0]
      // console.log(arr.slice(start, index), 'start')
      // 将对应端字符串截取
      let str = arr.slice(start, index).map(item => item.text).join('')
      // 插入children中
      result.push({
        text:str,
        fontFamily,
        fontSize,
        lineHeight,
        fontStyle,
        fontVariant,
        fontWeight,
        color,
        textDecoration
      });
      start = index
    }
    if(arr.slice(start).length) {
      const {
        fontFamily,
        fontSize,
        lineHeight,
        fontStyle,
        fontVariant,
        fontWeight,
        color,
        textDecoration
      }  = arr.slice(start)[0]
      // 插入数据
      result.push({
        text: arr.slice(start).map(item => item.text).join(''),
        fontFamily,
        fontSize,
        lineHeight,
        fontStyle,
        fontVariant,
        fontWeight,
        color,
        textDecoration
      });
    }
    return result;
  }

  /**
   * @description: 重组数据
   * @param {any} data
   * @return {*}
   */
  public reorganizeData(data: FontType[]) { // 把text更新为textInfo，里面增加字体各项数值，方便计算高度，同时更新了当前字符真正width
    let fontMap = data.map(fontBlock => {
      // console.log(fontBlock, ';;;;;;;;;;;')
      this.clearWidth()
      let text: any = fontBlock.text;
      // 清空缓存
      fontBlock.text = []
      return {
        ...fontBlock,
        textInfo: text.map(textInfo => {
          let fontInfo = this.calcMetrics(textInfo, fontBlock)
          return {
            ...fontInfo,
          }
        }),
        width: this.width
      }
    })
    return fontMap
  }

  /**
   * @description: 分割原始数据
   * @param {any} data
   * @return {*}
   */
  public splitGlobalText = (sections, collects, para) => { // 打平为二维数组，一维为span的group集合，二维为span组内的text字符，每个字符样式继承span
    sections.forEach((paragraph, index) => {
      if (paragraph.children && Array.isArray(paragraph.children)) {
        collects = collects.concat(this.splitGlobalText(paragraph.children, [], paragraph))
      } else {
        collects.push({
          // ...DEFAULT_FONT,
          isSpill: para.isSpill,
          // fontSize: para.fontSize,
          // lineHeight: para.lineHeight,
          isStart: !index ? true : false,
          isEnd: index === sections.length - 1 ? true : false,
          text: paragraph.text.length ? paragraph.text.split('').map(textItem => {
            return {
              ...DEFAULT_FONT,
              ...paragraph,
              text: textItem,
            }
          }) : [{
            ...DEFAULT_FONT,
            ...paragraph,
            text: '',
          }]
        })
      }
    });
    return collects
  }

  /**
   * @description: 获取字符fontStyle
   * @return {*}
   */
  get fontStyle() {
    return this._fontStyle
  }

  /**
   * @description: 初始化计算dom
   * @return {*}
   */
  public initCalcDom(): void {
      if(this.caliper) {
        return
      }
      this.parent = document.createElement('div');
      this.caliper = document.createElement('span')
      this.vernier = document.createElement('div')
      this.setAttr(this.parent, {
        position: 'fixed',
        top: '0px',
        left: '0px',
        background: 'grey',
        display: 'block',
        'z-index': '-99',
        'transform-origin': 'left top',
        transform: 'scale(0.1)',
        'line-height': 'normal',
        opacity: '0'
      });
      
      this.setAttr(this.vernier, {
        display: 'inline-block',
        height: '1px',
        background: 'red',
        'vertical-align': 'baseline',
      })
      this.parent.appendChild(this.caliper)
      this.parent.appendChild(this.vernier)
      document.body.appendChild(this.parent)
  }

  /**
   * @description: 销毁计算宽度dom
   * @return {*}
   */
  public removeDom() {
    if(!this.parent) {
      return
    }
    this.parent?.remove();
    this.caliper = null;
    this.vernier = null
    this.parent = null;
  }

  public clearWidth() {
    this.width = 0;
  }

  /**
   * @description: 计算
   * @param {*} str
   * @param {*} style
   * @return {*}
   */
  public calcMetrics(strInfo, style) {
    let fontInfo = this.localMetrics(strInfo, style)
    this.width += Number(fontInfo.width) / BASE_SCALE
    return fontInfo
  }

  /**
   * @description: 插入字符 计算宽高
   * @return {*}
   */
  public localMetrics(strInfo, style): FontStrList {
    // 查询缓存并使用
    if(FontCache.getEntry({...strInfo})) {
      let info = FontCache.getEntry(strInfo)
      return {
        ...info,
        ...strInfo
      }
    }
    const { fontFamily, fontSize, fontStyle, fontVariant, fontWeight, textDecoration, lineHeight } = strInfo
    // 插入文字
    this.caliper.innerText = strInfo.text;
    // 设置字体样式
    this.setAttr(this.caliper, {
      fontFamily,
      fontSize,
      lineHeight,
      fontStyle,
      fontVariant,
      fontWeight,
      textDecoration,
      'white-space': 'pre',
    });

    // 字符元素至顶部位置
    let caliperTop = this.caliper.offsetTop;
    // 字符下方元素至顶部位置
    let vernierTop = this.vernier.offsetTop;
    // 获取当前字符宽度
    let caliperWidth = this.caliper.offsetWidth
    // 获取当前字符高度
    let caliperHeight = this.caliper.offsetHeight
    let fontInfo = {
      ...strInfo,
      width: caliperWidth.toFixed(2) ,
      height: caliperHeight.toFixed(2),
      descent: (caliperHeight - (vernierTop - caliperTop)).toFixed(2),
      ascent: (vernierTop - caliperTop).toFixed(2),
    }
    // 添加缓存
    FontCache.addEntry(fontInfo)
    return  fontInfo
  }

  /**
   * @description: 设置dom style
   * @param {HTMLElement} element 当前元素
   * @param {StyleObject} styleObj style 属性
   * @return {*}
   */
  private setAttr(element: HTMLElement, styleObj: StyleObject): void {
    for (let prop in styleObj) {
      if(prop === 'fontSize') {
        element.style.fontSize = parseInt(styleObj[prop], 10) * BASE_SCALE + 'px'
        
      } else if (styleObj.hasOwnProperty(prop)) {
        element.style[prop] = styleObj[prop];
      }
    }
  }
  
   /**
   * @description: 数据合并 将经过拆分的 isSpill 合并回原数组
   * @param {*} data
   * @return {*}
   */
   concatLine(data) {
    // 深拷贝拆分后的数据
    let textData = deepClone(data);
    // 创建一个新的要合并的数组
    let resetTextData:any = [];

    textData.forEach((text) => {
      let lastIndex = resetTextData.length - 1
      if(text.isSpill && resetTextData.length) {
        resetTextData[lastIndex].children.push(...text.children)
      } else {
        resetTextData.push(text);
      }
    })
    return resetTextData
  }
}
