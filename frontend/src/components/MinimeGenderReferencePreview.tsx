'use client';

import { MINIME_CUTOUT_SRC } from './minime/minimeCutoutSrc';

export type MinimePreviewFace = 'boy' | 'girl';

interface MinimeGenderReferencePreviewProps {
  faceType: MinimePreviewFace;
}

export function MinimeGenderReferencePreview({ faceType }: MinimeGenderReferencePreviewProps) {
  return (
    <div className="w-full max-w-[min(100%,380px)] mx-auto rounded-2xl overflow-hidden shadow-md border border-white/30 flex items-center justify-center min-h-[200px] max-h-[min(85vh,560px)] bg-white/5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={MINIME_CUTOUT_SRC[faceType]}
        alt=""
        draggable={false}
        className="w-full h-auto max-h-[min(85vh,560px)] object-contain object-center select-none"
      />
    </div>
  );
}
