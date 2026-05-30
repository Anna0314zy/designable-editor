import React from 'react';
import { Input } from 'antd';
import { observer } from '@slides/react';

export interface IImgAltLocationProps {
  value?: string;
  onChange?: (value?: Boolean) => void;
}

export const ImgAltLocation: React.FC<IImgAltLocationProps> = observer(
  (props) => {
    const onChange = (val: any) => {
      props.onChange?.(val.target.value || undefined);
      console.log(val.target.value);
    };

    return <Input value={props.value} onBlur={(val: any) => onChange(val)} />;
  }
);
