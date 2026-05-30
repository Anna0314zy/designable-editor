import {getSize} from '../utils'


export const useHandleResize = () => {
  const updateSize = (params: any, setSize: Function) => {
    const { scale, wrapperHeight, wrapperWidth } = getSize(params);
    setSize({
      scale,
      wrapperHeight,
      wrapperWidth,
    });
  };
  return [updateSize];
};
