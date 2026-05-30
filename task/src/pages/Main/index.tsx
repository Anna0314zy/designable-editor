import { useCallback } from 'react'
import './styles.less'
import { Layout,Form } from 'antd'
import TaskHeader from './components/Header'
const { Sider, Content } = Layout
import SlideLeft from './SlideLeft'
import Preview from './components/Preview'
import TaskSlide from './configPanel'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, Dispatch } from '@/store'
import { Page } from '@/store/models/page'
import FooterBar from './components/Footer'
import { GlobalContext } from './GlobalContext'
import { useGetSlideData } from '@/hooks/useGetSlideData'
function App() {
  const [form] = Form.useForm()
  const dispatch = useDispatch<Dispatch>()
  const { currentPage, slides, globalProps } = useSelector((state: RootState) => state.page)
  const handleClick = useCallback(
    (item: Page) => {
      dispatch.page.updatePage({ currentPage: item })
    },
    [dispatch.page],
  )
  useGetSlideData();
  return (
      <GlobalContext.Provider value={{form}}>
        <Layout className='task-container'>
          {/* <TopHeader/> */}
          <TaskHeader></TaskHeader>
          <Layout>
            <Sider theme='light' className='left-slider'>
              <SlideLeft data={slides.pageList} handleClick={handleClick}></SlideLeft>
            </Sider>
            <Content>
              <Preview data={currentPage} globalProps={globalProps} />
            </Content>
            <Sider theme='light' width={400}>
              <TaskSlide />
            </Sider>
          </Layout>
          <div>
            <FooterBar />
          </div>
        </Layout>
      </GlobalContext.Provider>
  )
}
export default App
