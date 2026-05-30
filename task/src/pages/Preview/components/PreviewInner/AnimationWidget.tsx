
import { PreviewAnimateEngine } from '@slides/animate'
import { useRef,useEffect } from 'react'
import {  useEventStore } from "@play/render";

export const AnimateWidget = ({pageInfo}:any) => {
    const animateEngine = useRef<any>(null);
    const { registerMsg} = useEventStore()
    if(!animateEngine.current) {
		animateEngine.current = new PreviewAnimateEngine({
            sendChangeMessage:()=>{},
            registerMsg:registerMsg,
            sendLog:()=>{},
        });
	}
    useEffect(()=>{
        // 
        setTimeout(() => {
            // 需要保证dom已经渲染
            const hasAnimate = pageInfo?.props?.animates && pageInfo.props.animates.length > 0
            if(animateEngine && animateEngine.current && hasAnimate){
    
                animateEngine.current.init({animateList: pageInfo.props.animates, workspaceId: pageInfo.id})
                animateEngine.current.ready([])
    
            }
        },0)
    },[pageInfo])
    return null
}