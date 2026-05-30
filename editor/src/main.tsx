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
import * as Sentry from "@sentry/react";
import { Spin, ConfigProvider } from 'antd';
import {getSysVersion} from './api/auth'
import NoPermission from './components/403';
import { HoxRoot } from "hox";

Sentry.init({
  dsn: "https://c19239d42f384f778e46481442d795b0@sentry.ledupeiyou.com/34",
  integrations: [
    new Sentry.BrowserTracing({
      // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ["sentry.ledupeiyou.com"],
    }),
  ],
  tracesSampleRate: 1.0,
});
const AppWrapper = withProvider(App, {});

const Load = () => {
  const [loading, setLoading] = useState(true) // 获取版本loading
  const [SlideLoading, setSlideLoading] = useState(true) // 课件是否加载loading
  const [noPermission, setNoPermission] = useState('') // 是否

  const updateVersion = async () => {
    const res = await getSysVersion({systemName: import.meta.env.VITE_APP_NAME})
    const regex = /(\d+\.\d+\.\d+)/;
    const match = location.href.match(regex);
    const url = `${location.origin}/slide-editor/${res.currentVersion}/index.html${location.search}`
    if (match && match[1] !== res.currentVersion) { // url版本号与最新版不同，刷新一下
      setLoading(false)
      location.replace(url)
    } else {
      setLoading(false)
      localStorage.setItem('EditorVersion', res.currentVersion)
    }
  }
  useEffect(() => {
    if (import.meta.env.MODE === 'dev') {
      setLoading(false)
      return
    }
    updateVersion()
  }, [])
  return (
    <Spin tip="课件加载中..." spinning={loading || SlideLoading} style={{position:'fixed', height: '50px', top: '50%'}} >
      {noPermission ? <NoPermission name={noPermission}/> : <AppWrapper setLoading={setSlideLoading} setNoPermission={setNoPermission}/>}
    </Spin>
  );
}


ReactDOM.createRoot(document.getElementById('root')!).render(
    <HoxRoot>
      <ConfigProvider theme={{ hashed: false }}>
          <Load />
      </ConfigProvider>
    </HoxRoot>
)
