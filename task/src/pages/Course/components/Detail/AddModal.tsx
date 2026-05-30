import React, { useState, forwardRef, useCallback, memo, useImperativeHandle, useEffect } from 'react'
import { Modal, Form, Input, Button } from 'antd'
import { addLessonInformation } from '@/api/models/course'
import { Slide } from './index'
type FieldType = {
  lessonInfomation: string
}
const AddModal = ({ data, getSlideData }: { data: Slide; getSlideData: () => void }, ref: any) => {
  const [visible, setVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [form] = Form.useForm()
  const cancel = () => {
    setVisible(false)
  }
  const open = () => {
    setVisible(true)
  }
  // 绑定ref对外引用
  useImperativeHandle(ref, () => ({
    open,
    cancel,
  }))

  const handleCancel = useCallback(() => {
    setVisible(false)
  }, [])
  const handleOk = useCallback(() => {
    form.validateFields().then(async values => {
      console.log('Success:', values)
      setConfirmLoading(true)
      try {
        await addLessonInformation({
          mainId: data.mainId!,
          serialNumber: data.serialNumber!,
          lessonInformation: values.lessonInfomation,
        })
        getSlideData()
      } finally {
        setConfirmLoading(false)
        setVisible(false)
      }
    })
  }, [data, form, getSlideData])
  useEffect(() => {
    form.setFieldsValue({ lessonInfomation: data.lessonInformation })
  }, [data, form])
  return (
    <Modal
      open={visible}
      centered={true}
      onCancel={handleCancel}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      destroyOnClose
    >
      <Form form={form} name='basic' style={{ padding: '20px 20px 0 20px' }} autoComplete='off'>
        <Form.Item<FieldType>
          label='课程信息'
          name='lessonInfomation'
          rules={[{ required: true, message: '不能为空!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default memo(forwardRef(AddModal))
