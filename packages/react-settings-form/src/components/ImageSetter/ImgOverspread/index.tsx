import React from 'react';
import { Button } from 'antd';
import { observer } from '@slides/react';
import './styles.less';

export interface IImgOverspreadProps {
  value?: Boolean;
  onChange?: (value?: Boolean) => void;
}

export const ImgOverspread: React.FC<IImgOverspreadProps> = observer(
  (props) => {
    const onChange = (type: Boolean) => {
      props.onChange?.(type);
    };

    return (
      <Button className="imgBut" onClick={() => onChange(true)}>
        铺满画布
      </Button>
    );
  }
);
