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
  className?: string;
  /** 미니룸·홈: 투명 배경 + 클릭이 아래 레이어로 통과 */
  embedded?: boolean;
  /** 패널 미리보기: 아틀라스 알파 + 뒤 배경 비침 */
  transparentBackground?: boolean;
}

export function Minime3D({
  config = {},
  size = 150,
  className = '',
  embedded = false,
  transparentBackground = false,
}: Minime3DProps) {
  return (
    <Minime3DScene
      config={config}
      size={size}
      className={className}
      embedded={embedded}
      transparentBackground={transparentBackground}
    />
  );
}
