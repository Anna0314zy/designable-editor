import React from 'react'
import { CaretDownOutlined } from '@ant-design/icons'
import './styles.less'

interface ISectionComProps {
  data: any
}

export const SectionCom: React.FC<ISectionComProps> = ({ data }) => {
  return (
    <div className="section-style">
      <CaretDownOutlined
        style={{
          transform: data?.secPack ? 'rotate(-90deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s',
          marginRight: '4px',
        }}
      />
      {data.name}
      {data?.secPack && <span>（{data.count || 0}）</span>}
    </div>
  )
}
