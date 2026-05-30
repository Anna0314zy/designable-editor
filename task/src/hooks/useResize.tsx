import { useEffect } from 'react';
import useComputedSize from './useComputedSize';
import {debounce} from 'lodash-es'
function useResize(props?:{width?:number,height?:number}) {
    const {width = 0,height = 0} = props || {}
   
    const {size, handleResize} = useComputedSize({width,height})
    const debouncedHandleResize = debounce(handleResize, 300);
    useEffect(()=>{

        document.addEventListener('resize',debouncedHandleResize)
        return () => {
            document.removeEventListener('resize',debouncedHandleResize)
        }
    },[debouncedHandleResize])
    return [size]
}
export default useResize;