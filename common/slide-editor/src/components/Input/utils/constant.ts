/*
 * @Date: 2023-11-23 17:53:11
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-02-05 10:26:05
 * @FilePath: /slides-engine/common/slide-editor/src/components/Input/utils/constant.ts
 */
export const KEY_CODE = {
    F1: 'F1',
    Command: 'Command',
    Meta: 'Meta',
    Shift: 'Shift',
    Ctrl: 'Control',
    Alt: 'Alt',
    CapsLock: 'CapsLock',
    Tab: 'Tab',
    ArrowUp: 'ArrowUp',
    ArrowDown: 'ArrowDown',
    ArrowLeft: 'ArrowLeft',
    ArrowRight: 'ArrowRight',
    Home: 'Home',
    End: 'End',
    PageUp: 'PageUp',
    PageDown: 'PageDown',
  }
    
export const KEY_CODE_EVENT = (event) => {
    return event.key as any
}

export const DEFAULT_FONT = {
    // 这个是关键 识别空格
    'white-space': 'pre',
    fontFamily: 'SimFZzhunyuan,SimSun',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontVariant: 'normal',
    textDecoration: 'normal',
    fontSize: '60px',
    lineHeight: '1.2',
    color: 'rgba(35,35,35,1)'
}

export const SPLIT_STATUS = {
    SPLIT: 'split', // 拆快状态
    CONCAT: 'concat', // 合并状态
    NORMAL: 'normal' // 正常状态
}

export const KEYUP_TIME = 700;

export const KEY_CODE_LIST = Object.values(KEY_CODE)