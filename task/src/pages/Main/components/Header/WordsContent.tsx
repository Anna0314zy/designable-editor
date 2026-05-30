import { useState, useCallback } from 'react'
import cls from 'classnames'
import { useDispatch } from 'react-redux'
import { Dispatch } from '@/store'
import { ITask } from '@editor/typing'
import { PlusOutlined } from '@ant-design/icons'
const WordsContent = ({ data }: { data: ITask }) => {
  const dispatch = useDispatch<Dispatch>()
  const [active, setActive] = useState(false)
  const handleAddWords = useCallback(
    (data: ITask) => {
      dispatch.task.updateSchemaById({
        id: data.id,
        taskType: 'words',
        type: 'textarea',
      })
    },
    [dispatch.task],
  )
  const onMouseEnter = useCallback(() => {
    setActive(true)
  }, [])
  const onMouseLeave = useCallback(() => {
    setActive(false)
  }, [])
  return (
    <div
      className={cls('words-tips', { active })}
      onClick={() => handleAddWords(data)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <PlusOutlined className='plus-icon' />
      <span>增加台词</span>
    </div>
  )
}
export default WordsContent
