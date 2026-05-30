import { withErrorBoundary } from 'react-error-boundary'
import {  AnimateWidget } from './AnimationWidget'

export const AnimationWidgetWithErrorBoundary = withErrorBoundary(AnimateWidget, {
    FallbackComponent: ({ error, resetErrorBoundary }) => (
        <div role="alert">
            <p>Something went wrong:</p>
            <pre>{error.message}</pre>
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    ),
    onError: (error, info) => {
        console.log(error, info)
    }
})