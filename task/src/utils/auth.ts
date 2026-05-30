export const LoginUrl = `${import.meta.env.VITE_APP_LOGIN}?xes-origin=classroom-slides&callback=${
  window.location.origin + window.location.pathname 
}`
export const getToken = ()=> {
  // return import.meta.env.MODE === 'dev' ? "f47ac10b-58cc-4372-a567-0e02b2c3d479":localStorage.getItem('systemToken')
  return localStorage.getItem('systemToken')
}
export const getSysToken = () => {
  // 获取当前url的sysToken参数 保存到localStorage中 并删除url中的sysToken参数
  // const url = new URL(window.location.href)
  // const sysToken = url.searchParams.get('sysToken')
  // if (sysToken) {
  //   const originToken = getToken()
  //   if (originToken) {
  //     if (originToken !== sysToken) {
  //       // TODO 更新用户信息
  //     }
  //   }
  //   localStorage.setItem('systemToken', sysToken)
  //   url.searchParams.delete('sysToken')
  //   window.history.replaceState(null, '', url.toString())
  // } else {
    
  // }
  const temp = getToken()
    if (!temp) {
      localStorage.removeItem('systemToken');
      window.location.href = LoginUrl
    }
}
