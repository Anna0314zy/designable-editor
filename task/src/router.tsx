import { Routes, Route, Navigate } from 'react-router-dom'
import WithAsync from '@/components/hoc/WithAsync'
import WithCheck from '@/components/WithCheck'
import { useEffect, useState } from 'react'
const TaskMain = WithAsync(() => import(/* webpackChunkName:"EditorMain" */ './pages/Main'))
const TopHeader = WithAsync(() => import(/* webpackChunkName:"EditorMain" */ './pages/Main/components/TopHeader'))
const Course = WithAsync(() => import(/* webpackChunkName:"EditorMain" */ './pages/Course'))
const Preview = WithAsync(() => import(/* webpackChunkName:"EditorMain" */ './pages/Preview'))
// const EditorPreview = WithAsync(() => import(/* webpackChunkName:"EditorMain" */ './pages/EditorPreview'))
import EditorPreview from './pages/EditorPreview'
const EnhancedTaskMain = WithCheck(TaskMain);
const EnhancedCourse = WithCheck(Course);
const EnhancedPreview = WithCheck(Preview);
import { getToken } from './utils/auth'
import { HoxRoot } from '@play/render'
import * as api from './api/models/auth'

const PrivateRoute = ({ element }: { element: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getSysVersion = async () => {
    const regex = /(\d+\.\d+\.\d+)/;
    const match = location.href.match(regex);
    const res = await api.getSysVersion({systemName: import.meta.env.VITE_APP_NAME}, import.meta.env.VITE_ADMIN_TOKEN as string)
    const url = location.href.replace(regex, res.currentVersion)
    if (match && match[1] !== res.currentVersion) { // url版本号与最新版不同，刷新一下
      location.replace(url)
    } else {
      localStorage.setItem('TaskVersion', res.currentVersion)
      setIsAuthenticated(true)
    }
  }
  useEffect(() => {
    if(import.meta.env.MODE === 'dev') {
      setIsAuthenticated(true)
      return
    }
    getSysVersion()
  }, [])
  return isAuthenticated ? element : <></>
};
export default function RoutesComponent() {
  useEffect(() => {
    const url = new URL(window.location.href)
    const sysToken = url.searchParams.get('sysToken')
    if (sysToken) {
      const originToken = getToken()
      if (originToken) {
        if (originToken !== sysToken) {
          // TODO 更新用户信息
        }
      }
      localStorage.setItem('systemToken', sysToken)
      url.searchParams.delete('sysToken')
      window.history.replaceState(null, '', url.toString())
    }
  }, [])
  return (
    <HoxRoot>
      <Routes>
        <Route path='/' element={<Navigate to='/course' />}/>
        <Route path='/course' element={<PrivateRoute element={<EnhancedCourse />} />} />
        <Route path='/task' element={<PrivateRoute element={<TopHeader />} />}>
          <Route path=':id' element={<EnhancedTaskMain/>} />
          <Route path='preview/:id' element={<Preview />}/>
        </Route>
        <Route path='/editor/preview/:id' element={<PrivateRoute element={<EditorPreview />} />} />
        <Route path='/preview/:id' element={<PrivateRoute element={<EnhancedPreview />} />} />
      </Routes>
    </HoxRoot>
  )
}
