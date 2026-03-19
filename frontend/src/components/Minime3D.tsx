'use client';

import dynamic from 'next/dynamic';
import type { Minime3DConfig } from './minime3d/Minime3DCharacter';

const Minime3DScene = dynamic(
  () => import('./minime3d/Minime3DScene').then((m) => m.Minime3DScene),
  { ssr: false }
);

interface Minime3DProps {
  config?: Minime3DConfig;
  size?: number;
  showCapsule?: boolean;
  className?: string;
}

export function Minime3D({ config = {}, size = 150, showCapsule = true, className = '' }: Minime3DProps) {
  return (
    <Minime3DScene
      config={config}
      size={size}
      showCapsule={showCapsule}
      className={className}
    />
  );
}
