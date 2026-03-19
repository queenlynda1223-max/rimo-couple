'use client';

import { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import {
  ATLAS_PARTS,
  ATLAS_PIXEL_W,
  ATLAS_COL_PX,
  ATLAS_PIXEL_H,
  ATLAS_BODY_H,
  type AtlasGender,
  type AtlasHair,
  type AtlasOutfit,
  type AtlasShoes,
} from './atlasUV';

const ATLAS_URL = '/minime/atlas.png';
const BODY_REPEAT_V = ATLAS_BODY_H / ATLAS_PIXEL_H;
const BASE_PLANE_H = 1.45;

type UVRect = { offset: [number, number]; repeat: [number, number] };

function useAtlasMaterial(source: THREE.Texture, uv: UVRect) {
  const mat = useMemo(() => {
    const map = source.clone();
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = THREE.ClampToEdgeWrapping;
    map.wrapT = THREE.ClampToEdgeWrapping;
    map.repeat.set(uv.repeat[0], uv.repeat[1]);
    map.offset.set(uv.offset[0], uv.offset[1]);
    map.needsUpdate = true;
    return new THREE.MeshBasicMaterial({
      map,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, [source, uv.offset[0], uv.offset[1], uv.repeat[0], uv.repeat[1]]);

  useEffect(() => {
    return () => {
      mat.map?.dispose();
      mat.dispose();
    };
  }, [mat]);

  return mat;
}

function AtlasLayer({
  texture,
  uv,
  z,
  width,
  height,
  y = 0,
}: {
  texture: THREE.Texture;
  uv: UVRect;
  z: number;
  width: number;
  height: number;
  y?: number;
}) {
  const mat = useAtlasMaterial(texture, uv);
  return (
    <mesh position={[0, y, z]} material={mat}>
      <planeGeometry args={[width, height]} />
    </mesh>
  );
}

export interface MinimeAtlasProps {
  gender?: AtlasGender;
  hair?: AtlasHair;
  outfit?: AtlasOutfit;
  shoes?: AtlasShoes;
  scale?: number;
}

export function MinimeAtlas({
  gender = 'girl',
  hair = 'long',
  outfit = 'casual',
  shoes = 'sneakers',
  scale = 1,
}: MinimeAtlasProps) {
  const texture = useTexture(ATLAS_URL) as THREE.Texture;

  const baseKey = `${gender}_base` as keyof typeof ATLAS_PARTS;
  const baseUv = ATLAS_PARTS[baseKey] ?? ATLAS_PARTS.girl_base;

  const outfitKey = `outfit_${outfit}` as keyof typeof ATLAS_PARTS;
  const outfitUv = ATLAS_PARTS[outfitKey] ?? ATLAS_PARTS.outfit_casual;

  const shoesKey = `shoes_${shoes}` as keyof typeof ATLAS_PARTS;
  const shoesUv = ATLAS_PARTS[shoesKey] ?? ATLAS_PARTS.shoes_sneakers;

  const hairKey = `hair_${hair}` as keyof typeof ATLAS_PARTS;
  const hairUv = ATLAS_PARTS[hairKey] ?? ATLAS_PARTS.hair_long;

  const planeW = (repeatU: number) => (repeatU * ATLAS_PIXEL_W) / ATLAS_COL_PX;
  const planeH = (repeatV: number) => BASE_PLANE_H * (repeatV / BODY_REPEAT_V);

  const hb = planeH(baseUv.repeat[1]);
  const hs = planeH(shoesUv.repeat[1]);
  /** plane 중심 기준 하단 맞춤 (신발만 높이가 작음) */
  const shoesY = (hs - hb) / 2;

  return (
    <group scale={scale}>
      <AtlasLayer texture={texture} uv={baseUv} z={0} width={planeW(baseUv.repeat[0])} height={hb} />
      <AtlasLayer texture={texture} uv={outfitUv} z={0.01} width={planeW(outfitUv.repeat[0])} height={planeH(outfitUv.repeat[1])} />
      <AtlasLayer texture={texture} uv={shoesUv} z={0.02} width={planeW(shoesUv.repeat[0])} height={hs} y={shoesY} />
      <AtlasLayer texture={texture} uv={hairUv} z={0.03} width={planeW(hairUv.repeat[0])} height={planeH(hairUv.repeat[1])} />
    </group>
  );
}

useTexture.preload(ATLAS_URL);
