// 画布大小
const VIEWPORT_SIZE = 1280;
// 画布比例
const VIEW_PORT_RATIO = 0.75;

export const getSize = (params: any) => {
  const globalData = window.microApp.getGlobalData() || ({} as unknown as any);
  let clientHeight = document.documentElement.clientHeight;
  let clientWidth = document.documentElement.clientWidth;
  if (globalData.initParam) {
    const { courseWareHeight, courseWareWidth } = globalData.initParam;
    if (courseWareHeight) {
      clientHeight = courseWareHeight;
      clientWidth = courseWareWidth;
    }
  }

  if (params) {
    const { courseWareWidth, courseWareHeight } = params;
    if (courseWareHeight) {
      clientHeight = courseWareHeight;
      clientWidth = courseWareWidth;
    }
  }
  let wrapperHeight, wrapperWidth;
  if (clientHeight / clientWidth > VIEW_PORT_RATIO) {
    wrapperWidth = clientWidth;
    wrapperHeight = wrapperWidth * VIEW_PORT_RATIO;
  } else {
    wrapperHeight = clientHeight;
    wrapperWidth = wrapperHeight / VIEW_PORT_RATIO;
  }
  const scale = wrapperWidth / VIEWPORT_SIZE;
  console.log(
    "file: resize.ts:64 ~ updateSize ~ scale",
    scale,
    wrapperHeight,
    wrapperWidth
  );
  return {
    scale,
    wrapperHeight,
    wrapperWidth,
    clientHeight,
    clientWidth,
  };
};
