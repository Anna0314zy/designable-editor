import { useEffect, useRef, useState } from 'react'
import Pomelo from './pomelo'
import { getUrlParams } from './utils'
import './App.css'
import { config } from 'process'
// import Config from './config.json'
let Config = {}
const pomelo = new Pomelo();
const role = getUrlParams(location.href, 'role')
const env = getUrlParams(location.href, 'env')
console.log(env, ' env')
const host = env === 'prod' ? 'https://classroom-api-online.saasp.vdyoo.com/classroom-slides' : 'https://test-class-api-online.saasp.vdyoo.com/classroom-slides'
const cdnHost = env === 'prod' ? 'https://slides-resources.ledupeiyou.com' : 'https://slides-resources-test.ledupeiyou.com'
let slideConfig = `${host}/dev/slides/aa1516c49b724ff38efd76d3b28e8b52/last-success-publish-record`
let catalogueList = [] as unknown
function App() {
  const iframe = useRef(null)
  const showIframe = useRef(false)
  const [inputValue, setInputValue] = useState('');
  const [slideValue, setSlideValue] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [ pageList, setPageList ] = useState([])
  useEffect(() => {
    window.addEventListener('message', event => handleEvent(event));
    if (localStorage.getItem('slideId')) [
      slideConfig = `${host}/dev/slides/${localStorage.getItem('slideId')}/last-success-publish-record`
    ]
    fetch(slideConfig, {
      method: 'GET',
      headers: {
        token: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
      },
    }).then(data => {
      return data.json()
    })
      .then(data => {
        Config = data.data
        Config.commonResourceList.forEach(element => {
          if(element.customIdentityId === "slidePreview") {
            element.version = '1.0.0'
          }
        });
        const url = cdnHost + '/slides/slide/{slideId}/{slideVersion}'
        const bootstrap = replacePlaceholders(url, {
          slideId: Config.slideId,
          slideVersion: Config.slideVersion
        }) + '/bootstrap.json'
        return fetch(bootstrap)
      }).then(data => {
        return data.json()
      })
      .then(data => {
        catalogueList = data
        setPageList(data)
        showIframe.current = true
      });

    return () => {
      window.removeEventListener('message', event => handleEvent(event));
    }
  }, [])

  const replacePlaceholders = (template: string, replacements: { [x: string]: any; }) => {
    return template.replace(/{(.*?)}/g, (match, key) => replacements[key] || match);
  }
  const handleEvent = (event: any) => {
    const data = event.data
    if (!data.data) return null
    const pomeloParam = data.data
    if (data.type === 'onEvent') {
      switch (data.data.command) {

        case 'getInitParam':
          setTimeout(() => {
            getInitParam(data.data.id)
          }, 1000)
          break
        case 'courseWareReady':
          if (role !== 'sender') {

            pomelo.on('onMessage', (msg) => {
              const data = JSON.parse(msg.data)
              iframe.current.contentWindow.postMessage(data, '*')
            })
          }
          // if (!iframe.current) {
          //   setTimeout(() => {
          //     setPageId(catalogueList[0].id)
          //   }, 1000)
          // } else {
          //   setPageId(catalogueList[0].id)
          // }
          break
        case 'getCatalogueInfo':
          handleCatalogueInfo(data.data.id)
          break
        case 'getStoredData':
          handleStoredData(data.data)
          break
        case 'getCloudControl':
          handleCloudControl(data.data.id)
          break
        case 'storeData':
          handleSetStoreData(data.data)
      }
    }
    if (data.type === 'pomeloMessage') {
      switch (pomeloParam.command) {
        case 'sendRoomItsMessage':
          sendRoomItsMessage(pomeloParam)
          break

        case 'sendCwState':
          handleCwState(pomeloParam)
          break
        case 'sendGameSyncAction':
          handleGameSyncAction(pomeloParam)
          break
        case 'setPageId':
          handleSetPageId(pomeloParam)
          break
        case 'animateChange':
          handleAnimateChange(pomeloParam) 
          break
      }
    }

    // 处理子应用发送的消息
  }

  const handleCwState = (data) => {
    if (role === 'sender') {
      pomelo.send({
        type: 'pomeloMessage',
        data: data
      })
    }
  }

  const handleGameSyncAction = (data: any) => {
    if (role === 'sender') {
      pomelo.send({
        type: 'pomeloMessage',
        data: data
      })
    }
  }

  const handleSetPageId = (data) => {
    const index = catalogueList.findIndex(item => item.id === data.param.id)
    setCurrentIndex(index)
    if (role === 'sender') {
      console.log({
        type: 'pomeloMessage',
        data: data,
      }, '通信pageId')
      console.log('设置pageId')
      pomelo.send({
        type: 'pomeloMessage',
        data: data,
      })
    }
  }

  const handleAnimateChange = (data) => {
    if(role === 'sender') {
      pomelo.send({
        type: 'pomeloMessage',
        data: data,
      })
    }
  }

  const handleStoredData = (param) => {
    const localData = localStorage.getItem('storeData')
    let storeData
    if (localData) {
      storeData = JSON.parse(localData)
    }
    iframe.current.contentWindow.postMessage({
      type: 'onEvent',
      data: {
        command: 'getStoredData',
        param: storeData ? storeData.param : {},
        id: param.id
      }
    }, '*')
  }

  const handleCloudControl = (id) => {
    iframe.current.contentWindow.postMessage({
      type: 'onEvent',
      data: {
        command: 'getCloudControl',
        id,
        param: null
      }
    }, '*')
  }

  const handleSetStoreData = (data) => {
    if (role === 'sender') {
      localStorage.setItem('storeData', JSON.stringify(data))
    }
  }

  const handleCatalogueInfo = (id) => {
    iframe.current.contentWindow.postMessage({
      type: 'onEvent',
      data: {
        command: 'getCatalogueInfo',
        id,
        param: Config
      }
    }, '*')
  }
  const getInitParam = (id) => {
    iframe.current.contentWindow.postMessage({
      type: 'onEvent',
      data: {
        command: 'getInitParam',
        id,
        param: {
          startPageId: '',
          role: role,
          courseWareWidth: 960, // 屏幕宽度
          courseWareHeight: 720, // 屏幕高度
          itsId: '',
          isChangeAnimateStatus: false, // 是否设置翻页动画重置
          aliSLSLevel: '',
          gamePreload: '1', // 是否开启交互游戏预加载
          liveId: 'test',
          userId: `ceshi_${role || 'receiver'}`,
          localRootPath: 'http://localhost:5500/bridge/mcc-player',
          client: 'mcc-demo 测试',
          introductoryLesson: false,
          env: env
        }
      }
    }, '*')
  }
  const setPageId = (id) => {
    iframe.current.contentWindow.postMessage({
      type: 'onEvent',
      data: {
        command: 'setPageId',
        param: {
          id
        }
      }
    }, '*')
  }
  const sendRoomItsMessage = (data) => {
    if (role === 'sender') {
      pomelo.send({
        type: 'pomeloMessage',
        data
      })
    }

  }

  const startInteract = () => {
    const pageId = catalogueList[currentIndex].id
    pomelo.send({
      type: 'onEvent',
      data: {
        command: 'onInteractAction',
        param: {
          ext: {
            interactType: "",//互动类型
          },
          interactData: {
            command: "start", //互动开始start  互动结束stop
            data: {
              interactId: "123", //互动id
              pageId: pageId //课件pageId
            }
          }
        }
      }
    })
  }

  const stopInteract = () => {
    const pageId = catalogueList[currentIndex].id



    pomelo.send({
      type: 'onEvent',
      data: {
        command: 'onInteractAction',
        param: {
          ext: {
            interactType: "",//互动类型
          },
          interactData: {
            command: "stop", //互动开始start  互动结束stop
            data: {
              interactId: "123", //互动id
              pageId: pageId //课件pageId
            }
          }
        }
      }
    })
  }

  const nextPage = () => {
    if (catalogueList[currentIndex + 1]) {
      const id = catalogueList[currentIndex + 1].id
      // setCurrentIndex(currentIndex + 1)
      setPageId(id)
    } else {
      alert('无下一页')
    }

  }

  const pageTo = (currentIndex) => {
    // setCurrentIndex(currentIndex)
    const id = catalogueList[currentIndex].id
    setPageId(id)
  }

  const prevPage = () => {
    if (catalogueList[currentIndex - 1]) {
      const id = catalogueList[currentIndex - 1].id
      // setCurrentIndex(currentIndex - 1)
      setPageId(id)
    } else {
      alert('无上一页')
    }
  }

  const handleConnect = () => {
    iframe.current.contentWindow.postMessage({
      type: 'onEvent',
      data: {
        command: 'handleReconnected'
      }
    }, '*')
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleSlideChange = (event) => {
    setSlideValue(event.target.value)
  }

  const setRoomId = () => {
    localStorage.setItem('classId', inputValue)
  }
  const setSlideId = () => {
    localStorage.setItem('slideId', slideValue)
    location.reload()
  }

  const setSize = () => {
    iframe.current.contentWindow.postMessage({
      type: 'onEvent',
      data: {
        command: 'onCourseWareSizeChanged',
        param: {
          courseWareWidth: 1000,
          courseWareHeight: 750
        }
      }
    }, '*')
  }

  return (
    <div >
      <div style={
        {
          display: "flex",
          flexWrap: "wrap",
          backgroundColor: "white",
          justifyContent: "center",
        }
      }>
        <button onClick={() => setSize()}>设置宽高</button>

        <button onClick={() => prevPage()}>上一页</button>
        <div className='jump-container'>
          <button className='jump'>当前页为{currentIndex + 1}跳转至</button>
          {
            <div className="page-list">
              {pageList.map((item, index) => {
                return <div key={item.id} onClick={() => { pageTo(index) }}>
                  <button>{'跳转到'} {index + 1}</button>
                </div>
              })}
            </div>
          }
        </div>

        <button onClick={() => nextPage()}>下一页</button>

        {role === 'sender' &&
          <div>
            <button onClick={() => startInteract()}>发起互动</button>
            <button onClick={() => stopInteract()}>停止互动</button>

            <input type='text' value={inputValue} onChange={handleInputChange}></input>
            <button onClick={setRoomId}>设置直播讲id</button>
            <input type='text' value={slideValue} onChange={handleSlideChange}></input>
            <button onClick={setSlideId}>设置课件id</button>
          </div>
        }
        {role !== 'sender' && <button onClick={handleConnect}>断线重连</button>}
      </div>
      <div style={{ display: 'flex', justifyContent: "center", marginTop:'30px' }}>
        {
          showIframe && <iframe style={{ border: 'none', justifyContent: 'center', display: '' }} ref={iframe} src={`http://localhost:5173?from=web&isFromApp=1`}></iframe>
        }
      </div>


    </div>
  )
}

export default App
