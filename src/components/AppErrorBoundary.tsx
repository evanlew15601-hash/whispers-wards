import * as React from 'react';

type Props = {
  children: React.ReactNode;
};

type State = {
  error: Error | null;
};

export default class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Uncaught app error:', error);
    console.error(info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    const message = this.state.error?.message ?? String(this.state.error);
    const stack = this.state.error?.stack ?? '';

    return (
      <div style={{ padding: 16, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Crown & Concord failed to start</h1>
        <p style={{ marginBottom: 12 }}>
          Open the browser console for details. If this is GitHub Pages, try a hard refresh (cache can keep old assets).
        </p>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#111', color: '#eee', padding: 12, borderRadius: 6 }}>
          {message}
          {stack ? `\n\n${stack}` : ''}
        </pre>
      </div>
    );
  }
}
