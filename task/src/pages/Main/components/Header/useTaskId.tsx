import { useEffect } from "react"
import { useDispatch } from 'react-redux'
import { Dispatch } from '@/store'
const useTaskId = ({taskId}:{taskId:string}) => {
    const dispatch = useDispatch<Dispatch>()
 useEffect(() => {
    dispatch.task.updateData({currentTaskId:taskId})
 },[dispatch.task, taskId])
}
export default useTaskId