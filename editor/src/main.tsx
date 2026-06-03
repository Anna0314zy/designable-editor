/*
 * @Date: 2023-12-06 19:04:36
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-03-15 14:01:21
 * @FilePath: /slides-engine/editor/src/main.tsx
 */
import React, {useState} from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { withProvider} from '@play/render'
// import * as Sentry from "@sentry/react";
import { Spin, ConfigProvider } from 'antd';
import NoPermission from './components/403';
import { HoxRoot } from "hox";
import { setToken } from './utils/common'
import { refreshToken } from './api/auth'

// Sentry.init({
//   dsn: "https://c19239d42f384f778e46481442d795b0@sentry.ledupeiyou.com/34",
//   integrations: [
//     new Sentry.BrowserTracing({
//       // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
//       tracePropagationTargets: ["sentry.ledupeiyou.com"],
//     }),
//   ],
//   tracesSampleRate: 1.0,
// });
const AppWrapper = withProvider(App, {});

const redirectToLogin = () => {
  const regex = /(\d+\.\d+\.\d+)/;
  const TaskVersion = localStorage.getItem("TaskVersion");
  const homeUrl = import.meta.env.VITE_HOME_SERVER.replace(
    regex,
    TaskVersion || "1.0.0"
  );
  const redirect = encodeURIComponent(window.location.href)
  location.replace(`${homeUrl}#/login?redirect=${redirect}`)
}

const refreshAccessToken = async () => {
  const session = await refreshToken()
  setToken(session.accessToken)
}

const ensureAuthenticated = async () => {
  // if (import.meta.env.MODE === 'dev' || getToken()) return true
  try {
    await refreshAccessToken()
    return true
  } catch {
    redirectToLogin()
    return false
  }
}

const renderApp = () => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
      <HoxRoot>
        <ConfigProvider theme={{ hashed: false }}>
            <Load />
        </ConfigProvider>
      </HoxRoot>
  )
}

const bootstrap = async () => {
  if (!(await ensureAuthenticated())) return
  renderApp()
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


void bootstrap()
