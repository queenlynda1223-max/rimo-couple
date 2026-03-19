'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

interface CapsuleProps {
  radius?: number;
  height?: number;
  position?: [number, number, number];
  transparent?: boolean;
}

export function Capsule({ radius = 1.4, height = 2.2, position = [0, 0, 0], transparent = true }: CapsuleProps) {
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#f5f5f0',
        roughness: 0.05,
        metalness: 0,
        transparent,
        opacity: transparent ? 0.25 : 1,
        transmission: transparent ? 0.95 : 0,
        thickness: 0.15,
        side: THREE.DoubleSide,
      }),
    [transparent]
  );

  const cylHeight = Math.max(0.01, height - radius * 2);
  const half = cylHeight / 2;

  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} material={material}>
        <cylinderGeometry args={[radius, radius, cylHeight, 32]} />
      </mesh>
      <mesh position={[0, half + radius, 0]} material={material}>
        <sphereGeometry args={[radius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      <mesh position={[0, -half - radius, 0]} material={material}>
        <sphereGeometry args={[radius, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
      </mesh>
    </group>
  );
}
