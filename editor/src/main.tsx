/*
 * @Date: 2023-12-06 19:04:36
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-03-15 14:01:21
 * @FilePath: /slides-engine/editor/src/main.tsx
 */
import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { withProvider} from '@play/render'
// import * as Sentry from "@sentry/react";
import { Spin, ConfigProvider } from 'antd';
import NoPermission from './components/403';
import EditorAuth from './components/EditorAuth';
import { HoxRoot } from "hox";
import { getToken, setToken } from './utils/common'
import { AuthSession, refreshToken } from './api/auth'
import "antd/dist/reset.css";

// Sentry.init({
//   dsn: "https://c19239d42f384f778e46481442d795b0@sentry.example.com/34",
//   integrations: [
//     new Sentry.BrowserTracing({
//       // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
//       tracePropagationTargets: ["sentry.example.com"],
//     }),
//   ],
//   tracesSampleRate: 1.0,
// });
const AppWrapper = withProvider(App, {});

const refreshAccessToken = async () => {
  const session = await refreshToken()
  setToken(session.accessToken)
}

const renderApp = () => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
      <HoxRoot>
        <ConfigProvider theme={{ hashed: false }}>
            <AuthGate />
        </ConfigProvider>
      </HoxRoot>
  )
}

const Load = () => {
  const [SlideLoading, setSlideLoading] = useState(true)
  const [noPermission, setNoPermission] = useState('') // 是否

  return (
    <Spin tip="课件加载中..." spinning={SlideLoading} style={{position:'fixed', height: '50px', top: '50%'}} >
      {noPermission ? <NoPermission name={noPermission}/> : <AppWrapper setLoading={setSlideLoading} setNoPermission={setNoPermission}/>}
    </Spin>
  );
}

const AuthGate = () => {
  const [authStatus, setAuthStatus] = useState<'checking' | 'authed' | 'guest'>('checking')

  useEffect(() => {
    let mounted = true
    if (getToken()) {
      setAuthStatus('authed')
    } else {
      refreshAccessToken()
        .then(() => {
          if (mounted) setAuthStatus('authed')
        })
        .catch(() => {
          if (mounted) setAuthStatus('guest')
        })
    }
    return () => {
      mounted = false
    }
  }, [])

  const handleAuthSuccess = (session: AuthSession) => {
    setToken(session.accessToken)
    setAuthStatus('authed')
  }

  if (authStatus === 'checking') {
    return (
      <Spin
        tip="登录态校验中..."
        spinning
        style={{ position: 'fixed', height: '50px', top: '50%' }}
      />
    )
  }

  if (authStatus === 'guest') {
    return <EditorAuth onSuccess={handleAuthSuccess} />
  }

  return <Load />
}

renderApp()
