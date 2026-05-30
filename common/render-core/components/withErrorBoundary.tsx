import React, { ComponentType, ErrorInfo, ReactNode } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  name: ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = { hasError: false };

  constructor(props: { children: ReactNode, name: ReactNode }) {
    super(props);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error(error);
    console.error('In component:', info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          An error occurred loading {this.props.name}. Please refresh and try again.
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

export const withErrorBoundary = <Props extends Record<string, unknown>>(Component: ComponentType<Props>, name: string) => {
  return function WithErrorBoundary(props: Props) {
    return (
      <ErrorBoundary name={name}>
        {Component && <Component {...props} />}
      </ErrorBoundary>
    );
  };
};