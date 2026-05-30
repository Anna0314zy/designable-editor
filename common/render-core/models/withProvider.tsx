import React, { useRef, useState } from 'react';
import { ConfigContext } from './context';

export function withProvider<T>(Element: React.ComponentType<T>, defaultWidgets?: any): React.ComponentType<T> {
  return (props: any) => {
    const {
      widgets,
      methods,
      globalProps = {},
      globalConfig = {},
      children,
      ...otherProps
    } = props;


    const configContext = {
      widgets: { ...defaultWidgets, ...widgets },
      methods,
      globalProps,
      globalConfig
    };


    return (
        <ConfigContext.Provider value={configContext}>
            <Element {...otherProps} />
            {children}
        </ConfigContext.Provider>
    );
  };
}