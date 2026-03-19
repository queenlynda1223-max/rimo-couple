'use client';

import { Component, type ReactNode } from 'react';
import { Minime3D } from './Minime3D';

interface Props {
  config?: Record<string, unknown>;
  size?: number;
  showCapsule?: boolean;
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
    console.warn('Minime3D error:', error?.message ?? error);
  }

  render() {
    const size = this.props.size ?? 60;
    if (this.state.hasError) {
      return (
        <div
          className="bg-[#a89f94] rounded-lg flex items-center justify-center"
          style={{ width: size, height: size }}
        />
      );
    }
    return (
      <Minime3D
        config={this.props.config ?? {}}
        size={size}
        showCapsule={this.props.showCapsule ?? false}
      />
    );
  }
}
