'use client';

import { useState } from 'react';
import { minimeSrcForFaceType } from './minime/minimeCutoutSrc';

interface MinimeCutoutImgProps {
  config?: Record<string, unknown> | null;
  /** 정사각 박스 한 변 (px) — 이미지는 object-contain으로 맞춤 */
  size: number;
  className?: string;
}

export function MinimeCutoutImg({ config, size, className = '' }: MinimeCutoutImgProps) {
  const [broken, setBroken] = useState(false);
  const src = minimeSrcForFaceType(config?.faceType as string | undefined);

  if (broken) {
    return (
      <div
        className={`rounded-lg bg-gradient-to-b from-pink-100 to-rose-100 ${className}`}
        style={{ width: size, height: size }}
        aria-hidden
      />
    );
  }

  return (
    <div
      className={`flex items-end justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        draggable={false}
        onError={() => setBroken(true)}
        className="max-w-full max-h-full w-auto h-auto object-contain object-bottom pointer-events-none select-none"
      />
    </div>
  );
}
