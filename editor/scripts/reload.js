const getVersion = async () => {
  if (import.meta.env.MODE === 'dev') {
    location.replace(window.origin + `/slide.html${location.search}`)
    return
  }

  const url = `${import.meta.env.VITE_API_SERVER}/classroom-slides/manage/${import.meta.env.VITE_APP_NAME}/current-version`
  const headers = {
    'Content-Type': 'application/json',
    Token: import.meta.env.VITE_ADMIN_TOKEN,
  }
  const getVersionFromPath = () => {
    const match = location.pathname.match(/\/slide-editor\/([^/]+)\/slide\.html/)
    return match?.[1]
  }
  const redirectToSlide = (version) => {
    if (!version) {
      alert('版本获取错误')
      console.error('Current slide editor version is empty')
      return
    }
    localStorage.setItem('EditorVersion', version)
    location.replace(`${location.origin}/slide-editor/${version}/slide.html${location.search}`)
  }

  fetch(url, {
    method: 'GET',
    headers,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('版本获取错误')
      }
      return response.json()
    })
    .then((res) => {
      const { code, data } = res
      if (code === 200) {
        const version =
          data?.currentVersion ||
          data?.version ||
          localStorage.getItem('EditorVersion') ||
          getVersionFromPath()
        redirectToSlide(version)
      }
    })
    .catch((error) => {
      alert('版本获取错误')
      console.error('There was a problem with your fetch operation:', error)
    })
}

getVersion()
