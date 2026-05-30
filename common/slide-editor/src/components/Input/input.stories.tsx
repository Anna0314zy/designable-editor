/*
 * @Date: 2023-04-02 22:47:52
 * @LastEditors: 周东晨 p_zhoudongchen@xuepeiyou.com
 * @LastEditTime: 2023-11-22 19:28:10
 * @FilePath: /oliwans-ui/src/components/Input/input.stories.tsx
 */
// Button.stories.ts|tsx

import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import Button from './input';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Button',
  component: Button,
  argTypes: {
  },
} as ComponentMeta<typeof Button>;

//👇 We create a “template” of how args map to rendering

