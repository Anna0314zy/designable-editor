/*
 * @Date: 2024-01-10 17:40:21
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-01-17 15:56:23
 * @FilePath: /slides-engine/editor/src/components/TreeContent.tsx
 */

/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import { ComponentTreeWidget } from '@editor/react'
import 'antd/dist/reset.css'
import { Shape } from './Shape/EditingShape'
import { Text } from './Text/EditingText'
import { Group } from './Group/EditingMarkGroup'

import { Card } from './EditingCard'
import { Img } from './Img'
import { Video } from './Video'
// import { Audio } from './Audio'
import { RichText, RichTextView } from './RichText'
import { Game } from './Game/editingGame'
import { Camera } from './Camera'

export const ContentComponent = {
  Shape,
  Text,
  Card,
  Img,
  Group,
  Video,
  RichText,
  Game,
  Camera
}
export const ViewContentComponent = {
  Shape,
  Text,
  Card,
  Img,
  Group,
  Video,
  RichText: RichTextView,
  Game,
  Camera
}
export const TreeContent = React.memo(() => {
  return <ComponentTreeWidget components={ContentComponent} />
})
