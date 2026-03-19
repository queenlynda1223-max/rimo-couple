/** 미니미 패널·홈·미니룸 공통 컷아웃 PNG */
export const MINIME_CUTOUT_SRC = {
  boy: '/minime/minime-boy.png',
  girl: '/minime/minime-girl.png',
} as const;

export type MinimeCutoutGender = keyof typeof MINIME_CUTOUT_SRC;

export function minimeSrcForFaceType(faceType: string | undefined | null): string {
  return faceType === 'boy' ? MINIME_CUTOUT_SRC.boy : MINIME_CUTOUT_SRC.girl;
}
