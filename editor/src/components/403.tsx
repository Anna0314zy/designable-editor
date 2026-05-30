/*
 * @Date: 2024-02-29 18:02:09
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-03-01 18:58:33
 * @FilePath: /slides-engine/editor/src/components/403.tsx
 */
import React from 'react';
import { Result } from 'antd';

interface NoPermissionProps {
    name: string,
}
const NoPermission: React.FC<NoPermissionProps> = (prop) => (
  <Result
    status="warning"
    title={`当前页面正在被${prop.name}老师编辑，请联系解锁或稍后再尝试`}
  />
);

export default NoPermission;