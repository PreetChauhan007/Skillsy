import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <main className="flex min-h-screen items-center justify-center bg-neutral-950 p-6 text-center text-white"><div><h1 className="text-2xl font-bold">Chat could not be displayed</h1><p className="mt-2 text-neutral-400">Please return to your swaps and open this chat again.</p><a className="mt-5 inline-block rounded-lg bg-emerald-600 px-4 py-2" href="/swaps">Back to swaps</a></div></main>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
