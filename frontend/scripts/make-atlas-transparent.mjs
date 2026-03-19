/**
 * 아틀라스에서 체커/밝은 배경을 알파로 제거.
 * 1) 가장자리에서 엄격한 배경 픽셀로 flood fill
 * 2) 투명 픽셀과 맞닿은 느슨한 배경 픽셀을 반복 전파 (스프라이트 사이 그리드 제거)
 *
 * 사용: npm run atlas:transparent
 *       node scripts/make-atlas-transparent.mjs public/minime/reference-genders.png
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join, isAbsolute } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const arg = process.argv[2];
const inputPath = arg
  ? isAbsolute(arg)
    ? arg
    : join(root, arg)
  : join(root, 'public/minime/atlas.png');

/** 가장자리 시드용 — 캐릭터 색은 제외 */
function isStrictBackground(r, g, b) {
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  const spread = mx - mn;
  const lum = (r + g + b) / 3;
  if (lum < 232) return false;
  if (spread > 18) return false;
  return true;
}

/** 전파용 — 체커 안쪽·경계도 잡되, 피부/옷은 가능한 제외 */
function isLooseBackground(r, g, b) {
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  const spread = mx - mn;
  const lum = (r + g + b) / 3;
  if (lum < 220) return false;
  if (spread > 26) return false;
  return true;
}

async function main() {
  const inputBuf = readFileSync(inputPath);

  const img = sharp(inputBuf);
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const stride = 4;
  const idx = (x, y) => (y * w + x) * stride;

  const transparent = new Uint8Array(w * h);
  const queue = [];

  const markTransparent = (p) => {
    if (transparent[p]) return;
    transparent[p] = 1;
    queue.push(p);
  };

  const trySeed = (x, y, pred) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const p = y * w + x;
    if (transparent[p]) return;
    const i = idx(x, y);
    if (!pred(data[i], data[i + 1], data[i + 2])) return;
    markTransparent(p);
  };

  for (let x = 0; x < w; x++) {
    trySeed(x, 0, isStrictBackground);
    trySeed(x, h - 1, isStrictBackground);
  }
  for (let y = 0; y < h; y++) {
    trySeed(0, y, isStrictBackground);
    trySeed(w - 1, y, isStrictBackground);
  }

  while (queue.length) {
    const p = queue.pop();
    const x = p % w;
    const y = (p / w) | 0;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const np = ny * w + nx;
      if (transparent[np]) continue;
      const ni = idx(nx, ny);
      if (!isStrictBackground(data[ni], data[ni + 1], data[ni + 2])) continue;
      markTransparent(np);
    }
  }

  // 전파: 이미 투명인 옆의 느슨한 배경까지 (그리드 "섬" 제거)
  const maxPasses = 80;
  for (let pass = 0; pass < maxPasses; pass++) {
    let changed = 0;
    const toClear = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const p = y * w + x;
        if (transparent[p]) continue;
        const i = idx(x, y);
        if (!isLooseBackground(data[i], data[i + 1], data[i + 2])) continue;
        let adj = false;
        if (x > 0 && transparent[p - 1]) adj = true;
        else if (x < w - 1 && transparent[p + 1]) adj = true;
        else if (y > 0 && transparent[p - w]) adj = true;
        else if (y < h - 1 && transparent[p + w]) adj = true;
        if (adj) {
          toClear.push(p);
          changed++;
        }
      }
    }
    for (const p of toClear) transparent[p] = 1;
    if (changed === 0) break;
  }

  const out = Buffer.from(data);
  for (let p = 0; p < w * h; p++) {
    if (transparent[p]) {
      const i = p * stride;
      out[i + 3] = 0;
    }
  }

  const pngBuf = await sharp(out, {
    raw: { width: w, height: h, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toBuffer();

  writeFileSync(inputPath, pngBuf);
  console.log('Wrote', inputPath, `(${w}x${h}, RGBA PNG, transparent + propagated)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
