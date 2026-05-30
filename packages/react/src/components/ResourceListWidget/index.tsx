import React from 'react'
import { observer } from '@slides/reactive-react'
import { Avatar, List, Popover } from 'antd'
import { IconWidget, TextWidget, TooltipExceedWidget } from '../../widgets'
import { useResourceStore, useInstanceStore } from '@play/render'
import { resourceType, resourceStatus } from './type'

import './styles.less'

export const ResourceListWidget: React.FC<{parentRef:any,currentPageId:string}> = observer(({parentRef,currentPageId}) => {
  const { resourceList } = useResourceStore()
  const { instanceMap } = useInstanceStore()
  return (

      <Popover
      overlayInnerStyle={{maxHeight:'calc(100vh - 150px)',overflowY:'auto'}}
        getPopupContainer={() => parentRef.current}
        content={
          <div style={{ width: 600 }}>
            <List
              itemLayout="horizontal"
              dataSource={resourceList.filter((item) => item.pageId === currentPageId)}
              size="small"
              renderItem={(item, index) => (
                <React.Fragment key={item.resourceId}>
                  <List.Item
                    // key={item.resourceId}
                    actions={[
                      <div className={item.resourceStatus} style={{width:'80px',textAlign:'center'}}>
                        {item.resourceUrl ? resourceStatus[item.resourceStatus] || '-' : '-'}
                      </div>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={item.resourceUrl || ''} />}
                      title={
                        <span>
                          {resourceType[item.resourceType] || '未知类型'}
                        </span>
                      }
                      description={[
                        <div className="component-name">
                          <TooltipExceedWidget
                            title={instanceMap[item.componentId]?.info?.name || '-'}
                            width="400"
                          />
                        </div>,
                        <div>
                          <TooltipExceedWidget
                            title={item.resourceUrl || '-'}
                            width="400"
                          />
                        </div>,
                      ]}
                    />
                  </List.Item>
                </React.Fragment>
              )}
            />
          </div>
        }
        placement="top"
        title="资源列表"
        trigger="click"
      >
        <IconWidget
          tooltip={{
            title: <TextWidget>资源列表</TextWidget>,
            placement: 'leftTop',
          }}
          infer="List"
          style={{ cursor: 'pointer', marginRight: 10 }}
        />
      </Popover>
  )
})
