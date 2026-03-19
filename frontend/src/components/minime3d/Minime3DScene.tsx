'use client';

import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Suspense } from 'react';
import { Minime3DCharacter, type Minime3DConfig } from './Minime3DCharacter';
import { Capsule } from './Capsule';

interface Minime3DSceneProps {
  config?: Minime3DConfig;
  size?: number;
  showCapsule?: boolean;
  className?: string;
}

function SceneContent({ config, size, showCapsule }: { config?: Minime3DConfig; size?: number; showCapsule?: boolean }) {
  const scale = (size ?? 120) / 120;
  return (
    <>
      <color attach="background" args={['#a89f94']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} castShadow shadow-mapSize={[512, 512]} />
      <directionalLight position={[-3, 4, 3]} intensity={0.4} />
      <Environment preset="studio" />
      {showCapsule && <Capsule radius={1.5} height={2.6} position={[0, 0, 0]} transparent />}
      <Suspense fallback={null}>
        <Minime3DCharacter config={config} scale={scale} />
      </Suspense>
    </>
  );
}

export function Minime3DScene({ config = {}, size = 150, showCapsule = true, className = '' }: Minime3DSceneProps) {
  return (
    <div className={className} style={{ width: size, height: size, background: '#a89f94', borderRadius: 12 }}>
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 42 }}
        shadows
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <SceneContent config={config} size={size} showCapsule={showCapsule} />
      </Canvas>
    </div>
  );
}
