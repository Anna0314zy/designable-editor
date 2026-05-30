/*
 * @Date: 2023-04-02 22:47:52
 * @LastEditors: wangpeng
 * @LastEditTime: 2023-04-03 14:55:34
 * @FilePath: /oliwans-ui/src/components/Button/button.stories.tsx
 */
// Button.stories.ts|tsx

import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import Button from './button';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Button',
  component: Button,
  argTypes: {
    children: {
      defaultValue: undefined,
      description: '定义按钮文字',
      type: { name: 'string', required: false },
      // table: {
      //   type: { 
      //     summary: 'something short', 
      //     detail: 'something really really long' 
      //   },
      // },
      control: {
        type: 'text'
      },
    },
    btnType: {
      defaultValue: undefined,
      description: '定义按钮类型',
      type: { name: 'string', required: false },
      control: {
        type: 'radio',
        options: ['default', 'primary', 'link', 'danger']
      },
    },
    size: {
      defaultValue: undefined,
      description: '定义按钮大小',
      type: { name: 'string', required: false },
      control: {
        type: 'radio',
        options: ['lg', 'sm']
      },
    },
    disabled: {
      defaultValue: false,
      description: '定义按钮禁用',
      type: { name: 'string', required: false },
      control: {
        type: 'radio',
        options: [true, false]
      },
    },
    className: {
      defaultValue: undefined,
      description: '定义按钮类名',
      type: { name: 'string', required: false },
      control: {
        type: 'text',
      },
    },
    href: {
      defaultValue: undefined,
      description: '定义按钮跳转地址，只在btnType为link时生效',
      type: { name: 'string', required: false },
      control: {
        type: 'text',
      },
    },
  },
} as ComponentMeta<typeof Button>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: 'button'
};

export const largeBtn = Template.bind({});
largeBtn.args = {
  children: 'button',
  btnType: 'primary',
  size: 'lg'
};

export const dangerBtn = Template.bind({});
dangerBtn.args = {
  children: 'button',
  btnType: 'danger',
};

export const linkBtn = Template.bind({});
linkBtn.args = {
  btnType: 'link',
  children: 'button',
  href: 'https://www.google.com'
};