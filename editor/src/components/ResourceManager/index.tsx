import React from 'react'
import { useInstanceStore, useResourceStore } from '@play/render'


export const ResourceManager = () => {
    const { instanceMap } = useInstanceStore()
    const { resourceList } = useResourceStore()

    return <>
        <div>instance count: {Object.keys(instanceMap).join(' - ')}</div>
        <div>resourceList: {JSON.stringify(resourceList)}</div>
    </>
}