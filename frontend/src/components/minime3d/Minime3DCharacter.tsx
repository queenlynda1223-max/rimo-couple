'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

export interface Minime3DConfig {
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

  const skinHex = SKIN_HEX[skinColor] ?? SKIN_HEX.fair;

  const materials = useMemo(() => ({
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
  }), [skinHex, hairColor, outfitColor]);

  const s = scale;

  return (
    <group scale={s} position={[0, 0, 0]}>
      {/* Chibi proportions: big head, small body */}
      {/* Head */}
      <mesh position={[0, 1.2, 0]} material={materials.skin} castShadow receiveShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
      </mesh>

      {/* Hair - back layer (drawn first so it goes behind) */}
      {hairStyle === 'long_straight' && (
        <>
          <mesh position={[-0.32, 0.95, -0.15]} material={materials.hair} castShadow>
            <boxGeometry args={[0.2, 0.7, 0.08]} />
          </mesh>
          <mesh position={[0.32, 0.95, -0.15]} material={materials.hair} castShadow>
            <boxGeometry args={[0.2, 0.7, 0.08]} />
          </mesh>
        </>
      )}
      {hairStyle === 'ponytail' && (
        <mesh position={[0, 0.5, -0.35]} material={materials.hair} castShadow>
          <cylinderGeometry args={[0.08, 0.06, 0.5, 12]} />
        </mesh>
      )}

      {/* Hair - cap on top */}
      <mesh position={[0, 1.45, 0]} material={materials.hair} castShadow>
        <sphereGeometry args={[0.48, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
      </mesh>
      {(hairStyle === 'long_straight' || hairStyle === 'bob') && (
        <mesh position={[0, 1.15, 0.2]} material={materials.hair} castShadow>
          <boxGeometry args={[0.75, 0.25, 0.15]} />
        </mesh>
      )}
      {hairStyle === 'bun' && (
        <mesh position={[0, 1.75, 0]} material={materials.hair} castShadow>
          <sphereGeometry args={[0.2, 16, 16]} />
        </mesh>
      )}

      {/* Neck */}
      <mesh position={[0, 0.75, 0]} material={materials.skin} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.2, 16]} />
      </mesh>

      {/* Body / Torso - dress or top */}
      <mesh position={[0, 0.2, 0]} material={materials.outfit} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.4, 0.5, 20]} />
      </mesh>
      {(outfit === 'dress_cream' || outfit === 'dress') && (
        <mesh position={[0, -0.25, 0]} material={materials.outfit} castShadow>
          <cylinderGeometry args={[0.4, 0.45, 0.35, 20]} />
        </mesh>
      )}

      {/* Arms - one on hip, one slightly raised */}
      <mesh position={[-0.38, 0.25, 0]} rotation={[0, 0, 0.3]} material={materials.skin} castShadow>
        <cylinderGeometry args={[0.06, 0.05, 0.35, 12]} />
      </mesh>
      <mesh position={[0.4, 0.35, 0.1]} rotation={[0, 0, -0.2]} material={materials.skin} castShadow>
        <cylinderGeometry args={[0.06, 0.05, 0.3, 12]} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.12, -0.55, 0]} material={materials.skin} castShadow>
        <cylinderGeometry args={[0.08, 0.06, 0.35, 12]} />
      </mesh>
      <mesh position={[0.12, -0.55, 0]} material={materials.skin} castShadow>
        <cylinderGeometry args={[0.08, 0.06, 0.35, 12]} />
      </mesh>

      {/* Shoes */}
      <mesh position={[-0.12, -0.72, 0.02]} material={materials.shoe} castShadow>
        <boxGeometry args={[0.12, 0.06, 0.2]} />
      </mesh>
      <mesh position={[0.12, -0.72, 0.02]} material={materials.shoe} castShadow>
        <boxGeometry args={[0.12, 0.06, 0.2]} />
      </mesh>

      {/* Face - eyes */}
      {(expression === 'gentle_smile' || expression === 'happy' || expression === 'neutral') && (
        <>
          <mesh position={[-0.15, 1.28, 0.42]} material={materials.eye} castShadow>
            <sphereGeometry args={[0.08, 16, 16]} />
          </mesh>
          <mesh position={[0.15, 1.28, 0.42]} material={materials.eye} castShadow>
            <sphereGeometry args={[0.08, 16, 16]} />
          </mesh>
          <mesh position={[-0.12, 1.32, 0.48]} material={materials.eyeHighlight}>
            <sphereGeometry args={[0.03, 8, 8]} />
          </mesh>
          <mesh position={[0.18, 1.32, 0.48]} material={materials.eyeHighlight}>
            <sphereGeometry args={[0.03, 8, 8]} />
          </mesh>
        </>
      )}
      {expression === 'wink' && (
        <>
          <mesh position={[-0.15, 1.28, 0.42]} material={materials.eye} castShadow>
            <sphereGeometry args={[0.08, 16, 16]} />
          </mesh>
          <mesh position={[-0.12, 1.32, 0.48]} material={materials.eyeHighlight}>
            <sphereGeometry args={[0.03, 8, 8]} />
          </mesh>
          <mesh position={[0.15, 1.26, 0.42]} material={materials.eye} castShadow>
            <boxGeometry args={[0.14, 0.04, 0.02]} />
          </mesh>
        </>
      )}

      {/* Mouth */}
      {(expression === 'gentle_smile' || expression === 'happy') && (
        <mesh position={[0, 1.08, 0.46]} rotation={[0, 0, 0]} material={materials.mouth} castShadow>
          <sphereGeometry args={[0.04, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        </mesh>
      )}
      {expression === 'neutral' && (
        <mesh position={[0, 1.06, 0.46]} material={materials.mouth} castShadow>
          <boxGeometry args={[0.08, 0.02, 0.02]} />
        </mesh>
      )}

      {/* Accessories - glasses_silver / glasses */}
      {(accessories.includes('glasses_silver') || accessories.includes('glasses')) && (
        <group position={[0, 1.25, 0.5]}>
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

      {/* Headband */}
      {accessories.includes('headband') && (
        <mesh position={[0, 1.6, 0.1]} rotation={[Math.PI / 2, 0, 0]} material={materials.outfit} castShadow>
          <torusGeometry args={[0.45, 0.04, 8, 32]} />
        </mesh>
      )}
    </group>
  );
}
