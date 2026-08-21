import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          fontFamily: 'monospace',
          backgroundColor: '#ffebee',
          color: '#c62828',
          minHeight: '100vh',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}>
          <h1>⚠️ Error Loading Application</h1>
          <p><strong>Error:</strong> {this.state.error?.message}</p>
          <p><strong>Stack:</strong></p>
          <code>{this.state.error?.stack}</code>
        </div>
      );
    }

    return this.props.children;
  }
}
