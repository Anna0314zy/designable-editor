import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import WithAsync from '@/components/hoc/WithAsync'
import WithCheck from '@/components/WithCheck'
import { useEffect, useState } from 'react'
const TaskMain = WithAsync(() => import(/* webpackChunkName:"EditorMain" */ './pages/Main'))
const TopHeader = WithAsync(() => import(/* webpackChunkName:"EditorMain" */ './pages/Main/components/TopHeader'))
const Course = WithAsync(() => import(/* webpackChunkName:"EditorMain" */ './pages/Course'))
const Preview = WithAsync(() => import(/* webpackChunkName:"EditorMain" */ './pages/Preview'))
const AuthPage = WithAsync(() => import(/* webpackChunkName:"AuthPage" */ './pages/Auth'))
// const EditorPreview = WithAsync(() => import(/* webpackChunkName:"EditorMain" */ './pages/EditorPreview'))
import EditorPreview from './pages/EditorPreview'
const EnhancedTaskMain = WithCheck(TaskMain);
const EnhancedCourse = WithCheck(Course);
const EnhancedPreview = WithCheck(Preview);
import { getToken, setAuthSession } from './utils/auth'
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
    getSysVersion()
  }, [])
  return isAuthenticated ? element : <></>
};

const RequireAuth = ({ element }: { element: React.ReactNode }) => {
  const location = useLocation()
  const [status, setStatus] = useState<'checking' | 'authenticated' | 'anonymous'>(
    getToken() ? 'authenticated' : 'checking',
  )

  useEffect(() => {
    if (getToken()) {
      setStatus('authenticated')
      return
    }
    api.refreshToken()
      .then((session) => {
        setAuthSession(session)
        setStatus('authenticated')
      })
      .catch(() => {
        setStatus('anonymous')
      })
  }, [])

  if (status === 'checking') return <></>
  return status === 'authenticated' ? element : <Navigate to="/login" replace state={{ from: location }} />
}

const PublicOnlyRoute = ({ element }: { element: React.ReactNode }) => {
  return getToken() ? <Navigate to="/course" replace /> : element
}

export default function RoutesComponent() {
  return (
    <HoxRoot>
      <Routes>
        <Route path='/' element={<Navigate to='/course' />}/>
        <Route path='/login' element={<PublicOnlyRoute element={<AuthPage />} />} />
        <Route path='/course' element={<RequireAuth element={<PrivateRoute element={<EnhancedCourse />} />} />} />
        <Route path='/task' element={<RequireAuth element={<PrivateRoute element={<TopHeader />} />} />}>
          <Route path=':id' element={<EnhancedTaskMain/>} />
          <Route path='preview/:id' element={<Preview />}/>
        </Route>
        <Route path='/editor/preview/:id' element={<RequireAuth element={<PrivateRoute element={<EditorPreview />} />} />} />
        <Route path='/preview/:id' element={<RequireAuth element={<PrivateRoute element={<EnhancedPreview />} />} />} />
      </Routes>
    </HoxRoot>
  )
}
