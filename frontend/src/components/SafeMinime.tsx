'use client';

import { Component, type ReactNode } from 'react';
import { MinimeCharacter } from './MinimeCharacter';

interface Props {
  config?: Record<string, unknown>;
  size?: number;
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class SafeMinime extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('MinimeCharacter error:', error?.message ?? error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="bg-pink-100/50 rounded-lg flex items-center justify-center"
          style={{ width: this.props.size ?? 60, height: Math.round((this.props.size ?? 60) * (80 / 64)) }}
        />
      );
    }
    return <MinimeCharacter config={this.props.config ?? {}} size={this.props.size ?? 60} />;
  }
}
