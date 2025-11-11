import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black text-white flex items-center justify-center">
          <div className="text-center p-8 bg-black/50 backdrop-blur-sm rounded-2xl border border-red-500/30 max-w-md">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-red-400 mb-4">🚨 SYSTEM ERROR</h1>
            <p className="text-gray-300 mb-6">Intelligence network temporarily offline</p>
            
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 mx-auto"
            >
              <RefreshCw className="w-5 h-5" />
              🔄 Restart System
            </button>
            
            <div className="mt-6 text-xs text-gray-500">
              Error: {this.state.error?.message || 'Unknown system error'}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;