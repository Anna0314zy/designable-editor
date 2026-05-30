import React, { useCallback, useEffect } from 'react'
import { debounce } from 'lodash-es'
import { VIEWPORT_SIZE} from '@/types/constant'
interface IUseCanvasRect {
  previewRef: React.RefObject<HTMLDivElement>;
  wrapperRef: React.RefObject<HTMLDivElement>;
  contentRef: React.RefObject<HTMLDivElement>;
  viewportPercentage: number
  viewportRatio: number
  viewportSize?: number
}
const useCanvasRect = ({
  wrapperRef,
  contentRef,
  previewRef,
  viewportPercentage,
  viewportRatio,
  viewportSize = VIEWPORT_SIZE,
}: IUseCanvasRect) => {
  const setWrapperStyle = useCallback(
    ({
      wrapperWidth,
      wrapperHeight,
      previewWidth,
      previewHeight,
    }: {
      wrapperWidth: number
      wrapperHeight: number
      previewWidth: number
      previewHeight: number
    }) => {
      const { current } = wrapperRef
      if (current) {
        current.style.width = wrapperWidth + 'px'
        current.style.height = wrapperHeight + 'px'
        if (wrapperHeight > previewHeight) {
          current.style.top = 0 + 'px'
        } else {
          current.style.top = (previewHeight - wrapperHeight) / 2 + 'px'
        }
        if (wrapperWidth > previewWidth) {
          current.style.left = 0 + 'px'
        } else {
          current.style.left = (previewWidth - wrapperWidth) / 2 + 'px'
        }
        const scale = wrapperWidth / viewportSize

        if (contentRef && contentRef.current) {
          contentRef.current.style.transform = `scale(${scale})`
          contentRef.current.style.transformOrigin = '0 0'
        }
        // setViewportScale(scale)
      }
    },
    [contentRef, viewportSize, wrapperRef],
  )
  const setCanvasRect = useCallback(
    (previewWidth: number, previewHeight: number) => {
      const percentage = viewportPercentage - 0.02 // 画布占屏幕的比例
      let wrapperWidth = previewWidth
      let wrapperHeight = previewHeight
      // 当页面宽高比大于视口宽高比时，以视口宽度为基准，否则以视口高度为基准
      if (previewHeight / previewWidth > viewportRatio) {
        wrapperWidth = previewWidth * percentage
        wrapperHeight = wrapperWidth * viewportRatio
      } else {
        wrapperHeight = previewHeight * percentage
        wrapperWidth = wrapperHeight / viewportRatio
      }
      setWrapperStyle({ wrapperWidth, wrapperHeight, previewWidth, previewHeight })
    },
    [setWrapperStyle, viewportPercentage, viewportRatio],
  )
  const handleResize = useCallback(() => {
    const previewDom = previewRef.current?.getBoundingClientRect()
    if (previewDom) setCanvasRect(previewDom.width, previewDom.height)
  }, [previewRef, setCanvasRect])
  const debouncedHandleResize = debounce(handleResize, 300)
  useEffect(() => {
    window.addEventListener('resize', debouncedHandleResize)
    return () => {
      window.removeEventListener('resize', debouncedHandleResize)
    }
  }, [debouncedHandleResize, handleResize])
  useEffect(() => {
    handleResize()
  }, [handleResize])
  return null;
}
export default useCanvasRect
