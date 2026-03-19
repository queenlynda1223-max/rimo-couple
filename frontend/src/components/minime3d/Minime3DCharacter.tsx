'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

export interface Minime3DConfig {
  /** 아틀라스 성별: girl | boy (백엔드 faceType과 동기화) */
  faceType?: string;
  skinColor?: string;
  hairStyle?: string;
  hairColor?: string;
  expression?: string;
  outfit?: string;
  outfitColor?: string;
  accessories?: string[];
}

const SKIN_HEX: Record<string, string> = {
  fair: '#FDE8D0',
  light: '#F5D6B8',
  medium: '#DBA97B',
  tan: '#C08B5C',
  dark: '#8D5524',
  deep: '#5C3310',
};

function matteMaterial(hex: string) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(hex),
    roughness: 0.92,
    metalness: 0.06,
    flatShading: false,
  });
}

interface Minime3DCharacterProps {
  config?: Minime3DConfig;
  scale?: number;
}

export function Minime3DCharacter({ config = {}, scale = 1 }: Minime3DCharacterProps) {
  const skinColor = config.skinColor ?? 'fair';
  const hairStyle = config.hairStyle ?? 'long_straight';
  const hairColor = config.hairColor ?? '#2C1810';
  const expression = config.expression ?? 'gentle_smile';
  const outfit = config.outfit ?? 'dress_cream';
  const outfitColor = config.outfitColor ?? '#F5F0E1';
  const accessories = config.accessories ?? [];
  const hasSkirt = outfit === 'dress_cream' || outfit === 'dress';
  const legCenterY = hasSkirt ? -0.51 : -0.24;
  const shoeY = hasSkirt ? -0.66 : -0.39;

  const skinHex = SKIN_HEX[skinColor] ?? SKIN_HEX.fair;

  const materials = useMemo(
    () => ({
      skin: matteMaterial(skinHex),
      hair: matteMaterial(hairColor),
      outfit: matteMaterial(outfitColor),
      eye: new THREE.MeshStandardMaterial({ color: '#3d2914', roughness: 0.9, metalness: 0 }),
      eyeHighlight: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.3, metalness: 0 }),
      mouth: new THREE.MeshStandardMaterial({ color: '#c97b7b', roughness: 0.9, metalness: 0 }),
      glass: new THREE.MeshStandardMaterial({
        color: '#e8e8e8',
        roughness: 0.2,
        metalness: 0.6,
        transparent: true,
        opacity: 0.85,
      }),
      shoe: new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.9, metalness: 0 }),
    }),
    [skinHex, hairColor, outfitColor]
  );

  const s = scale;

  return (
    <group scale={s} position={[0, -0.28, 0]}>
      {/* y 스택: 다리 → 치마/몸통 → 목 → 머리 (틈 없이 맞춤) */}
      {/* Head — 목 위 y=0.60 에 닿도록 */}
      <mesh position={[0, 1.1, 0]} material={materials.skin} castShadow receiveShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
      </mesh>

      {hairStyle === 'long_straight' && (
        <>
          <mesh position={[-0.32, 0.88, -0.12]} material={materials.hair} castShadow>
            <boxGeometry args={[0.2, 0.68, 0.08]} />
          </mesh>
          <mesh position={[0.32, 0.88, -0.12]} material={materials.hair} castShadow>
            <boxGeometry args={[0.2, 0.68, 0.08]} />
          </mesh>
        </>
      )}
      {hairStyle === 'ponytail' && (
        <mesh position={[0, 0.42, -0.32]} material={materials.hair} castShadow>
          <cylinderGeometry args={[0.08, 0.06, 0.48, 12]} />
        </mesh>
      )}

      <mesh position={[0, 1.35, 0]} material={materials.hair} castShadow>
        <sphereGeometry args={[0.48, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
      </mesh>
      {(hairStyle === 'long_straight' || hairStyle === 'bob') && (
        <mesh position={[0, 1.05, 0.18]} material={materials.hair} castShadow>
          <boxGeometry args={[0.75, 0.24, 0.14]} />
        </mesh>
      )}
      {hairStyle === 'bun' && (
        <mesh position={[0, 1.65, 0]} material={materials.hair} castShadow>
          <sphereGeometry args={[0.2, 16, 16]} />
        </mesh>
      )}

      {/* Neck — 몸통 상단 y≈0.46 과 맞닿음 */}
      <mesh position={[0, 0.53, 0]} material={materials.skin} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.14, 16]} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0.22, 0]} material={materials.outfit} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.4, 0.48, 20]} />
      </mesh>
      {(outfit === 'dress_cream' || outfit === 'dress') && (
        <mesh position={[0, -0.18, 0]} material={materials.outfit} castShadow>
          <cylinderGeometry args={[0.4, 0.44, 0.34, 20]} />
        </mesh>
      )}

      {/* Arms — 약간 앞(z+)으로 빼서 정면에서 보이게 */}
      <mesh position={[-0.4, 0.26, 0.1]} rotation={[0.2, 0, 0.35]} material={materials.skin} castShadow>
        <cylinderGeometry args={[0.065, 0.055, 0.32, 12]} />
      </mesh>
      <mesh position={[0.42, 0.3, 0.12]} rotation={[0.15, 0, -0.25]} material={materials.skin} castShadow>
        <cylinderGeometry args={[0.065, 0.055, 0.28, 12]} />
      </mesh>

      {/* Legs — 치마 있으면 치마 아래, 없으면 몸통 바로 아래 */}
      <mesh position={[-0.12, legCenterY, 0]} material={materials.skin} castShadow>
        <cylinderGeometry args={[0.08, 0.06, 0.3, 12]} />
      </mesh>
      <mesh position={[0.12, legCenterY, 0]} material={materials.skin} castShadow>
        <cylinderGeometry args={[0.08, 0.06, 0.3, 12]} />
      </mesh>

      <mesh position={[-0.12, shoeY, 0.02]} material={materials.shoe} castShadow>
        <boxGeometry args={[0.12, 0.06, 0.2]} />
      </mesh>
      <mesh position={[0.12, shoeY, 0.02]} material={materials.shoe} castShadow>
        <boxGeometry args={[0.12, 0.06, 0.2]} />
      </mesh>

      {(expression === 'gentle_smile' || expression === 'happy' || expression === 'neutral') && (
        <>
          <mesh position={[-0.15, 1.18, 0.42]} material={materials.eye} castShadow>
            <sphereGeometry args={[0.08, 16, 16]} />
          </mesh>
          <mesh position={[0.15, 1.18, 0.42]} material={materials.eye} castShadow>
            <sphereGeometry args={[0.08, 16, 16]} />
          </mesh>
          <mesh position={[-0.12, 1.22, 0.48]} material={materials.eyeHighlight}>
            <sphereGeometry args={[0.03, 8, 8]} />
          </mesh>
          <mesh position={[0.18, 1.22, 0.48]} material={materials.eyeHighlight}>
            <sphereGeometry args={[0.03, 8, 8]} />
          </mesh>
        </>
      )}
      {expression === 'wink' && (
        <>
          <mesh position={[-0.15, 1.18, 0.42]} material={materials.eye} castShadow>
            <sphereGeometry args={[0.08, 16, 16]} />
          </mesh>
          <mesh position={[-0.12, 1.22, 0.48]} material={materials.eyeHighlight}>
            <sphereGeometry args={[0.03, 8, 8]} />
          </mesh>
          <mesh position={[0.15, 1.16, 0.42]} material={materials.eye} castShadow>
            <boxGeometry args={[0.14, 0.04, 0.02]} />
          </mesh>
        </>
      )}

      {(expression === 'gentle_smile' || expression === 'happy') && (
        <mesh position={[0, 0.98, 0.46]} material={materials.mouth} castShadow>
          <sphereGeometry args={[0.04, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        </mesh>
      )}
      {expression === 'neutral' && (
        <mesh position={[0, 0.96, 0.46]} material={materials.mouth} castShadow>
          <boxGeometry args={[0.08, 0.02, 0.02]} />
        </mesh>
      )}

      {(accessories.includes('glasses_silver') || accessories.includes('glasses')) && (
        <group position={[0, 1.15, 0.5]}>
          <mesh material={materials.glass}>
            <boxGeometry args={[0.12, 0.08, 0.02]} />
          </mesh>
          <mesh position={[0.16, 0, 0]} material={materials.glass}>
            <boxGeometry args={[0.12, 0.08, 0.02]} />
          </mesh>
          <mesh position={[0.08, -0.05, 0]} material={materials.glass}>
            <boxGeometry args={[0.06, 0.02, 0.02]} />
          </mesh>
        </group>
      )}

      {accessories.includes('headband') && (
        <mesh position={[0, 1.5, 0.1]} rotation={[Math.PI / 2, 0, 0]} material={materials.outfit} castShadow>
          <torusGeometry args={[0.45, 0.04, 8, 32]} />
        </mesh>
      )}
    </group>
  );
}
