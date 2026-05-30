/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from 'react'
import {
  RenderRoot,
  emptySchema,
  nodeSchemaToSchema,
} from "@play/render";
import './App.css'
import './normalize.css'
import {Page} from './page'
declare global {
  interface Window {
    json: any;
    generateScreenShot: any;
  }
}


interface ResourcePropsIF {
  content: any
}

// if(window.generateScreenShot) {
//   window.generateScreenShot()
// }

console.log('userAgent', navigator.userAgent)
const jsonTest = {
  "id": 10283,
  "pageId": "b1b1d28c40de41c3ba975a2e35f517ad",
  "slideId": "6774a51021064d55b278fcd55d1c51f2",
  "pageType": 1,
  "gameId": 0,
  "gameTemplateId": 0,
  "mainContentStructure": {
    "id": "b1b1d28c40de41c3ba975a2e35f517ad",
    "pageType": 1,
    "pageInfo": {
      "id": "b1b1d28c40de41c3ba975a2e35f517ad",
      "componentName": "Root",
      "sourceName": "",
      "props": {
        "info": {
          "type": "课件页"
        },
        "style": {},
        "animates": []
      },
      "hidden": false,
      "children": [{
        "id": "qzwwvajgo82",
        "componentName": "Img",
        "sourceName": "",
        "props": {
          "title": "图片",
          "x-decorator": "FormItem",
          "x-component": "Img",
          "style": {
            "width": "1280px",
            "height": "960px",
            "transform": "translate(0px, 0px) rotate(0deg)"
          },
          "src": "",
          "info": {
            "name": "图片20"
          }
        },
        "hidden": false,
        "children": []
      }, {
        "id": "8c4ydxfamqm",
        "componentName": "Img",
        "sourceName": "",
        "props": {
          "title": "图片",
          "x-decorator": "FormItem",
          "x-component": "Img",
          "style": {
            "width": "1280px",
            "height": "960px",
            "transform": "translate(0px, 0px) rotate(0deg)"
          },
          "src": "2f544361e59df91da5774e25a0f88c2b",
          "info": {
            "name": "图片74"
          }
        },
        "hidden": false,
        "children": []
      }, {
        "id": "2z6n44w2ylq",
        "componentName": "RichText",
        "sourceName": "",
        "props": {
          "title": "富文本",
          "x-decorator": "FormItem",
          "x-component": "RichText",
          "style": {
            "transform": " translate(152px, 656px) rotate(0deg)",
            "fontFamily": "SimFZcuyuan,SimSun",
            "fontSize": "60px",
            "lineHeight": "1.2",
            "fontStyle": "normal",
            "fontVariant": "normal",
            "fontWeight": "normal",
            "color": "rgba(42,154,243,1)",
            "textDecoration": "normal",
            "key": 0,
            "height": "91px",
            "width": "472px",
            "textAlign": "center"
          },
          "info": {
            "name": "文本37"
          },
          "data": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"观察力、反应力\",\"fontFamily\":\"SimFZcuyuan,SimSun\",\"fontSize\":\"60px\",\"lineHeight\":\"1.2\",\"fontStyle\":\"normal\",\"fontVariant\":\"normal\",\"fontWeight\":\"normal\",\"color\":\"rgba(42,154,243,1)\",\"textDecoration\":\"normal\",\"key\":0}]}]",
          "FontFamilyOptions": [{
            "label": "宋体",
            "value": "SimSun"
          }, {
            "label": "方正准圆简体",
            "value": "SimFZzhunyuan,SimSun"
          }, {
            "label": "方正粗圆简体",
            "value": "SimFZcuyuan,SimSun"
          }]
        },
        "hidden": false,
        "children": []
      }]
    }
  },
  "fileResourceDtoList": [],
  "createTime": 1708916114743,
  "updateTime": 1709128632786
}

// window.json = JSON.stringify(jsonTest)

// 这里需要查询是否等待，默认的值并不可以一概而论
const screenshot = async () => {
    console.log('status loaded')
    setTimeout(async () => {
      if (window.generateScreenShot) {
        await window.generateScreenShot()
      }
    }, 100)
}

const Resource = React.memo(function (props: ResourcePropsIF) {
  const { content } = props
  const pageRef = useRef(null);

  useEffect(()=>{
    async function loadResource() {
      try {
        if(Object.keys(content).length === 0) return;
        console.log("file: App.tsx:86 ~ Resource ~ content:", content);
        if(!pageRef.current) {
          pageRef.current = new Page() as any;
        }
        (pageRef.current as unknown as Page).init(content);
        const isLoaded =await (pageRef.current as unknown as Page).loadResource();
        console.log('isLoaded', isLoaded);
        if(isLoaded) {
          const previewDom = document.querySelector('#preview')!;
          const backgroundImage = getComputedStyle(previewDom).getPropertyValue("background-image")
          if(backgroundImage.indexOf('url') > -1) {
            const url = backgroundImage.match(/url\(['"]?(.*?)['"]?\)/)![1];
            const image = new Image();
            image.src = url;
            image.onload = async function() {
              console.log('image loaded')
              await screenshot()
            };
          } else {
            await screenshot()
          }
        }
      } catch (error) {
        console.log("file: App.tsx:84 ~ loadResource ~ error:", error)
      }
    }
    loadResource()
  },[content])
  return null
})

const App = function () {
  const path = import.meta.env.VITE_CDN_SERVER
  const cdnPathList = [path]
  const [content, setContent] = useState<any>({}); // 保存数据
  const fileList = useRef([])
  console.log(3)
  const [pageInfo, setPageInfo] = useState(emptySchema)
  // const [fetchStatus, setFetchStatus] = useState(true)
  const globalConfig = {
    resourceData: {
      remote: {
        cdnPathList: cdnPathList
      }
    }
  }

  useEffect(() => {
    const loadData = () => {
      try {
        console.log("file: App.tsx:120 ~ loadData ~ window:", window.json)
        const jsonData = JSON.parse(window.json)
        console.log("file: App.tsx:119 ~ loadData ~ jsonData:", jsonData)
        const { fileResourceDtoList, mainContentStructure } = jsonData
        fileList.current = fileResourceDtoList
        const content = mainContentStructure
        setContent(()=>content)
        const schema = nodeSchemaToSchema(content.pageInfo)
        if(schema.props && schema.props.style && schema.props.style.backgroundImage) {
          const backgroundImage = schema.props.style.backgroundImage
          const style = {backgroundSize:'cover', backgroundRepeat:'no-repeat', backgroundPosition:'center center'} as unknown as any
          const file = fileList.current.find((item:any) => item.fileMd5 === backgroundImage) as unknown as any
          if(file) {
            style.backgroundImage = `url(${cdnPathList[0]+file.cosFullPath})`
            schema.props.style = {...schema.props.style, ...style}
          }
        }
        setPageInfo(()=>schema)
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    }
    loadData()
  }, [])

  const Game = (props:any) => {
    const {id, cover} = props
    return (
        <div preview-id={id} style={{transform: 'translate(0px, 0px) rotate(0deg)',height:'100%', width:'100%', border: 'none'}}>
          <img style={{width:'100%', height:'100%'}} src={cover} alt="" />
        </div>
    )
  }

  const Video = (props:any) => {
    const {id, src} = props
    const list = fileList.current
    if(list.length === 0) return (<div></div>)
    const item = list.find((item:any) => item.fileMd5 === src) as unknown as any
    if(!item) return (<div></div>)
    const url = cdnPathList[0] + item.videoScreenshotOssPath
    return (
      <div preview-id={id} style={{transform: 'translate(0px, 0px) rotate(0deg)',height:'100%', width:'100%', border: 'none'}}>
        <img style={{width:'100%', height:'100%'}} src={url} alt="" />
      </div>
    )
  }

  return (
    <div id="preview" style={{ width: '1280px', height: '960px', ...pageInfo.props.style}}>
      <RenderRoot
        schema={pageInfo}
        widgets={{Game: Game, Video: Video}}
        methods={{}}
        globalProps={{ fileList: fileList.current }}
        globalConfig={globalConfig}
      >
        <Resource content={content}  />
      </RenderRoot>
    </div>
  )
}

export default App
