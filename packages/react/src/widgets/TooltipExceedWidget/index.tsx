import React, { useEffect, useRef, useState } from 'react'
import { observer } from '@slides/reactive-react'
import { Tooltip } from 'antd'

import './styles.less'

export interface ITooltipExceedWidgetProps {
  width?: string
  title: string
}

export const TooltipExceedWidget: React.FC<ITooltipExceedWidgetProps> =
  observer((props) => {
    const contentRef = useRef(null)
    const [isContentExceed, setIsContentExceed] = useState(false)

    useEffect(() => {
      if (contentRef.current) {
        const widths = Number(props.width || '300')
        const isExceed = contentRef.current.scrollWidth > widths
        setIsContentExceed(isExceed)
      }
    }, [props.title])

    return (
      <div>
        {isContentExceed ? (
          <Tooltip title={props.title}>
            <div
              className="Tooltip-exceed-widget"
              style={{ width: props.width || '300px' }}
              ref={contentRef}
            >
              {props.title}
            </div>
          </Tooltip>
        ) : (
          <div
            className="Tooltip-exceed-widget"
            style={{ width: props.width || '300px' }}
            ref={contentRef}
          >
            {props.title}
          </div>
        )}
      </div>
    )
  })
