import React from 'react'
import { Collapse } from 'antd'

const { Panel } = Collapse

interface DataItem {
  label: string
  key: string
  section?: { name: string; id: string }[]
}

interface Props {
  // dataArray: DataItem[]
}

const YourComponent: React.FC<Props> = ({}) => {
  let sectionFound = false // 标记是否找到第一个具有 section 的项

  const dataArray = [
    {
      label: '第0da个元素',
      key: '2da',
    },
    {
      label: '第0aada个元素',
      key: '2da',
    },
    {
      label: '第0dassssss个元素',
      key: '2da',
    },
    {
      label: '第0v vvvvv个元素',
      key: '2da',
    },
    {
      label: '第一个元素',
      key: '1',
      section: [
        {
          name: '无标题节一',
          id: '5s4iptkmsaodas',
        },
        {
          name: '无标题节一一一',
          id: '5s4iptkmsaodas大师大大声',
        },
        {
          name: '单课时',
          id: '5s4ipt',
        },
      ],
    },
    {
      label: '第二个元素',
      key: '2',
    },
    {
      label: '第三个元素',
      key: '3',
    },
    {
      label: '第四个元素',
      key: '4',
      section: [
        {
          name: '无标题节二',
          id: '5s4iptkmsao',
        },
      ],
    },
    {
      label: '第五个元素',
      key: '5',
      section: [
        {
          name: '无标题节打算',
          id: '5s4iptkms大萨斯ao',
        },
      ],
    },
  ]

  return (
    <Collapse>
      {dataArray.map((item, index) => {
        if (!sectionFound && !item.section) {
          // 如果还没找到第一个 section，或者当前项没有 section，则作为独立的 Panel 显示
          return (
            // <Panel key={index} header={item.label}>
            // </Panel>
            <div>{item.label}</div>
          )
        } else if (item.section) {
          // 如果当前项有 section，则标记找到了第一个 section，后续的都放在 Collapse 中
          sectionFound = true
          return (
            <Panel key={item.section[0].name} header={item.section[0].name}>
              {[item, ...dataArray.slice(index + 1, index + 3)].map(
                (sectionItem) => (
                  <div key={sectionItem.key}>{sectionItem.label}</div>
                )
              )}
            </Panel>
          )
        }
        return null // 如果当前项没有 section 且已经找到第一个 section，则不渲染
      })}
    </Collapse>
  )
}

export default YourComponent
