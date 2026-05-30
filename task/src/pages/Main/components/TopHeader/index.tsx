import { IconWidget } from '@editor/react'
import { Outlet } from 'react-router-dom'
const TopHeader = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const slideTitle = searchParams.get('title')
  const centerStyle = {
    display: 'flex',
    alignItems: 'center',
  }
  const wrapperStyle = {
    ...centerStyle,
    height: '40px',
    padding: '0 10px 0 8px',
    justifyContent: 'space-between',
  }
  return (
    <div style={{ width: '100%', height: '100%',display:'flex',flexDirection:'column'}}>
      <div style={wrapperStyle}>
        <div className='left' style={centerStyle}>
          <IconWidget infer='Logo' style={{ margin: 10, height: 24, width: 24 }} />
          <span> {slideTitle === 'null' ? '课件标题' : slideTitle}</span>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
export default TopHeader
