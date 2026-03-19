'use client';

import { Component, type ReactNode } from 'react';
import { MinimeCutoutImg } from './MinimeCutoutImg';

interface Props {
  config?: Record<string, unknown>;
  size?: number;
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

/** 홈 등: 컷아웃 PNG 미니미 (faceType 기준) */
export class SafeMinime extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('SafeMinime error:', error?.message ?? error);
  }

  render() {
    const size = this.props.size ?? 60;
    if (this.state.hasError) {
      return (
        <div
          className="bg-gradient-to-b from-pink-100 to-rose-100 rounded-lg flex items-center justify-center"
          style={{ width: size, height: size }}
        />
      );
    }
    return <MinimeCutoutImg config={this.props.config ?? {}} size={size} />;
  }
}
