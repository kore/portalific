import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (this.props.pushError) {
      this.props.pushError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900">
          <div className="flex">
            <div className="shrink-0">
              <ExclamationTriangleIcon
                className="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200">
                <strong>
                  An error occured while rendering this component.
                </strong>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
