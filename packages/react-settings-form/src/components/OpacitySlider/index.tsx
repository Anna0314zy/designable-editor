import React, { useState } from 'react'
import { Col, Row, InputNumber, Slider } from 'antd'
import { observer } from '@slides/react'

export interface IOpacitySliderProps {
  value?: number
  onChange?: (value: string) => void
}

export const OpacitySlider: React.FC<IOpacitySliderProps> = observer(
  (props) => {
    const [inputValue, setInputValue] = useState(
      props.value ? props.value * 100 : 100
    )

    const onChange = (newValue: number) => {
      setInputValue(newValue)
      props.onChange((newValue / 100).toString())
    }

    return (
      <Row>
        <Col span={12}>
          <Slider
            min={0}
            max={100}
            onChange={onChange}
            value={typeof inputValue === 'number' ? inputValue : 0}
          />
        </Col>
        <Col span={10}>
          <InputNumber
            min={0}
            max={100}
            style={{ margin: '0 10px' }}
            value={inputValue}
            onChange={onChange}
          />
        </Col>
      </Row>
    )
  }
)
