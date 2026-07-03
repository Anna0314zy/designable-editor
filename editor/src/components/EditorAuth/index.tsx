import React from 'react'
import { Button, Form, Input, Tabs, Typography, message } from 'antd'
import { useState } from 'react'
import { login, register, AuthCredentials, AuthSession } from '../../api/auth'
import './styles.less'

interface EditorAuthProps {
  onSuccess: (session: AuthSession) => void
}

const EditorAuth: React.FC<EditorAuthProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (values: AuthCredentials) => {
    setSubmitting(true)
    try {
      const session = mode === 'login'
        ? await login(values)
        : await register(values)
      message.success(mode === 'login' ? '登录成功' : '注册成功')
      onSuccess(session)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="editor-auth-page">
      <section className="editor-auth-panel">
        <Typography.Title level={2}>Slides Engine</Typography.Title>
        <Tabs
          activeKey={mode}
          onChange={(key) => setMode(key as 'login' | 'register')}
          items={[
            { key: 'login', label: '登录' },
            { key: 'register', label: '注册' },
          ]}
        />
        <Form<AuthCredentials>
          layout="vertical"
          initialValues={{ username: 'zouyu', password: '123456' }}
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少 3 个字符' },
            ]}
          >
            <Input placeholder="请输入用户名" autoComplete="username" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少 6 个字符' },
            ]}
          >
            <Input.Password
              placeholder="请输入密码"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting} block>
            {mode === 'login' ? '登录' : '注册并登录'}
          </Button>
        </Form>
      </section>
    </main>
  )
}

export default EditorAuth
