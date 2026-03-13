export type Grid = (string | null)[][];
export interface SpriteConfig {
  skinColor: string;
  hairColor: string;
  outfitColor: string;
  hairStyle: string;
  outfit: string;
  expression: string;
  accessories: string[];
  frame: number;
}

const W = 64, H = 80;
export const SPRITE_W = W;
export const SPRITE_H = H;

function grid(): Grid { return Array.from({ length: H }, () => Array(W).fill(null)); }
function px(g: Grid, x: number, y: number, c: string) { if (x >= 0 && x < W && y >= 0 && y < H) g[y][x] = c; }
function rect(g: Grid, x: number, y: number, w: number, h: number, c: string) {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) px(g, x + i, y + j, c);
}
function ell(g: Grid, cx: number, cy: number, rx: number, ry: number, c: string) {
  for (let j = -ry; j <= ry; j++)
    for (let i = -rx; i <= rx; i++)
      if ((i * i) / (rx * rx) + (j * j) / (ry * ry) <= 1) px(g, cx + i, cy + j, c);
}
function shade(g: Grid, x1: number, y1: number, x2: number, y2: number, from: string, to: string) {
  for (let y = Math.max(0, y1); y <= Math.min(H - 1, y2); y++)
    for (let x = Math.max(0, x1); x <= Math.min(W - 1, x2); x++)
      if (g[y][x] === from) g[y][x] = to;
}
function shadeEll(g: Grid, cx: number, cy: number, rx: number, ry: number, from: string, to: string) {
  for (let j = -ry; j <= ry; j++)
    for (let i = -rx; i <= rx; i++)
      if ((i * i) / (rx * rx) + (j * j) / (ry * ry) <= 1) {
        const x = cx + i, y = cy + j;
        if (x >= 0 && x < W && y >= 0 && y < H && g[y][x] === from) g[y][x] = to;
      }
}
function autoOutline(g: Grid) {
  const snap = g.map(r => [...r]);
  const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (!snap[y][x] && dirs.some(([dx, dy]) => {
        const nx = x + dx, ny = y + dy;
        return nx >= 0 && nx < W && ny >= 0 && ny < H && snap[ny][nx] != null;
      }))
        g[y][x] = 'B';
}

function drawBody(g: Grid, f: number) {
  // Head
  ell(g, 32, 18, 15, 16, 'S');
  shadeEll(g, 28, 12, 13, 11, 'S', '3');
  shade(g, 36, 22, 47, 34, 'S', 's');
  shade(g, 22, 30, 42, 34, 'S', 's');
  shade(g, 22, 30, 42, 34, '3', 'S');
  shade(g, 26, 32, 38, 34, 's', '2');

  // Ears
  ell(g, 16, 20, 2, 3, 'S'); ell(g, 48, 20, 2, 3, 'S');
  px(g, 16, 20, 'P'); px(g, 48, 20, 'P');
  px(g, 16, 21, 's'); px(g, 48, 21, 's');

  // Neck
  rect(g, 28, 35, 8, 4, 'S');
  shade(g, 28, 35, 35, 37, 'S', 's');
  shade(g, 28, 35, 35, 36, 's', '2');

  // Hands
  ell(g, 14, 55, 3, 3, 'S'); ell(g, 50, 55, 3, 3, 'S');
  shadeEll(g, 15, 56, 2, 2, 'S', 's');
  shadeEll(g, 51, 56, 2, 2, 'S', 's');

  // Legs
  const lo = f === 1 ? -1 : f === 3 ? 1 : 0;
  rect(g, 24, 58, 6, 14 + lo, 'S'); rect(g, 34, 58, 6, 14 - lo, 'S');
  shade(g, 27, 58, 29, 71 + lo, 'S', 's');
  shade(g, 37, 58, 39, 71 - lo, 'S', 's');

  // Shoes
  rect(g, 22, 72 + lo, 10, 4, 'K'); rect(g, 32, 72 - lo, 10, 4, 'K');
  rect(g, 23, 72 + lo, 4, 2, 'k'); rect(g, 33, 72 - lo, 4, 2, 'k');
  shade(g, 22, 74 + lo, 31, 75 + lo, 'K', '2');
  shade(g, 32, 74 - lo, 41, 75 - lo, 'K', '2');
}

function drawOutfit(g: Grid, outfit: string) {
  const torso = () => { rect(g, 20, 39, 24, 18, 'O'); };
  const sleeves = (len: number) => {
    rect(g, 12, 40, 8, len, 'O'); rect(g, 44, 40, 8, len, 'O');
  };
  const collar = (c: string) => { rect(g, 26, 37, 12, 3, 'O'); rect(g, 28, 37, 8, 2, c); };
  const torsoShade = () => {
    shade(g, 20, 50, 43, 56, 'O', 'o');
    shade(g, 34, 42, 43, 56, 'O', 'o');
    shade(g, 12, 46, 19, 52, 'O', 'o');
    shade(g, 48, 46, 51, 52, 'O', 'o');
  };

  switch (outfit) {
    case 'tshirt':
      torso(); sleeves(10); collar('W');
      torsoShade();
      break;
    case 'hoodie':
      rect(g, 18, 39, 28, 18, 'O'); sleeves(14);
      rect(g, 24, 35, 16, 5, 'O'); shade(g, 26, 37, 37, 39, 'O', 'o');
      rect(g, 27, 50, 10, 4, 'o'); // pocket
      px(g, 31, 41, 'W'); px(g, 32, 41, 'W'); px(g, 31, 44, 'W'); px(g, 32, 44, 'W');
      torsoShade();
      break;
    case 'dress':
      torso(); sleeves(8); collar('W');
      rect(g, 16, 52, 32, 14, 'O');
      shade(g, 16, 58, 47, 65, 'O', 'o');
      shade(g, 16, 62, 47, 65, 'o', '5');
      torsoShade();
      break;
    case 'suit':
      torso(); sleeves(12); collar('W');
      rect(g, 28, 39, 8, 14, 'W'); // shirt front
      rect(g, 31, 40, 2, 10, 'R'); // tie
      rect(g, 30, 39, 4, 2, 'R');  // tie knot
      torsoShade();
      break;
    case 'sweater':
      rect(g, 18, 39, 28, 18, 'O'); sleeves(14);
      rect(g, 26, 37, 12, 3, 'O');
      for (let i = 0; i < 3; i++) shade(g, 18, 44 + i * 5, 45, 44 + i * 5, 'O', 'o');
      torsoShade();
      break;
    case 'overall':
      rect(g, 20, 39, 24, 6, 'W'); sleeves(6);
      shade(g, 32, 39, 43, 44, 'W', 'w');
      rect(g, 20, 45, 24, 12, 'O');
      rect(g, 24, 39, 5, 7, 'O'); rect(g, 35, 39, 5, 7, 'O');
      px(g, 26, 45, 'W'); px(g, 37, 45, 'W'); // buttons
      shade(g, 20, 52, 43, 56, 'O', 'o');
      break;
  }
}

function drawFace(g: Grid, expr: string) {
  // Blush
  ell(g, 19, 26, 3, 2, 'P'); ell(g, 45, 26, 3, 2, 'P');

  const openEye = (cx: number) => {
    ell(g, cx, 20, 5, 4, 'W');
    shade(g, cx - 5, 16, cx + 5, 17, 'W', 'w');
    ell(g, cx, 21, 4, 3, 'E');
    ell(g, cx, 21, 2, 2, 'e');
    rect(g, cx + 2, 17, 2, 2, 'W');
    px(g, cx - 2, 23, 'W');
  };
  const closedEye = (cx: number) => {
    rect(g, cx - 4, 20, 9, 1, 'B');
    px(g, cx - 5, 19, 'B'); px(g, cx + 5, 19, 'B');
  };
  const brow = () => {
    rect(g, 20, 13, 7, 2, 'B'); rect(g, 37, 13, 7, 2, 'B');
  };
  const nose = () => { px(g, 32, 27, 's'); px(g, 33, 27, 's'); };

  switch (expr) {
    case 'neutral':
      brow(); openEye(24); openEye(40); nose();
      rect(g, 29, 30, 6, 1, 'R');
      break;
    case 'happy':
      brow(); closedEye(24); closedEye(40); nose();
      px(g, 27, 29, 'R'); rect(g, 28, 30, 8, 1, 'R'); px(g, 36, 29, 'R');
      break;
    case 'wink':
      brow(); openEye(24); closedEye(40); nose();
      px(g, 27, 29, 'R'); rect(g, 28, 30, 8, 1, 'R'); px(g, 36, 29, 'R');
      break;
    case 'love': {
      brow();
      const heart = (cx: number) => {
        px(g, cx - 3, 18, 'R'); px(g, cx - 2, 18, 'R'); px(g, cx + 2, 18, 'R'); px(g, cx + 3, 18, 'R');
        rect(g, cx - 4, 19, 9, 2, 'R'); rect(g, cx - 3, 21, 7, 1, 'R');
        rect(g, cx - 2, 22, 5, 1, 'R'); rect(g, cx - 1, 23, 3, 1, 'R'); px(g, cx, 24, 'R');
      };
      heart(24); heart(40); nose();
      px(g, 27, 29, 'R'); rect(g, 28, 30, 8, 1, 'R'); px(g, 36, 29, 'R');
      break;
    }
    case 'cool':
      rect(g, 20, 12, 7, 2, 'B'); rect(g, 37, 12, 7, 2, 'B');
      openEye(24); openEye(40); nose();
      rect(g, 30, 30, 6, 1, 'R'); px(g, 36, 29, 'R');
      break;
    case 'surprised':
      rect(g, 20, 11, 7, 2, 'B'); rect(g, 37, 11, 7, 2, 'B');
      ell(g, 24, 20, 5, 5, 'W'); ell(g, 24, 21, 4, 4, 'E'); ell(g, 24, 22, 2, 2, 'e');
      rect(g, 27, 16, 2, 2, 'W'); px(g, 21, 23, 'W');
      ell(g, 40, 20, 5, 5, 'W'); ell(g, 40, 21, 4, 4, 'E'); ell(g, 40, 22, 2, 2, 'e');
      rect(g, 43, 16, 2, 2, 'W'); px(g, 37, 23, 'W');
      nose();
      ell(g, 32, 31, 2, 2, 'B');
      break;
    case 'shy':
      brow();
      ell(g, 24, 21, 5, 4, 'W'); shade(g, 19, 16, 29, 18, 'W', 'w');
      ell(g, 24, 23, 4, 3, 'E'); ell(g, 24, 23, 2, 2, 'e');
      rect(g, 27, 18, 2, 2, 'W'); px(g, 21, 24, 'W');
      ell(g, 40, 21, 5, 4, 'W'); shade(g, 35, 16, 45, 18, 'W', 'w');
      ell(g, 40, 23, 4, 3, 'E'); ell(g, 40, 23, 2, 2, 'e');
      rect(g, 43, 18, 2, 2, 'W'); px(g, 37, 24, 'W');
      ell(g, 19, 26, 4, 2, 'P'); ell(g, 45, 26, 4, 2, 'P');
      nose(); rect(g, 29, 30, 5, 1, 'R');
      break;
    case 'sleepy':
      rect(g, 20, 13, 7, 2, 'B'); rect(g, 37, 13, 7, 2, 'B');
      ell(g, 24, 20, 5, 3, 'W'); rect(g, 19, 19, 11, 2, 'B');
      ell(g, 24, 21, 3, 2, 'E');
      ell(g, 40, 20, 5, 3, 'W'); rect(g, 35, 19, 11, 2, 'B');
      ell(g, 40, 21, 3, 2, 'E');
      nose(); ell(g, 32, 31, 2, 1, 'B');
      px(g, 52, 6, 'w'); px(g, 54, 4, 'w'); px(g, 56, 6, 'w');
      px(g, 55, 2, 'w'); px(g, 57, 1, 'w');
      break;
  }
}

function drawHairBack(g: Grid, style: string) {
  switch (style) {
    case 'ponytail':
      rect(g, 28, 34, 8, 28, 'H');
      shade(g, 30, 40, 35, 62, 'H', 'h');
      shade(g, 31, 50, 35, 62, 'h', '4');
      break;
    case 'long':
      rect(g, 10, 20, 6, 42, 'H'); rect(g, 48, 20, 6, 42, 'H');
      shade(g, 10, 42, 15, 62, 'H', 'h');
      shade(g, 50, 42, 53, 62, 'H', 'h');
      shade(g, 10, 52, 15, 62, 'h', '4');
      shade(g, 51, 52, 53, 62, 'h', '4');
      break;
    case 'twintail':
      rect(g, 6, 22, 5, 36, 'H'); rect(g, 53, 22, 5, 36, 'H');
      shade(g, 6, 40, 10, 58, 'H', 'h');
      shade(g, 54, 40, 57, 58, 'H', 'h');
      break;
    default: break;
  }
}

function drawHairFront(g: Grid, style: string) {
  const cap = () => ell(g, 32, 10, 17, 10, 'H');
  const bangs = () => { rect(g, 17, 3, 30, 8, 'H'); rect(g, 18, 11, 28, 3, 'H'); };
  const sideBang = () => { rect(g, 16, 4, 12, 10, 'H'); rect(g, 17, 14, 8, 2, 'H'); };
  const highlight = () => shadeEll(g, 26, 6, 8, 4, 'H', 'l');
  const topShade = () => shade(g, 17, 10, 46, 14, 'H', 'h');

  switch (style) {
    case 'short':
      cap(); sideBang(); highlight(); topShade();
      rect(g, 14, 10, 5, 10, 'H'); rect(g, 45, 10, 5, 10, 'H');
      shade(g, 14, 15, 18, 19, 'H', 'h'); shade(g, 46, 15, 49, 19, 'H', 'h');
      break;
    case 'bob':
      cap(); bangs(); highlight(); topShade();
      rect(g, 12, 10, 6, 20, 'H'); rect(g, 46, 10, 6, 20, 'H');
      shade(g, 12, 22, 17, 29, 'H', 'h'); shade(g, 47, 22, 51, 29, 'H', 'h');
      break;
    case 'medium':
      cap(); bangs(); highlight(); topShade();
      rect(g, 11, 10, 6, 28, 'H'); rect(g, 47, 10, 6, 28, 'H');
      shade(g, 11, 26, 16, 37, 'H', 'h'); shade(g, 48, 26, 52, 37, 'H', 'h');
      shade(g, 11, 32, 16, 37, 'h', '4'); shade(g, 49, 32, 52, 37, 'h', '4');
      break;
    case 'long':
      cap(); bangs(); highlight(); topShade();
      rect(g, 10, 10, 6, 14, 'H'); rect(g, 48, 10, 6, 14, 'H');
      shade(g, 10, 18, 15, 23, 'H', 'h'); shade(g, 49, 18, 53, 23, 'H', 'h');
      break;
    case 'ponytail':
      cap(); sideBang(); highlight(); topShade();
      rect(g, 14, 10, 5, 10, 'H'); rect(g, 45, 10, 5, 10, 'H');
      rect(g, 26, 32, 12, 4, 'H');
      shade(g, 14, 15, 18, 19, 'H', 'h'); shade(g, 46, 15, 49, 19, 'H', 'h');
      break;
    case 'curly':
      ell(g, 32, 10, 19, 12, 'H');
      bangs(); highlight();
      rect(g, 10, 12, 5, 6, 'H'); rect(g, 49, 12, 5, 6, 'H');
      rect(g, 12, 18, 5, 6, 'H'); rect(g, 47, 18, 5, 6, 'H');
      rect(g, 14, 24, 4, 5, 'H'); rect(g, 46, 24, 4, 5, 'H');
      shade(g, 10, 16, 16, 28, 'H', 'h'); shade(g, 48, 16, 53, 28, 'H', 'h');
      topShade();
      break;
    case 'twintail':
      cap(); bangs(); highlight(); topShade();
      rect(g, 8, 16, 5, 7, 'H'); rect(g, 51, 16, 5, 7, 'H');
      shade(g, 8, 20, 12, 22, 'H', 'h'); shade(g, 52, 20, 55, 22, 'H', 'h');
      break;
    case 'bun':
      cap(); sideBang(); highlight(); topShade();
      rect(g, 14, 10, 5, 10, 'H'); rect(g, 45, 10, 5, 10, 'H');
      ell(g, 32, 1, 5, 5, 'H');
      shadeEll(g, 30, 0, 3, 2, 'H', 'l');
      shade(g, 14, 15, 18, 19, 'H', 'h'); shade(g, 46, 15, 49, 19, 'H', 'h');
      break;
  }
}

function drawAccessories(g: Grid, accs: string[]) {
  for (const a of accs) {
    switch (a) {
      case 'glasses':
        rect(g, 18, 17, 10, 6, 'B'); rect(g, 19, 18, 8, 4, 'w');
        rect(g, 36, 17, 10, 6, 'B'); rect(g, 37, 18, 8, 4, 'w');
        rect(g, 28, 19, 8, 2, 'B');
        px(g, 17, 19, 'B'); px(g, 46, 19, 'B');
        break;
      case 'sunglasses':
        rect(g, 18, 17, 10, 6, 'B'); rect(g, 36, 17, 10, 6, 'B');
        rect(g, 28, 19, 8, 2, 'B');
        px(g, 17, 19, 'B'); px(g, 46, 19, 'B');
        rect(g, 19, 18, 3, 2, 'w'); rect(g, 37, 18, 3, 2, 'w');
        break;
      case 'hat':
        rect(g, 14, 0, 36, 5, 'R'); rect(g, 18, 0, 28, 3, 'r');
        rect(g, 10, 5, 44, 3, 'r');
        break;
      case 'bow':
        rect(g, 10, 5, 7, 4, 'P'); rect(g, 21, 5, 7, 4, 'P');
        rect(g, 17, 5, 4, 6, 'P');
        px(g, 12, 6, 'W'); px(g, 23, 6, 'W');
        break;
      case 'earrings':
        ell(g, 15, 26, 1, 2, 'Y'); ell(g, 49, 26, 1, 2, 'Y');
        break;
      case 'necklace':
        rect(g, 24, 37, 16, 1, 'Y'); rect(g, 28, 38, 8, 2, 'Y');
        break;
      case 'headband':
        rect(g, 14, 8, 36, 3, 'P');
        rect(g, 18, 8, 12, 2, 'W');
        break;
    }
  }
}

export function generateSprite(config: SpriteConfig): Grid {
  const g = grid();
  drawHairBack(g, config.hairStyle);
  drawBody(g, config.frame);
  drawOutfit(g, config.outfit);
  drawHairFront(g, config.hairStyle);
  drawFace(g, config.expression);
  drawAccessories(g, config.accessories);
  autoOutline(g);
  return g;
}

function dk(h: string, f = 0.75): string {
  const m = h.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return h;
  return '#' + [m[1], m[2], m[3]].map(s => Math.floor(parseInt(s, 16) * f).toString(16).padStart(2, '0')).join('');
}
function lt(h: string, f = 0.35): string {
  const m = h.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return h;
  return '#' + [m[1], m[2], m[3]].map(s => {
    const v = parseInt(s, 16);
    return Math.min(255, v + Math.floor((255 - v) * f)).toString(16).padStart(2, '0');
  }).join('');
}

export function buildColorMap(config: SpriteConfig): Record<string, string> {
  return {
    B: '#1a1a2e', S: config.skinColor, s: dk(config.skinColor, 0.85),
    '2': dk(config.skinColor, 0.70), '3': lt(config.skinColor, 0.25),
    W: '#ffffff', w: '#e8e8e8',
    E: '#5D4037', e: '#1a1a2e',
    H: config.hairColor, h: dk(config.hairColor, 0.65),
    '4': dk(config.hairColor, 0.45), l: lt(config.hairColor, 0.35),
    O: config.outfitColor, o: dk(config.outfitColor, 0.75),
    '5': dk(config.outfitColor, 0.55),
    P: '#FFB5C5', K: '#4A4A4A', k: '#6A6A6A',
    R: '#E8847A', r: '#D4736A', Y: '#FFD700',
  };
}
