import { useCallback, useEffect, useState } from 'react'
export interface Size {
    wrapperHeight: number;
    wrapperWidth: number;
    scale: number;
}
function useComputedSize({ width, height }: { width?: number, height?: number }) {
    const [size, setSize] = useState<Size>({
        wrapperWidth: width || window.innerWidth,
        wrapperHeight: height || window.innerHeight,
        scale: 1,
    })
    // 视口大小
    const VIEWPORT_SIZE = 1280
    // 视口比例
    const VIEW_PORT_RATIO = 0.75; // 看课件比例 4/3
    const handleResize = useCallback(() => {
        const clientHeight = height || document.documentElement.clientHeight
        const clientWidth = width || document.documentElement.clientWidth
        let wrapperHeight, wrapperWidth
        if (clientHeight / clientWidth > VIEW_PORT_RATIO) {
            wrapperWidth = clientWidth
            wrapperHeight = wrapperWidth * VIEW_PORT_RATIO
        } else {
            wrapperHeight = clientHeight
            wrapperWidth = wrapperHeight / VIEW_PORT_RATIO
        }
        const scale = wrapperWidth / VIEWPORT_SIZE
        setSize({ wrapperHeight, wrapperWidth, scale })
    }, [width, height])
    useEffect(() => {
        handleResize()
    },[handleResize])
    return { size, handleResize };

}
export default useComputedSize