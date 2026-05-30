import React, { useContext, useEffect, useRef, useState } from "react";
import { PreviewAnimateEngine } from '../engine'
import { AnimateInstanceState } from "./constant";
import { AnimationStatus } from "../types";
import { emptySchema, useConnect } from "../../../render-core";

interface AnimateWidgetProps {
    useEventStore: any
    sendChangeMessage?: any
    pageInfo: any
    activePageId: string
    sendLog?: any
}

export const AnimateWidget: React.FC<AnimateWidgetProps> =({ pageInfo, useEventStore, sendChangeMessage, activePageId, sendLog }) => {
    const { registerMsg, msgControllerList, msgQueue } = useEventStore()
    const animateEngine = useRef<any>(null);
	if(!animateEngine.current) {
		animateEngine.current = new PreviewAnimateEngine({sendChangeMessage, registerMsg, sendLog});
	}
    useEffect(()=>{
        const hasAnimate = pageInfo?.props?.animates && pageInfo.props.animates.length > 0
		if(animateEngine && animateEngine.current && hasAnimate){
			animateEngine.current.init({animateList: pageInfo.props.animates, workspaceId: pageInfo.id})
		}
    },[pageInfo])
    useEffect(()=>{
        if(activePageId === pageInfo.id && pageInfo !== emptySchema) {
            const hasAnimate = pageInfo && pageInfo.props.animates && pageInfo.props.animates.length > 0
            if(animateEngine && animateEngine.current && hasAnimate){
                animateEngine.current.ready(msgQueue)
            }
        }
    },[activePageId])
    return null
}