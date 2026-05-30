import React, { ReactNode, PropsWithoutRef, Suspense } from 'react'
import { Spin } from 'antd'

export default function WithAsync<T>(
  loader: () => Promise<{
    default: any
  }>,
) {
  function WithAsync(props: PropsWithoutRef<T & { children?: ReactNode }>) {
    const Component = React.lazy(loader)
    return (
      <Suspense fallback={<Spin />}>
        <Component {...props}>{props.children}</Component>
      </Suspense>
    )
  }
  return React.memo(WithAsync)
}
