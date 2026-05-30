/*
 * @Date: 2024-01-12 16:20:46
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-03-14 19:51:55
 * @FilePath: /slides-engine/task/src/App.tsx
 */
import { HashRouter as Router } from 'react-router-dom'
import Routes from './router'
import { ConfigProvider } from 'antd'
export const basename = '/'
import { fontBootstrap, fontConfigList, FontFormatCollection } from '@slide/fonts'

fontBootstrap(fontConfigList, './', [FontFormatCollection.woff])
function App() {
  return (
    <Router basename={basename}>
      <ConfigProvider>
        <Routes />
      </ConfigProvider>
    </Router>
  )
}

export default App
