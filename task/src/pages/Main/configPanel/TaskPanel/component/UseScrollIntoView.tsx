import { useEffect } from "react"
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
const UseScrollIntoView = () => {
    const { currentTaskId } = useSelector((state: RootState) => state.task)
useEffect(() => {
   setTimeout(() => {
    const ele = document.getElementById(String(currentTaskId))
    ele?.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
   }, 100);
},[currentTaskId])
}
export default UseScrollIntoView