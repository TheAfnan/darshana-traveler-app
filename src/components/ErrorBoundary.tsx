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

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('DarShana ErrorBoundary caught an unhandled exception:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#faf9f6] text-slate-900 font-sans flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 max-w-lg w-full text-center space-y-5 shadow-xl">
            <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto text-2xl font-bold shadow-xs">
              🏛️
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-700 block">
                DarShana Cultural Travel
              </span>
              <h1 className="text-2xl font-serif font-extrabold text-slate-900">
                Application Recovery
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We encountered an unexpected issue while loading this experience.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-stone-50 rounded-xl text-left border border-stone-200 text-xs font-mono text-slate-700 max-h-28 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
              >
                Reload Experience
              </button>
              <a
                href="/"
                className="px-4 py-2.5 border border-stone-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-stone-50 transition"
              >
                Return to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
