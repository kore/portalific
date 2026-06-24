import React from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError () {
    return { hasError: true }
  }

  componentDidCatch (error, errorInfo) {
    if (this.props.pushError) {
      this.props.pushError(error, errorInfo)
    }
  }

  render () {
    if (this.state.hasError) {
      return (
        <div className='error-entry'>
          <span className='error-icon'>
            <ExclamationTriangleIcon aria-hidden='true' />
          </span>
          <div className='error-message'>
            <p>
              <strong>
                An error occured while rendering this component.
              </strong>
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
