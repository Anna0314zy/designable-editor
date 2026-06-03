import { Button, Form, Input, Tabs, Typography, message } from 'antd'
import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { Dispatch } from '@/store'
import './styles.less'

interface AuthFormValues {
  username: string
  password: string
}

const redirectFallback = '/course'

const getSafeRedirect = (redirect: string) => {
  if (!redirect) return redirectFallback
  if (!/^https?:\/\//.test(redirect)) return redirect

  try {
    const url = new URL(redirect)
    return url.origin === window.location.origin
      ? `${url.pathname}${url.search}${url.hash}`
      : redirectFallback
  } catch {
    return redirectFallback
  }
}

function AuthPage() {
  const dispatch = useDispatch<Dispatch>()
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [submitting, setSubmitting] = useState(false)

  const redirectTo = useMemo(() => {
    const state = location.state as { from?: { pathname?: string; search?: string; hash?: string } } | null
    const params = new URLSearchParams(location.search)
    const from = state?.from
      ? `${state.from.pathname || ''}${state.from.search || ''}${state.from.hash || ''}`
      : ''
    return getSafeRedirect(params.get('redirect') || from)
  }, [location.search, location.state])

  const handleSubmit = async (values: AuthFormValues) => {
    setSubmitting(true)
    try {
      if (mode === 'login') {
        await dispatch.auth.login(values)
        message.success('登录成功')
      } else {
        await dispatch.auth.register(values)
        message.success('注册成功')
      }
      navigate(redirectTo, { replace: true })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-panel">
        <Typography.Title level={2}>Slides Engine</Typography.Title>
        <Tabs
          activeKey={mode}
          onChange={(key) => setMode(key as 'login' | 'register')}
          items={[
            { key: 'login', label: '登录' },
            { key: 'register', label: '注册' },
          ]}
        />
        <Form<AuthFormValues>
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
    </div>
  )
}

export default AuthPage
