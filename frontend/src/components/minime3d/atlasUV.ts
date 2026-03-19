/**
 * atlas.png 1024×682 — 픽셀 박스 기준 UV (Three.js 기본 texture.flipY).
 * offset/repeat: repeat = (w/W, h/H), offset = (left/W, 1 - (top+h)/H)  (top = 이미지 위에서 아래)
 *
 * 상단 4열(각 256px): boy | girl | hair_wave | hair_long — 세로는 동일 프레임(y=35, h=631)으로 맞춤.
 * 의상 3종: x=522 / 673 / 816, 동일 세로 프레임으로 베이스와 발 위치 정렬.
 * 신발: 하단 bbox 별도.
 */
export const ATLAS_PIXEL_W = 1024;
export const ATLAS_PIXEL_H = 682;
/** 베이스·헤어·의상 열 너비(px) */
export const ATLAS_COL_PX = 256;

const W = ATLAS_PIXEL_W;
const H = ATLAS_PIXEL_H;

function uvRect(left: number, top: number, width: number, height: number) {
  return {
    offset: [left / W, 1 - (top + height) / H] as [number, number],
    repeat: [width / W, height / H] as [number, number],
  };
}

/** 베이스·헤어·의상 공통 세로 (캐릭터 전신에 맞춤) */
const BODY_TOP = 35;
export const ATLAS_BODY_H = 631;
const BODY_H = ATLAS_BODY_H;

export const ATLAS_PARTS = {
  boy_base: uvRect(0, BODY_TOP, 256, BODY_H),
  girl_base: uvRect(256, BODY_TOP, 256, BODY_H),

  hair_wave: uvRect(512, BODY_TOP, 256, BODY_H),
  hair_long: uvRect(768, BODY_TOP, 256, BODY_H),

  outfit_casual: uvRect(522, BODY_TOP, 140, BODY_H),
  outfit_school: uvRect(673, BODY_TOP, 142, BODY_H),
  outfit_winter: uvRect(816, BODY_TOP, 146, BODY_H),

  shoes_sneakers: uvRect(54, 580, 197, 85),
  shoes_loafers: uvRect(250, 580, 212, 86),
  shoes_boots: uvRect(523, 534, 258, 128),
} as const;

export type AtlasGender = 'boy' | 'girl';
export type AtlasHair = 'long' | 'wave';
export type AtlasOutfit = 'casual' | 'school' | 'winter';
export type AtlasShoes = 'sneakers' | 'loafers' | 'boots';
