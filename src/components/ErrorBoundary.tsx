import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleResetCache = () => {
    try {
      localStorage.clear();
      window.location.reload();
    } catch (e) {
      window.location.reload();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070b14] text-slate-100 flex items-center justify-center p-6 font-mono">
          <div className="max-w-xl w-full glass-panel-orange border border-red-500/40 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
            
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black uppercase text-white f1-font">
                STRAVA CHALLENGE PORTAL RESTORE
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                The portal encountered a state synchronization issue. You can instantly restore the system below.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left bg-black/60 p-3.5 rounded-xl border border-white/10 text-[11px] text-red-300 font-mono overflow-x-auto max-h-36">
                <code>{this.state.error.toString()}</code>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleResetCache}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FF5722] hover:bg-[#ff7043] text-black font-black text-xs px-5 py-3 rounded-xl shadow-[0_0_20px_rgba(255,87,34,0.4)] transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reset Cache & Restore Sample Data</span>
              </button>

              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto flex items-center justify-center gap-2 glass-panel hover:bg-white/10 text-white font-bold text-xs px-5 py-3 rounded-xl transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
