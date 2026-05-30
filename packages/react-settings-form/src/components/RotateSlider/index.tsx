import React, { useEffect, useState } from 'react'
import { Col, Row, InputNumber, Slider } from 'antd'
import { observer } from '@slides/react'

export interface IRotateSliderProps {
  value?: string
  onChange?: (value: string) => void
}

export const RotateSlider: React.FC<IRotateSliderProps> = observer((props) => {
  const [inputValue, setInputValue] = useState(
    props.value ? Number(props.value.replace('deg', '')) : 0
  )
  useEffect(() => {
    if (props.value) {
      setInputValue(Number(props.value.replace('deg', '')))
    }
  }, [props.value])

  const onChange = (newValue: number) => {
    setInputValue(newValue)
    props.onChange(newValue.toString() + 'deg')
  }

  return (
    <Row>
      <Col span={12}>
        <Slider
          min={0}
          max={360}
          onChange={onChange}
          value={typeof inputValue === 'number' ? inputValue : 0}
        />
      </Col>
      <Col span={10}>
        <InputNumber
          min={0}
          max={360}
          style={{ margin: '0 10px' }}
          value={inputValue}
          onChange={onChange}
        />
      </Col>
    </Row>
  )
})
