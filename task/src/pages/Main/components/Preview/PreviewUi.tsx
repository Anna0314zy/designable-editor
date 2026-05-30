import { ReactNode } from 'react'
import useBackgroundStyle from '@/hooks/useBackgroundStyle'
import { Page } from '@/store/models/page'
interface PreviewUiProps {
  data: Page
  globalProps: any
  children: ReactNode
  previewRef: React.RefObject<HTMLDivElement>
  wrapperRef: React.RefObject<HTMLDivElement>
  contentRef: React.RefObject<HTMLDivElement>
}
const PreviewUi = ({ data, globalProps, children, previewRef, wrapperRef, contentRef }: PreviewUiProps) => {
  const [style] = useBackgroundStyle({ data, fileList: globalProps.fileList })
  return (
    <div
      ref={previewRef}
      style={{ width: '100%', height: '100%', position: 'relative', overflow: 'auto', boxSizing: 'border-box' }}
    >
      <div
        ref={wrapperRef}
        preview-id={data.id}
        className={'-canvas-wrapper'}
        style={{ width: '100%', height: '100%', backgroundColor: '#fff', position: 'absolute',overflow:'hidden', ...style }}
      >
        <div
          ref={contentRef}
          className={'-canvas-editor'}
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            minWidth: '1px',
            minHeight: '1px',
            transformOrigin: '0 0',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
export default PreviewUi
