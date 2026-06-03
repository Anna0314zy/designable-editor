import { PageType } from '@editor/react/src/widgets/AddPageWidget'
export const getUrlParameter = (name) => {
    // 获取当前页面的 URL
    const url = window.location.search.substring(1);
  
    // 将 URL 参数分割成键值对
    const params = new URLSearchParams(url);
  
    // 使用 get 方法获取指定参数名的值
    return params.get(name);
}

export const changeMenu = (data,arrLabel:{
    [key:string]:any
}[]) => {
    return arrLabel.map((item) => {
        if(data.pageType === PageType.videoPage) {
          return {
            ...item,
            label: item.label.replace(/课件/, '视频')
          }
        }else if(data.pageType === PageType.gamePage) {
          return {
            ...item,
            label: item.label.replace(/课件/, '游戏')
          }
        }
        return item
      })
}
export const Canvas = {
	width: 1280,
	height: 960,
};

// 获取合适的图片宽高
export const getImgWH =  ({ width, height }: { width; height }) => {
	if (width > Canvas.width) {
		return {
			width: Canvas.width,
			height: Math.floor((Canvas.width / width) * height),
		};
	} else if (height > Canvas.height) {
		return {
			height: Canvas.height,
			width: Math.floor((Canvas.height / height) * width),
		};
	} else {
		return {
			width: Math.floor(width),
			height: Math.floor(height),
		};
	}
};
let accessToken: string | null = null

export const getToken = () => accessToken

export const setToken = (token: string) => {
  accessToken = token
}

export const clearToken = () => {
  accessToken = null
}
