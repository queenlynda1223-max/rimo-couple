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

const S = 32;

function grid(): Grid {
  return Array.from({ length: S }, () => Array(S).fill(null));
}

function px(g: Grid, x: number, y: number, c: string) {
  if (x >= 0 && x < S && y >= 0 && y < S) g[y][x] = c;
}

function rect(g: Grid, x: number, y: number, w: number, h: number, c: string) {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) px(g, x + i, y + j, c);
}

function ell(g: Grid, cx: number, cy: number, rx: number, ry: number, c: string) {
  for (let j = -ry; j <= ry; j++)
    for (let i = -rx; i <= rx; i++)
      if ((i * i) / (rx * rx) + (j * j) / (ry * ry) <= 1) px(g, cx + i, cy + j, c);
}

function autoOutline(g: Grid) {
  const snap = g.map((r) => [...r]);
  const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  for (let y = 0; y < S; y++)
    for (let x = 0; x < S; x++)
      if (!snap[y][x] && dirs.some(([dx, dy]) => {
        const nx = x + dx, ny = y + dy;
        return nx >= 0 && nx < S && ny >= 0 && ny < S && snap[ny][nx] != null;
      }))
        g[y][x] = 'B';
}

function drawBody(g: Grid, f: number) {
  ell(g, 15, 8, 6, 6, 'S');
  rect(g, 8, 7, 2, 3, 'S');
  rect(g, 22, 7, 2, 3, 'S');
  px(g, 8, 9, 's');
  px(g, 23, 9, 's');
  rect(g, 13, 14, 6, 2, 'S');
  rect(g, 13, 14, 6, 1, 's');
  rect(g, 7, 21, 3, 3, 'S');
  rect(g, 22, 21, 3, 3, 'S');
  px(g, 7, 23, 's');
  px(g, 24, 23, 's');
  rect(g, 12, 24, 3, 5, 'S');
  rect(g, 17, 24, 3, 5, 'S');
  rect(g, 12, 24, 3, 1, 's');
  rect(g, 17, 24, 3, 1, 's');
  const lsy = f === 1 ? 28 : 29;
  const rsy = f === 3 ? 28 : 29;
  rect(g, 11, lsy, 4, 2, 'K');
  rect(g, 17, rsy, 4, 2, 'K');
  rect(g, 12, lsy, 2, 1, 'k');
  rect(g, 18, rsy, 2, 1, 'k');
}

function drawOutfit(g: Grid, outfit: string) {
  switch (outfit) {
    case 'tshirt':
      rect(g, 10, 16, 12, 8, 'O');
      rect(g, 7, 16, 4, 5, 'O');
      rect(g, 21, 16, 4, 5, 'O');
      rect(g, 13, 15, 6, 1, 'O');
      rect(g, 14, 15, 4, 1, 'W');
      rect(g, 10, 21, 12, 2, 'o');
      break;
    case 'hoodie':
      rect(g, 9, 16, 14, 8, 'O');
      rect(g, 7, 16, 3, 6, 'O');
      rect(g, 22, 16, 3, 6, 'O');
      rect(g, 12, 14, 8, 2, 'O');
      rect(g, 13, 15, 6, 1, 'o');
      rect(g, 12, 21, 8, 2, 'o');
      px(g, 15, 17, 'W');
      px(g, 16, 17, 'W');
      px(g, 15, 18, 'W');
      px(g, 16, 18, 'W');
      break;
    case 'dress':
      rect(g, 10, 16, 12, 6, 'O');
      rect(g, 7, 16, 4, 4, 'O');
      rect(g, 21, 16, 4, 4, 'O');
      rect(g, 9, 22, 14, 5, 'O');
      rect(g, 13, 15, 6, 1, 'O');
      rect(g, 14, 15, 4, 1, 'W');
      rect(g, 9, 25, 14, 2, 'o');
      break;
    case 'suit':
      rect(g, 10, 16, 12, 8, 'O');
      rect(g, 7, 16, 4, 5, 'O');
      rect(g, 21, 16, 4, 5, 'O');
      rect(g, 14, 16, 4, 7, 'W');
      rect(g, 15, 17, 2, 5, 'R');
      rect(g, 14, 16, 4, 1, 'W');
      rect(g, 10, 22, 12, 1, 'o');
      break;
    case 'sweater':
      rect(g, 9, 16, 14, 8, 'O');
      rect(g, 7, 16, 3, 6, 'O');
      rect(g, 22, 16, 3, 6, 'O');
      rect(g, 13, 15, 6, 1, 'O');
      rect(g, 9, 20, 14, 1, 'o');
      rect(g, 9, 22, 14, 1, 'o');
      break;
    case 'overall':
      rect(g, 10, 16, 12, 3, 'W');
      rect(g, 7, 16, 4, 3, 'W');
      rect(g, 21, 16, 4, 3, 'W');
      rect(g, 10, 19, 12, 5, 'O');
      rect(g, 12, 16, 3, 4, 'O');
      rect(g, 17, 16, 3, 4, 'O');
      px(g, 13, 19, 'W');
      px(g, 18, 19, 'W');
      rect(g, 10, 22, 12, 1, 'o');
      break;
  }
}

function drawFace(g: Grid, expr: string) {
  rect(g, 9, 10, 2, 1, 'P');
  rect(g, 21, 10, 2, 1, 'P');

  const openEye = (ex: number) => {
    rect(g, ex, 7, 4, 3, 'W');
    rect(g, ex + 1, 8, 2, 2, 'E');
    px(g, ex + 1, 9, 'e');
    px(g, ex + 3, 7, 'W');
  };
  const closedEye = (ex: number) => {
    rect(g, ex, 8, 4, 1, 'B');
    px(g, ex - 1, 7, 'B');
    px(g, ex + 4, 7, 'B');
  };
  const brow = () => {
    rect(g, 11, 6, 4, 1, 'B');
    rect(g, 17, 6, 4, 1, 'B');
  };
  const nose = () => px(g, 15, 10, 's');

  switch (expr) {
    case 'neutral':
      brow(); openEye(11); openEye(17); nose();
      rect(g, 14, 12, 4, 1, 'R');
      break;
    case 'happy':
      brow(); closedEye(11); closedEye(17); nose();
      px(g, 13, 12, 'R');
      rect(g, 14, 13, 4, 1, 'R');
      px(g, 18, 12, 'R');
      break;
    case 'wink':
      brow(); openEye(11); closedEye(17); nose();
      px(g, 13, 12, 'R');
      rect(g, 14, 13, 4, 1, 'R');
      px(g, 18, 12, 'R');
      break;
    case 'love':
      brow();
      px(g, 11, 7, 'R'); px(g, 14, 7, 'R');
      rect(g, 10, 8, 6, 1, 'R'); rect(g, 11, 9, 4, 1, 'R'); rect(g, 12, 10, 2, 1, 'R');
      px(g, 17, 7, 'R'); px(g, 20, 7, 'R');
      rect(g, 16, 8, 6, 1, 'R'); rect(g, 17, 9, 4, 1, 'R'); rect(g, 18, 10, 2, 1, 'R');
      nose();
      px(g, 13, 12, 'R'); rect(g, 14, 13, 4, 1, 'R'); px(g, 18, 12, 'R');
      break;
    case 'cool':
      rect(g, 11, 5, 4, 1, 'B'); rect(g, 17, 5, 4, 1, 'B');
      openEye(11); openEye(17); nose();
      rect(g, 14, 12, 5, 1, 'R');
      px(g, 19, 11, 'R');
      break;
    case 'surprised':
      rect(g, 11, 5, 4, 1, 'B'); rect(g, 17, 5, 4, 1, 'B');
      rect(g, 11, 7, 4, 4, 'W'); rect(g, 12, 8, 2, 3, 'E'); px(g, 13, 10, 'e'); px(g, 14, 7, 'W');
      rect(g, 17, 7, 4, 4, 'W'); rect(g, 18, 8, 2, 3, 'E'); px(g, 19, 10, 'e'); px(g, 20, 7, 'W');
      nose();
      ell(g, 15, 13, 1, 1, 'B');
      break;
    case 'shy':
      brow(); openEye(11); openEye(17);
      rect(g, 9, 10, 3, 1, 'P'); rect(g, 20, 10, 3, 1, 'P');
      nose();
      rect(g, 14, 12, 3, 1, 'R');
      break;
    case 'sleepy':
      rect(g, 11, 6, 4, 1, 'B'); rect(g, 17, 6, 4, 1, 'B');
      rect(g, 11, 8, 4, 2, 'W'); rect(g, 11, 8, 4, 1, 'B'); rect(g, 12, 9, 2, 1, 'E');
      rect(g, 17, 8, 4, 2, 'W'); rect(g, 17, 8, 4, 1, 'B'); rect(g, 18, 9, 2, 1, 'E');
      nose();
      ell(g, 15, 12, 1, 1, 'B');
      px(g, 25, 3, 'w'); px(g, 26, 2, 'w'); px(g, 27, 3, 'w');
      break;
  }
}

function drawHair(g: Grid, style: string) {
  switch (style) {
    case 'short':
      ell(g, 15, 5, 7, 4, 'H');
      rect(g, 8, 5, 3, 4, 'H');
      rect(g, 21, 5, 3, 4, 'H');
      rect(g, 11, 2, 10, 3, 'H');
      rect(g, 13, 3, 4, 1, 'l');
      rect(g, 9, 6, 14, 1, 'h');
      break;
    case 'bob':
      ell(g, 15, 5, 7, 4, 'H');
      rect(g, 7, 5, 3, 10, 'H');
      rect(g, 22, 5, 3, 10, 'H');
      rect(g, 10, 2, 12, 3, 'H');
      rect(g, 13, 3, 4, 1, 'l');
      rect(g, 7, 11, 3, 3, 'h');
      rect(g, 22, 11, 3, 3, 'h');
      break;
    case 'medium':
      ell(g, 15, 5, 7, 4, 'H');
      rect(g, 7, 5, 3, 14, 'H');
      rect(g, 22, 5, 3, 14, 'H');
      rect(g, 10, 2, 12, 3, 'H');
      rect(g, 13, 3, 4, 1, 'l');
      rect(g, 7, 13, 3, 5, 'h');
      rect(g, 22, 13, 3, 5, 'h');
      break;
    case 'long':
      ell(g, 15, 5, 7, 4, 'H');
      rect(g, 6, 5, 3, 20, 'H');
      rect(g, 23, 5, 3, 20, 'H');
      rect(g, 10, 2, 12, 3, 'H');
      rect(g, 13, 3, 4, 1, 'l');
      rect(g, 6, 17, 3, 7, 'h');
      rect(g, 23, 17, 3, 7, 'h');
      break;
    case 'ponytail':
      ell(g, 15, 5, 7, 4, 'H');
      rect(g, 8, 5, 3, 4, 'H');
      rect(g, 21, 5, 3, 4, 'H');
      rect(g, 11, 2, 10, 3, 'H');
      rect(g, 14, 14, 4, 12, 'H');
      rect(g, 15, 16, 2, 9, 'h');
      rect(g, 13, 3, 3, 1, 'l');
      break;
    case 'curly':
      ell(g, 15, 5, 8, 5, 'H');
      rect(g, 6, 5, 3, 4, 'H');
      rect(g, 23, 5, 3, 4, 'H');
      rect(g, 7, 9, 3, 3, 'H');
      rect(g, 22, 9, 3, 3, 'H');
      rect(g, 8, 12, 3, 3, 'H');
      rect(g, 21, 12, 3, 3, 'H');
      rect(g, 10, 1, 12, 3, 'H');
      rect(g, 13, 2, 4, 1, 'l');
      break;
    case 'twintail':
      ell(g, 15, 5, 7, 4, 'H');
      rect(g, 10, 2, 12, 3, 'H');
      rect(g, 5, 10, 3, 14, 'H');
      rect(g, 24, 10, 3, 14, 'H');
      rect(g, 6, 8, 3, 3, 'H');
      rect(g, 23, 8, 3, 3, 'H');
      rect(g, 5, 18, 3, 5, 'h');
      rect(g, 24, 18, 3, 5, 'h');
      rect(g, 13, 3, 3, 1, 'l');
      break;
    case 'bun':
      ell(g, 15, 5, 7, 4, 'H');
      rect(g, 8, 5, 3, 4, 'H');
      rect(g, 21, 5, 3, 4, 'H');
      rect(g, 11, 2, 10, 3, 'H');
      ell(g, 15, 0, 3, 3, 'H');
      rect(g, 14, 0, 2, 1, 'l');
      rect(g, 13, 3, 3, 1, 'l');
      break;
  }
}

function drawAccessories(g: Grid, accs: string[]) {
  for (const acc of accs) {
    switch (acc) {
      case 'glasses':
        rect(g, 10, 7, 5, 3, 'B');
        rect(g, 11, 8, 3, 1, 'w');
        rect(g, 17, 7, 5, 3, 'B');
        rect(g, 18, 8, 3, 1, 'w');
        rect(g, 15, 8, 2, 1, 'B');
        px(g, 9, 8, 'B');
        px(g, 22, 8, 'B');
        break;
      case 'sunglasses':
        rect(g, 10, 7, 5, 3, 'B');
        rect(g, 17, 7, 5, 3, 'B');
        rect(g, 15, 8, 2, 1, 'B');
        px(g, 9, 8, 'B');
        px(g, 22, 8, 'B');
        break;
      case 'hat':
        rect(g, 8, 0, 16, 3, 'R');
        rect(g, 10, 0, 12, 2, 'r');
        rect(g, 7, 3, 18, 2, 'r');
        break;
      case 'bow':
        rect(g, 7, 3, 4, 2, 'P');
        rect(g, 13, 3, 4, 2, 'P');
        rect(g, 11, 3, 2, 3, 'P');
        px(g, 8, 3, 'W');
        break;
      case 'earrings':
        rect(g, 8, 11, 1, 2, 'Y');
        rect(g, 23, 11, 1, 2, 'Y');
        break;
      case 'necklace':
        rect(g, 12, 15, 8, 1, 'Y');
        rect(g, 14, 16, 4, 1, 'Y');
        break;
      case 'headband':
        rect(g, 8, 5, 16, 2, 'P');
        rect(g, 10, 5, 6, 1, 'W');
        break;
    }
  }
}

export function generateSprite(config: SpriteConfig): Grid {
  const g = grid();
  drawBody(g, config.frame);
  drawOutfit(g, config.outfit);
  drawHair(g, config.hairStyle);
  drawFace(g, config.expression);
  drawAccessories(g, config.accessories);
  autoOutline(g);
  return g;
}

function dk(h: string, f = 0.75): string {
  const m = h.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return h;
  return '#' + [m[1], m[2], m[3]].map((s) =>
    Math.floor(parseInt(s, 16) * f).toString(16).padStart(2, '0'),
  ).join('');
}

function lt(h: string, f = 0.35): string {
  const m = h.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return h;
  return '#' + [m[1], m[2], m[3]].map((s) => {
    const v = parseInt(s, 16);
    return Math.min(255, v + Math.floor((255 - v) * f)).toString(16).padStart(2, '0');
  }).join('');
}

export function buildColorMap(config: SpriteConfig): Record<string, string> {
  return {
    B: '#1a1a2e',
    S: config.skinColor,
    s: dk(config.skinColor, 0.82),
    W: '#ffffff',
    w: '#e0e0e0',
    E: '#5D4037',
    e: '#1a1a2e',
    H: config.hairColor,
    h: dk(config.hairColor, 0.65),
    l: lt(config.hairColor, 0.35),
    O: config.outfitColor,
    o: dk(config.outfitColor, 0.7),
    P: '#FFB5C5',
    K: '#4A4A4A',
    k: '#6A6A6A',
    R: '#E8847A',
    r: '#D4736A',
    Y: '#FFD700',
  };
}
