import React, { useRef } from 'react'
import { Input, Popover, Col, ColorPicker, Divider, Row, Space, theme } from 'antd'
import type { ColorPickerProps } from 'antd';
import { usePrefix } from '@editor/react'
import { generate, gray, presetPalettes, red, geekblue, blue } from '@ant-design/colors';
import { ColorBlock, Color as RcColor } from '@rc-component/color-picker';
import classNames from 'classnames';
import './styles.less'

export interface IColorInputProps {
  value?: string
  onChange?: (color: string) => void
}
type Presets = Required<ColorPickerProps>['presets'][number];

const roundFun = (value: number, fractionDigits = 0) => {
  return Math.round(value * Math.pow(10, fractionDigits)) / Math.pow(10, fractionDigits);
}

const getRGBA = (color: RcColor) => {
  return `rgba(${Math.floor(color.r)},${Math.floor(color.g)},${Math.floor(color.b)},${roundFun(color.a, 2)})`
}

const BASE = 16;
const HEX_REGEX = /^#?[a-fA-F0-9]+$/;
const HEX_SHORTHAND_LENGTH = 3;
const HEX_LENGTH = 6;

function hex2rgba(hex: any, alpha) {
  if (!HEX_REGEX.test(hex)) {
    console.error('hex2rgba: first argument has invalid hexadecimal characters')
  }

  // trim unnecessary characters
  if (hex[0] === '#') {
    hex = hex.slice(1);
  }

  // expand shorthand
  if (hex.length === HEX_SHORTHAND_LENGTH) {
    hex = hex.split('');
    hex.splice(2, 0, hex[2]);
    hex.splice(1, 0, hex[1]);
    hex.splice(0, 0, hex[0]);
    hex = hex.join('');
  }

  if (hex.length !== HEX_LENGTH) {
    console.error('hex2rgba: first argument has invalid hexadecimal length')
  }

  // convert hex to rgb
  var values = [
    parseInt(hex.slice(0, 2), BASE),
    parseInt(hex.slice(2, 4), BASE),
    parseInt(hex.slice(4, 6), BASE)
  ];

  alpha = typeof alpha === 'number' ? alpha : parseFloat(alpha);
  if (alpha >= 0 && alpha <= 1) {
    values.push(alpha);
  } else {
    values.push(1);
  }

  return {
    r: values[0],
    g: values[1],
    b: values[2],
    a: 1
  }
};

const colorHistory = {
  setHistory: (color: RcColor) => {
    const history = localStorage.getItem('colorHistory') || '[]'
    const colors = JSON.parse(history)
    // 把重复的，后面的删掉，前面的保留
    colors.reduce((acc: any, cur: any, index: number) => {
      if (cur.metaColor.r === color.metaColor.r && cur.metaColor.g === color.metaColor.g && cur.metaColor.b === color.metaColor.b && cur.metaColor.a === color.metaColor.a) {
        colors.splice(index, 1)
      }
    }, [])

    // 总数不允许大于 14 个，大于 14 个时，删除最后一个
    if (colors.length >= 20) {
      colors.pop()
    }
    colors.unshift(color)

    localStorage.setItem('colorHistory', JSON.stringify(colors))
  },
  getHistory: () => {
    const history = localStorage.getItem('colorHistory') || '[]'
    return JSON.parse(history)
  }
}


const genPresets = (presets = presetPalettes) =>
  Object.entries(presets).splice(Object.entries(presets).length - 3, Object.entries(presets).length - 1).map<Presets>(([label, colors]) => ({
    label,
    colors,
  }));



const ColorItem: React.FC<{ colors: RcColor[], metaColor: any, onChangeComplete: Function }> = ({ colors, metaColor, onChangeComplete }) => {
  const activeColor = getRGBA(metaColor)
  console.log(metaColor, colors)
  const colorPresetsPrefixCls = 'ant-color-picker-presets';
  return (
    <div className={`${colorPresetsPrefixCls}`}>
      <div className={`${colorPresetsPrefixCls}-items`}>
        {
          colors.map((color: RcColor, index: number) => {
            const rgba = getRGBA(color.metaColor)
            return <ColorBlock
              key={`preset-${index}}`}
              color={rgba}
              prefixCls={'ant-color-picker'}
              className={classNames(`${colorPresetsPrefixCls}-color`, {
                [`${colorPresetsPrefixCls}-color-checked`]:
                  rgba === activeColor,
                [`${colorPresetsPrefixCls}-color-bright`]: rgba !== activeColor,
              })}
              onClick={() => onChangeComplete(color)}
            />
          }
          )
        }
      </div>
    </div>
  )
}


export const ColorInput: React.FC<IColorInputProps> = (props) => {
  const container = useRef<HTMLDivElement>()
  const colorD = useRef<any>({
    metaColor: {
      r: 0,
      g: 0,
      b: 0,
      a: 1,
      format: "rgb",
      isValid: true,
      roundA: 1,
      originalInput: "rgb(0, 0, 0)"
    }
  } as any)
  const prefix = usePrefix('color-input')
  const color = props.value as string
  const { token } = theme.useToken();

  const onChangeComplete = (color) => {
    colorD.current = color
    const { metaColor } = color as any
    colorHistory.setHistory(color)
    props.onChange?.(getRGBA(metaColor))
  }

  const customPanelRender: ColorPickerProps['panelRender'] = (
    _: any,
    { components: { Picker, Presets } },
  ) => {
    const history = colorHistory.getHistory()
    // js 取色器
    const getEyeColor = () => {
      return new Promise((resolve, reject) => {
        const eyeDropper = new (window as any).EyeDropper();
        eyeDropper
          .open()
          .then((result) => {
            const rgba = hex2rgba(result.sRGBHex, 1)
            onChangeComplete({ metaColor: { r: rgba.r, g: rgba.g, b: rgba.b, a: rgba.a, format: "hex", isValid: true, roundA: 1, originalInput: result.sRGBHex } })
          })
          .catch((e) => {
          });
      })

    }

    return (<Row justify="space-between" wrap={false}>
      <Col span={13}>
        <div className="color-title">颜色库</div>
        <Presets />
        {
          history.length > 0 && (
            <>
              <Divider type="horizontal" style={{ height: 'auto' }} />
              <div className="color-title">最近使用</div>
              <ColorItem colors={history} metaColor={colorD.current.metaColor} onChangeComplete={onChangeComplete} />
            </>
          )
        }
      </Col>
      <Divider type="vertical" style={{ height: 'auto' }} />
      <Col flex="auto">
        <Picker />
        <div className="more-color" onClick={getEyeColor}>
          <i className='more-color-icon'></i>
          <span>取色器</span>
        </div>
      </Col>
    </Row>)
  };


  const presets = genPresets({
    primary: generate(token.colorPrimary),
    gray,
    red,
    blue
  });
  return (
    <div ref={container} className={prefix}>
      <Input
        value={props.value}
        onChange={(e) => {
          props.onChange?.(e.target.value)
        }}
        placeholder="Color"
        prefix={
          <ColorPicker
            placement="bottom"
            defaultValue="rgba(255,255,255,1)"
            styles={{ popupOverlayInner: { width: 480 } }}
            presets={presets}
            format="rgb"
            panelRender={customPanelRender}
            value={color}
            onChangeComplete={onChangeComplete}
          />
        }
      />
    </div>
  )
}
