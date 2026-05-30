import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useGlobalData, usePrefix, useViewport, useDesigner, useSetGlobalData } from '../hooks'
import { Engine, ViewportResizeEvent, Viewport as ViewportType } from '@editor/core'
import { requestIdle, globalThisPolyfill } from '@editor/shared'
import cls from 'classnames'
export interface IViewportProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'placeholder'> {
  placeholder?: React.ReactNode
  dragTipsDirection?: 'left' | 'right',
  extra?: React.ReactNode,
  viewportalstyle: object
}

export const VIEWPORT_SIZE = 1280

// 当传入的值和上一次的值相同时，触发callback
function useTrackedState(initialState, callback) {
  const [state, setState] = useState(initialState);

  const setTrackedState = (newState) => {
    if (state === newState) {
      callback()
    }
    setState(newState);
  };

  return [state, setTrackedState];
}

// 判断两个数是否相等(避免浮点数运算的误差)
function numIsEqual(a, b) {
  if (!a || !b) return false
  const num1 = Math.floor(Number(a) * 100)
  const num2 = Math.floor(Number(b) * 100)
  return num1 === num2
}

export const Viewport: React.FC<IViewportProps> = ({
  placeholder,
  dragTipsDirection,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false)
  const prefix = usePrefix('viewport')
  const viewport = useViewport()
  const designer = useDesigner()

  const ref = useRef<HTMLDivElement>()
  const viewportRef = useRef<ViewportType>()
  const isFrameRef = useRef(false)
  const wrapperRef = useRef<HTMLDivElement>()
  const contentRef = useRef<HTMLDivElement>()
  const { viewportRatio, viewportPercentage } = useGlobalData()
  const setGlobalData = useSetGlobalData()
  const [viewportScale, setViewportScale] = useTrackedState(null,()=>{
    setGlobalData((preData) => {
      return { ...preData, viewportPercentage: viewportScale }
    })
  })

  useEffect(() => {
    if(viewportScale && viewportPercentage) {
      handleChangeViewportPercentage(viewport.width, viewport.height)
    } else {
      setCanvasRect(viewport.width, viewport.height)
    }
  }, [])


  useEffect(() => {
    if(viewportScale) {
      setGlobalData((preData) => {
        return { ...preData, viewportPercentage: viewportScale }
      })
    }
  }, [viewportScale])

  useEffect(() => {
    if(viewportPercentage) {
      if(viewportScale) {
        if (!numIsEqual(viewportPercentage, viewportScale)) {
          handleChangeViewportPercentage(viewport.width, viewport.height)
        }
      }
    } else {
      setCanvasRect(viewport.width, viewport.height)
    }
  }, [viewportPercentage])

  useLayoutEffect(() => {
    if (!viewport) return
    if (viewportRef.current && viewportRef.current !== viewport) {
      viewportRef.current.onUnmount()
    }
    viewport.onMount(ref.current, globalThisPolyfill)
    requestIdle(() => {
      isFrameRef.current = false
      setLoaded(true)
    })
    viewportRef.current = viewport
    return () => {
      viewport.onUnmount()
    }
  }, [viewport])
  function setWrapperStyle({ wrapperWidth, wrapperHeight, clientWidth, clientHeight }) {
    const { current } = wrapperRef
    if (current) {
      current.style.width = wrapperWidth + 'px'
      current.style.height = wrapperHeight + 'px'
      if (wrapperHeight > viewport.height) {
        current.style.top = 0 + 'px'
      } else {
        current.style.top = (clientHeight - wrapperHeight) / 2 + 'px'
      }
      if (wrapperWidth > viewport.width) {
        current.style.left = 0 + 'px'
      } else {
        current.style.left = (clientWidth - wrapperWidth) / 2 + 'px'
      }
      const scale = wrapperWidth / VIEWPORT_SIZE
      contentRef.current.style.transform = `scale(${scale})`
      setViewportScale(scale)
    }
  }
  // 设置画布大小(在画布缩放比例的基础上)
  function handleChangeViewportPercentage(clientWidth, clientHeight) {
    let wrapperWidth = clientWidth
    let wrapperHeight = clientHeight
    if (clientHeight / clientWidth > viewportRatio) {
      wrapperWidth = VIEWPORT_SIZE * viewportPercentage
      wrapperHeight = wrapperWidth * viewportRatio
    } else {
      wrapperHeight = VIEWPORT_SIZE * viewportRatio * viewportPercentage
      wrapperWidth = wrapperHeight / viewportRatio
    }
    setWrapperStyle({ wrapperWidth, wrapperHeight, clientWidth, clientHeight })
  }
  // 设置画布大小(最佳屏幕展示)
  function setCanvasRect(clientWidth, clientHeight) {
    const percentage = 0.9 // 画布占屏幕的比例
    let wrapperWidth = clientWidth
    let wrapperHeight = clientHeight
    // 当页面宽高比大于视口宽高比时，以视口宽度为基准，否则以视口高度为基准
    if (clientHeight / clientWidth > viewportRatio) {
      wrapperWidth = clientWidth * percentage
      wrapperHeight = wrapperWidth * viewportRatio
    } else {
      wrapperHeight = clientHeight * percentage
      wrapperWidth = wrapperHeight / viewportRatio
    }
    setWrapperStyle({ wrapperWidth, wrapperHeight, clientWidth, clientHeight })
  }

  // 当视口大小发生变化时，如果画布在视口内，保持画布处于居中位置，如果画布超过视口，保持画布左上角处于视口左上角
  function keepCanvasCenter(oldSize) {
    const { current } = wrapperRef
    if (current) {
      const {oldWidth, oldHeight} = oldSize
      const { width, height } = current.getBoundingClientRect()
      const { clientWidth, clientHeight } = ref.current
      if(oldWidth !== clientWidth || oldHeight !== clientHeight) {
        if (height > viewport.height) {
          current.style.top = 0 + 'px'
        } else {
          current.style.top = (clientHeight - height) / 2 + 'px'
        }
        if (width > viewport.width) {
          current.style.left = 0 + 'px'
        } else {
          current.style.left = (clientWidth - width) / 2 + 'px'
        }
      }
    }
  }

  const useResizeEffect = (wrapper: React.MutableRefObject<HTMLDivElement>, engine: Engine) => {
    engine.subscribeTo(ViewportResizeEvent, (e) => {
      if (viewport.matchViewport(e.data.target) && ref.current) {
        const { clientWidth, clientHeight } = ref.current
        const oldSize = {oldWidth:clientWidth, oldHeight:clientHeight}
        viewport.digestViewport()
        keepCanvasCenter(oldSize)
      }
    })
  }

  useDesigner((engine) => {
    useResizeEffect(wrapperRef, engine)
  })
  const containerAttr = {
    [designer.props.visibleContainerIdAttrName]: true
  }
  return (
    <div
      {
        ...props
      }
      {...containerAttr}
      ref={ref}
      className={cls(prefix, props.className)}
      style={{
        opacity: !loaded ? 0 : 1,
        overflow: isFrameRef.current ? 'hidden' : 'overlay',
        ...props.style,
      }}
    >
      <div ref={wrapperRef} className={prefix + '-canvas-wrapper'} style={{...props.viewportalstyle}}>
        {props.extra}
        <div ref={contentRef} className={prefix + '-canvas-editor'}>
          {props.children}
        </div>
      </div>
    </div>
  )
}
