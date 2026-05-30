import React from 'react';
import { useUpdateEffect } from '../hooks/useUpdateEffect';

export const FieldWrapper = (props: any) => {
  const { Field, fieldProps, maxWidth, initialValue, ...otherProps } = props;
  const _style = maxWidth ? { maxWidth, ...fieldProps?.style } : { ...fieldProps?.style };

  useUpdateEffect(() => {
    otherProps?.onChange(initialValue);
  }, [JSON.stringify(initialValue)]);

  return (
    <Field
      {...otherProps}
      {...fieldProps}
      style={_style}
    />
  );
};