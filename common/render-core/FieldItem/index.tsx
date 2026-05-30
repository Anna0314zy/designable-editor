import React, { useContext } from 'react';
import { getWidgetName, getWidget } from '../models/mapping';
import { ConfigContext, useConnect, useReport, useEventStore } from '../models/context';
import { FieldWrapper } from './field';
import { getFieldProps, getPath } from './module';

export const FieldItem = (props: any) => {
  const { schema, path, children, rootPath, renderCore, activePageId, pageId } = props;
  const { widgets, methods, globalProps, globalConfig } = useContext(ConfigContext);
  const widgetName = getWidgetName(schema);

  if (schema?.hidden) {
    return null;
  }

  // Component not found
  if (!widgetName) {
    const ErrorSchema = widgets['errorSchema'] || widgets['ErrorSchema'];
    return <ErrorSchema schema={schema} />;
  }

  const Widget = getWidget(widgetName, widgets);
  const fieldProps = getFieldProps(schema, {
    widgets,
    methods,
    path: getPath(path),
    rootPath,
  }, {
    id: schema.id || path.join('-'),
    globalProps,
    globalConfig,
    renderCore,
    useEventStore,
    useConnect,
    useReport,
    activePageId,
    pageId
  });

  if (schema.type === 'void') {
    return <Widget {...fieldProps} />;
  }

  // Render Container Components
  if (children) {
    return (
      <Widget {...fieldProps}>
        {children}
      </Widget>
    );
  }

  const initialValue = schema.default ?? schema.defaultValue;
  return (
    <FieldWrapper
      Field={Widget}
      fieldProps={fieldProps}
      initialValue={initialValue}
    />
  );
};