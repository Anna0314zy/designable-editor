import React from 'react';
import { Image, Tooltip } from 'antd';
import { observer } from '@slides/react';
import './styles.less';

export interface IImgTypeProps {
  value?: number;
  onChange?: (value?: string) => void;
}

export const ImgType: React.FC<IImgTypeProps> = observer((props) => {
  const onChange = (type?: string) => {
    props.onChange?.(type);
  };

  return (
    <div className="img_type">
      <Tooltip title="原始">
        <Image
          width={30}
          preview={false}
          onClick={(e) => onChange('default')}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
      </Tooltip>
      <Tooltip title="倒影">
        <Image
          width={30}
          preview={false}
          className="inverted"
          onClick={() => onChange('inverted')}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
      </Tooltip>
      <Tooltip title="阴影">
        <Image
          width={30}
          preview={false}
          className="shadow"
          onClick={() => onChange('shadow')}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
      </Tooltip>
      <Tooltip title="圆角">
        <Image
          width={30}
          preview={false}
          className="rounded"
          onClick={() => onChange('rounded')}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
      </Tooltip>
      <Tooltip title="边框">
        <Image
          width={30}
          preview={false}
          className="border"
          onClick={() => onChange('border')}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
      </Tooltip>
    </div>
  );
});
