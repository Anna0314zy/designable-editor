import React, { useEffect, useState } from 'react'
import { useField, observer } from '@slides/react'
import { usePrefix } from '@editor/react'
import { FoldItem } from '../FoldItem'
import { SizeInput } from '../SizeInput'
import { InputItems } from '../InputItems'
import cls from 'classnames'
import { Col, Row, InputNumber, Slider } from 'antd'

type TransType = 'translateX' | 'translateY' | 'rotate'
export interface IBoxTransformStyleProps {
  className?: string
  style?: React.CSSProperties
  labels?: React.ReactNode[]
  value?: string
  title?: string
  onChange?: (value: string) => void
  hideRotate?:boolean
}

export const BoxTransformStyle: React.FC<IBoxTransformStyleProps> = observer(
  (props) => {
    const field = useField()
    const prefix = usePrefix('transform-style-setter')

    const [rotateValue, setRotateValue] = useState<any>()

    useEffect(() => {
      console.log(11112)

      if (props?.value) {
        const propsValue = props.value || 'translate(0px, 0px) rotate(0deg)'
        let rotateValue = propsValue.match(/rotate\((-?\d+(\.\d+)?)deg\)/) || []
        console.log(1111, rotateValue)
        let x = parseFloat(translateMatch(propsValue)[0] || '') || 0
        let y = parseFloat(translateMatch(propsValue)[1] || '') || 0

        const handlerX = createTransformHandler('translateX', props)
        handlerX.onChange(x.toString() + 'px')
        const handlerY = createTransformHandler('translateY', props)
        handlerY.onChange(y.toString() + 'px')
        let rotate = parseFloat(rotateValue[1] || '')
        if(rotate < 0 ) {
          rotate = 360-(Math.abs(rotate) % 360)
        }
        setRotateValue(rotate % 360 || 0)
      }
    }, [props?.value])

    const translateMatch = (value: string) => {
      let test =
        value.match(/translate\((-?\d+(\.\d+)?)px, (-?\d+(\.\d+)?)px\)/) || []
      return [test[1], test[3]]
    }

    const createTransformHandler = (
      transType: TransType,
      props?: IBoxTransformStyleProps
    ) => {
      return {
        ...props,
        value:
          transType == 'translateX'
            ? parseFloat(translateMatch(props.value || '')[0] || '') || 0
            : transType == 'translateY'
            ? parseFloat(translateMatch(props.value || '')[1] || '') || 0
            : props.value,
        onChange(value: any) {
          let valueTrans = props.value
          const replaceTranslate = /translate\((-?\d+(\.\d+)?)px, (-?\d+(\.\d+)?)px\)/
          const replaceRotate = /rotate\(-?\d+deg\)/
          let hasRotate = /rotate/.test(valueTrans)
          if (!hasRotate) {
            valueTrans += ' rotate(0deg)'
          }
          let x = parseFloat(translateMatch(valueTrans)[0] || '') || 0
          let y = parseFloat(translateMatch(valueTrans)[1] || '') || 0

          if (transType === 'translateX') {
            valueTrans = valueTrans.replace(
              replaceTranslate,
              `translate(${value || '0px'}, ${y}px)`
            )
          } else if (transType === 'translateY') {
            valueTrans = valueTrans.replace(
              replaceTranslate,
              `translate(${x}px, ${value || '0px'})`
            )
          } else if (transType === 'rotate') {
            valueTrans = valueTrans.replace(
              replaceRotate,
              `rotate(${value || '0deg'})`
            )
          }
          props.onChange?.(valueTrans)
        },
      }
    }

    const onChange = (newValue: number) => {
      setRotateValue(newValue)
      const handler = createTransformHandler('rotate', {...props})
      handler.onChange(newValue.toString() + 'deg')
    }

    return (
			<FoldItem className={cls(prefix, props.className)} label={field.title}>
				<FoldItem.Extra>
					<InputItems width="50%">
						<InputItems.Item title={props.labels[0]}>
							<SizeInput {...createTransformHandler("translateX", props)} />
						</InputItems.Item>
						<InputItems.Item title={props.labels[1]}>
							<SizeInput {...createTransformHandler("translateY", props)} />
						</InputItems.Item>
					</InputItems>
					{props?.hideRotate ? null : (
						<Row>
							<Col span={4} style={{ lineHeight: "34px" }}>
								旋转
							</Col>
							<Col span={10}>
								<Slider
									min={0}
									max={360}
									onChange={onChange}
									value={typeof rotateValue === "number" ? rotateValue : 0}
								/>
							</Col>
							<Col span={4}>
								<InputNumber
									min={0}
									max={360}
									style={{ margin: "0 10px" }}
									value={rotateValue}
									onChange={onChange}
								/>
							</Col>
						</Row>
					)}
				</FoldItem.Extra>
			</FoldItem>
		);
  }
)
