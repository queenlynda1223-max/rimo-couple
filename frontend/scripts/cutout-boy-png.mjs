/**
 * 검은 배경 이미지 → 알파 PNG (minime-boy.png)
 * 사용: public/minime/minime-boy-source.jpg (또는 .png) 를 넣은 뒤
 *       npm run minime:boy-cutout
 * 또는: node scripts/cutout-boy-png.mjs path/to/source.jpg
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join, isAbsolute } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const defaultInput = join(root, 'public/minime/minime-boy-source.jpg');
const argIn = process.argv[2];
const input = argIn
  ? isAbsolute(argIn)
    ? argIn
    : join(root, argIn)
  : defaultInput;
const output = join(root, 'public/minime/minime-boy.png');

function keyBlack(r, g, b) {
  return r < 55 && g < 55 && b < 55;
}

function keyWhiteFringe(r, g, b) {
  return r > 232 && g > 232 && b > 232;
}

async function main() {
  if (!existsSync(input)) {
    console.error('Missing input:', input);
    console.error('Add public/minime/minime-boy-source.jpg or: node scripts/cutout-boy-png.mjs <file>');
    process.exit(1);
  }
  const buf = readFileSync(input);
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const stride = 4;
  const idx = (x, y) => (y * w + x) * stride;
  const out = Buffer.from(data);

  for (let p = 0; p < w * h; p++) {
    const i = p * stride;
    const r = out[i],
      g = out[i + 1],
      b = out[i + 2];
    if (keyBlack(r, g, b)) out[i + 3] = 0;
  }

  const maxPasses = 12;
  for (let pass = 0; pass < maxPasses; pass++) {
    let changed = 0;
    const toClear = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const p = y * w + x;
        const i = idx(x, y);
        if (out[i + 3] === 0) continue;
        const r = out[i],
          g = out[i + 1],
          b = out[i + 2];
        if (!keyWhiteFringe(r, g, b)) continue;
        let adj = false;
        const neigh = [
          [x - 1, y],
          [x + 1, y],
          [x, y - 1],
          [x, y + 1],
        ];
        for (const [nx, ny] of neigh) {
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          if (out[idx(nx, ny) + 3] === 0) {
            adj = true;
            break;
          }
        }
        if (adj) {
          toClear.push(p);
          changed++;
        }
      }
    }
    for (const p of toClear) out[p * stride + 3] = 0;
    if (changed === 0) break;
  }

  const pngBuf = await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
  writeFileSync(output, pngBuf);
  console.log('Wrote', output, `${w}x${h}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
