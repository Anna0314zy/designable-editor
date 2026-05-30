/*
 * @Date: 2024-03-14 17:06:13
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-03-15 14:01:00
 * @FilePath: /slides-engine/editor/scripts/reload.tsx
 */
const getVersion = async () => {
    if (import.meta.env.MODE === 'dev') {
      location.replace(`https://localhost:5175/slide.html${location.search}`)
      return
    }
    const url = `${import.meta.env.VITE_API_SERVER}/classroom-slides/manage/${import.meta.env.VITE_APP_NAME}/current-version`;
    const headers = {
      'Content-Type': 'application/json',
      'Token': import.meta.env.VITE_ADMIN_TOKEN
    };

    fetch(url, {
      method: 'GET',
      headers: headers
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('版本获取错误');
      }
      return response.json(); // 解析 JSON 数据
    })
    .then(res => {
      const {code, data} = res
      if (code === 200) {
        localStorage.setItem('EditorVersion', data.currentVersion)
        location.replace(`${location.origin}/slide-editor/${data.currentVersion}/slide.html${location.search}`)
      }
    })
    .catch(error => {
      alert('版本获取错误')
      console.error('There was a problem with your fetch operation:', error);
    });
    // const {status, }
  }
  getVersion()