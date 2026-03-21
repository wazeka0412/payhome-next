'use client';

import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: string; }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: '' };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">エラーが発生しました</h2>
          <p className="text-sm text-gray-500 mb-4">{this.state.error}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: '' })}
            className="bg-[#E8740C] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#d4680b] transition cursor-pointer"
          >
            再試行
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
