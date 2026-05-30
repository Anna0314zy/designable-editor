import React, { useEffect, useRef, useState } from 'react'
import { isRemoteResourceExist } from '../utils'

interface IImageProps {
    onLoad: (url: string) => any;
    onError: React.ReactEventHandler<HTMLImageElement> | undefined;
    urls: string[];
    style?: React.CSSProperties | undefined;
    localUrl?:string
}

export const ImageComponent: React.FC<IImageProps> = ({ onLoad, onError, urls, style,localUrl }) => {
    const [url, setUrl] = useState<string>('')
    const index = useRef<number>(-1)
    const getUrl = async (startPosition:number) => {
        for(let i=startPosition;i<urls.length;i++) {
            const tempUrl = urls[i]
            // 超时时长由500 改为2000毫秒 因为背景图有时会出现500毫秒未请求成功的情况
            const isExist = await isRemoteResourceExist(tempUrl, { timeout: 2000, retryCount: 3, retryDelay: 50 })
            if (isExist) {
                setUrl(()=>tempUrl)
                index.current = i
                return
            }
        }
    }

    const errorHandler = (e?: React.SyntheticEvent<HTMLImageElement, Event>) => {
        if(index.current<urls.length - 1) {
            getUrl(index.current)
        } else {
            onError && onError(e)
        }
    }
    useEffect(() => {
        if (urls.length > 0) {
            getUrl(0)
        }
    }, [urls])
    return (
        (url || localUrl) && <img
            onLoad={onLoad(url)}
            onError={errorHandler}
            src={url || localUrl}
            style={style}
        />
    )
}