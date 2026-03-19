'use client';

import type { CSSProperties } from 'react';
import { useLayoutEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Suspense } from 'react';
import type { Minime3DConfig } from './Minime3DCharacter';
import { MinimeAtlas } from './MinimeAtlas';
import { configToAtlasProps } from './configToAtlas';

function CameraLookAt({ x = 0, y = 0, z = 0 }: { x?: number; y?: number; z?: number }) {
  const { camera } = useThree();
  useLayoutEffect(() => {
    camera.lookAt(x, y, z);
    camera.updateProjectionMatrix();
  }, [camera, x, y, z]);
  return null;
}

interface Minime3DSceneProps {
  config?: Minime3DConfig;
  size?: number;
  className?: string;
  embedded?: boolean;
  /** 미리보기 등: WebGL 알파 + 씬 배경 없음 (페이지/카드 배경이 비침). embedded 와 동일한 GL 처리, 포인터는 유지 */
  transparentBackground?: boolean;
}

function SceneContent({
  config,
  size,
  transparentCanvas,
}: {
  config?: Minime3DConfig;
  size?: number;
  transparentCanvas: boolean;
}) {
  const scale = (size ?? 120) / 120;
  const atlas = configToAtlasProps(config ?? {});

  return (
    <>
      <CameraLookAt y={0} />
      {!transparentCanvas && <color attach="background" args={['#a89f94']} />}
      <ambientLight intensity={0.85} />
      <Suspense fallback={null}>
        <MinimeAtlas
          gender={atlas.gender}
          hair={atlas.hair}
          outfit={atlas.outfit}
          shoes={atlas.shoes}
          scale={scale}
        />
      </Suspense>
    </>
  );
}

export function Minime3DScene({
  config = {},
  size = 150,
  className = '',
  embedded = false,
  transparentBackground = false,
}: Minime3DSceneProps) {
  const transparentCanvas = embedded || transparentBackground;
  const wrapStyle: CSSProperties = {
    width: size,
    height: size,
    background: transparentCanvas ? 'transparent' : '#a89f94',
    borderRadius: embedded ? 0 : 12,
    pointerEvents: embedded ? 'none' : 'auto',
  };

  return (
    <div className={className} style={wrapStyle}>
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 38, near: 0.1, far: 50 }}
        gl={{ antialias: true, alpha: transparentCanvas }}
        dpr={[1, 2]}
        style={{ display: 'block', width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <SceneContent config={config} size={size} transparentCanvas={transparentCanvas} />
      </Canvas>
    </div>
  );
}
