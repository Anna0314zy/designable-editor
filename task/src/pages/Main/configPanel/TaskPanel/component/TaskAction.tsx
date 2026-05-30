import { Button } from 'antd'
import { CheckOutlined, EditOutlined } from '@ant-design/icons'
import { useSaveTask } from '@/hooks/useSaveTask'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useCallback, useMemo, memo } from 'react'
const TaskAction = ({ form }: { form: any }) => {
  const { currentPage } = useSelector((state: RootState) => state.page)
  const { loading, getEditable, handleSubmit } = useSaveTask(form)
  const editable = useMemo(() => getEditable(currentPage.id), [getEditable, currentPage.id])
  const handleClick = useCallback(() => {
    handleSubmit(currentPage.id)
  }, [currentPage.id, handleSubmit])
  return (
    <Button
      style={{ marginRight: '20px' }}
      icon={!editable ? <EditOutlined /> : <CheckOutlined />}
      // type='primary'
      size='small'
      onClick={handleClick}
      loading={loading}
    >
      {editable ? '完成' : '修改'}
    </Button>
  )
}
export default memo(TaskAction)
