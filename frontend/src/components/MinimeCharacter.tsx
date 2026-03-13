'use client';

import React from 'react';

interface MinimeCharacterProps {
  config?: {
    skinColor?: string;
    hairStyle?: string;
    hairColor?: string;
    expression?: string;
    outfit?: string;
    outfitColor?: string;
    accessories?: string[];
  };
  size?: number;
}

const SKIN_MAP: Record<string, string> = {
  fair: '#FDE8D0',
  light: '#F5D6B8',
  medium: '#DBA97B',
  tan: '#C08B5C',
  dark: '#8D5524',
  deep: '#5C3310',
};

function dk(hex: string, f = 0.78): string {
  const m = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return hex;
  return `rgb(${Math.floor(parseInt(m[1], 16) * f)},${Math.floor(parseInt(m[2], 16) * f)},${Math.floor(parseInt(m[3], 16) * f)})`;
}

function lt(hex: string, f = 0.35): string {
  const m = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return hex;
  const c = (s: string) => { const v = parseInt(s, 16); return Math.min(255, v + Math.floor((255 - v) * f)); };
  return `rgb(${c(m[1])},${c(m[2])},${c(m[3])})`;
}

export function MinimeCharacter({ config = {}, size = 120 }: MinimeCharacterProps) {
  const skin = SKIN_MAP[config.skinColor || 'fair'] || '#FDE8D0';
  const skinDk = dk(skin, 0.88);
  const hair = config.hairColor || '#2C1810';
  const hairDk = dk(hair, 0.65);
  const hairLt = lt(hair, 0.3);
  const oc = config.outfitColor || '#FF6B8A';
  const ocDk = dk(oc, 0.75);
  const expr = config.expression || 'happy';
  const hs = config.hairStyle || 'short';
  const outfit = config.outfit || 'tshirt';
  const acc = config.accessories || [];

  const order = ['necklace', 'earrings', 'glasses', 'sunglasses', 'headband', 'bow', 'hat'];
  const sorted = order.filter(a => acc.includes(a));

  return (
    <svg viewBox="0 0 200 280" width={size} height={size * 1.4}>
      {hairBack(hs, hair, hairDk)}
      {body(outfit, oc, ocDk, skin, skinDk)}
      <rect x={91} y={130} width={18} height={16} rx={4} fill={skin} />
      <circle cx={100} cy={82} r={55} fill={skin} stroke={skinDk} strokeWidth="1.2" />
      <ellipse cx={46} cy={88} rx={7} ry={9} fill={skin} stroke={skinDk} strokeWidth="1" />
      <ellipse cx={154} cy={88} rx={7} ry={9} fill={skin} stroke={skinDk} strokeWidth="1" />
      <ellipse cx={46} cy={89} rx={4} ry={5} fill={skinDk} opacity="0.3" />
      <ellipse cx={154} cy={89} rx={4} ry={5} fill={skinDk} opacity="0.3" />
      {face(expr)}
      <ellipse cx={58} cy={100} rx={13} ry={8} fill="#FFB5C5" opacity="0.55" />
      <ellipse cx={142} cy={100} rx={13} ry={8} fill="#FFB5C5" opacity="0.55" />
      {hairFront(hs, hair, hairLt)}
      {sorted.map(a => <React.Fragment key={a}>{accessory(a)}</React.Fragment>)}
    </svg>
  );
}

function bigEye(cx: number, cy: number, flip: boolean) {
  const d = flip ? -1 : 1;
  return (
    <>
      <ellipse cx={cx} cy={cy} rx={16} ry={18} fill="white" stroke="#C8B8A8" strokeWidth="0.8" />
      <ellipse cx={cx + d * 2} cy={cy + 2} rx={12} ry={14} fill="#3D2314" />
      <ellipse cx={cx + d * 2} cy={cy + 4} rx={8} ry={10} fill="#1A0D06" />
      <circle cx={cx + d * 7} cy={cy - 6} r={5.5} fill="white" />
      <circle cx={cx - d * 4} cy={cy + 6} r={3} fill="white" opacity="0.5" />
      <ellipse cx={cx + d * 1} cy={cy + 14} rx={5} ry={1.5} fill="white" opacity="0.15" />
      <path d={`M ${cx - 16} ${cy - 8} Q ${cx - 8} ${cy - 18} ${cx} ${cy - 16} Q ${cx + 8} ${cy - 18} ${cx + 16} ${cy - 8}`} stroke="#2C1810" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </>
  );
}

function face(type: string) {
  const brow = '#5D4037';
  const nose = <circle cx={100} cy={102} r={1.5} fill="#D4A076" opacity="0.6" />;

  switch (type) {
    case 'happy':
      return (
        <>
          <path d="M 63 62 Q 78 56 93 63" stroke={brow} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M 107 63 Q 122 56 137 62" stroke={brow} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M 62 82 Q 78 68 94 82" stroke="#2C1810" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M 106 82 Q 122 68 138 82" stroke="#2C1810" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <circle cx={62} cy={82} r={1.5} fill="#2C1810" />
          <circle cx={94} cy={82} r={1.5} fill="#2C1810" />
          <circle cx={106} cy={82} r={1.5} fill="#2C1810" />
          <circle cx={138} cy={82} r={1.5} fill="#2C1810" />
          {nose}
          <path d="M 86 110 Q 100 122 114 110" stroke="#E8847A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      );
    case 'neutral':
      return (
        <>
          <path d="M 63 64 Q 78 58 93 65" stroke={brow} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M 107 65 Q 122 58 137 64" stroke={brow} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          {bigEye(78, 82, false)}
          {bigEye(122, 82, true)}
          {nose}
          <line x1={92} y1={112} x2={108} y2={112} stroke="#D4836A" strokeWidth="2" strokeLinecap="round" />
        </>
      );
    case 'wink':
      return (
        <>
          <path d="M 63 63 Q 78 57 93 64" stroke={brow} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M 107 64 Q 122 57 137 63" stroke={brow} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          {bigEye(78, 82, false)}
          <path d="M 106 82 Q 122 70 138 82" stroke="#2C1810" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <circle cx={106} cy={82} r={1.5} fill="#2C1810" />
          <circle cx={138} cy={82} r={1.5} fill="#2C1810" />
          {nose}
          <path d="M 88 110 Q 100 119 112 110" stroke="#E8847A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      );
    case 'love':
      return (
        <>
          <path d="M 63 62 Q 78 56 93 63" stroke={brow} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M 107 63 Q 122 56 137 62" stroke={brow} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M 66 78 C 66 69 75 65 82 74 C 89 65 98 69 98 78 C 98 90 82 98 82 98 C 82 98 66 90 66 78 Z" fill="#FF6B8A" stroke="#E8556A" strokeWidth="1" />
          <circle cx={88} cy={73} r={3.5} fill="white" opacity="0.5" />
          <path d="M 102 78 C 102 69 111 65 118 74 C 125 65 134 69 134 78 C 134 90 118 98 118 98 C 118 98 102 90 102 78 Z" fill="#FF6B8A" stroke="#E8556A" strokeWidth="1" />
          <circle cx={124} cy={73} r={3.5} fill="white" opacity="0.5" />
          {nose}
          <path d="M 86 110 Q 100 122 114 110" stroke="#E8847A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      );
    case 'cool':
      return (
        <>
          <path d="M 65 66 L 93 64" stroke={brow} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 107 64 L 135 66" stroke={brow} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <ellipse cx={78} cy={82} rx={16} ry={10} fill="white" stroke="#C8B8A8" strokeWidth="0.8" />
          <ellipse cx={80} cy={84} rx={10} ry={7} fill="#3D2314" />
          <ellipse cx={80} cy={85} rx={6} ry={5} fill="#1A0D06" />
          <circle cx={85} cy={80} r={3.5} fill="white" />
          <path d="M 62 76 L 94 76" stroke="#2C1810" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx={122} cy={82} rx={16} ry={10} fill="white" stroke="#C8B8A8" strokeWidth="0.8" />
          <ellipse cx={120} cy={84} rx={10} ry={7} fill="#3D2314" />
          <ellipse cx={120} cy={85} rx={6} ry={5} fill="#1A0D06" />
          <circle cx={115} cy={80} r={3.5} fill="white" />
          <path d="M 106 76 L 138 76" stroke="#2C1810" strokeWidth="2.5" strokeLinecap="round" />
          {nose}
          <path d="M 90 112 Q 106 119 116 110" stroke="#D4836A" strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      );
    case 'surprised':
      return (
        <>
          <path d="M 65 58 Q 78 50 91 58" stroke={brow} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 109 58 Q 122 50 135 58" stroke={brow} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <ellipse cx={78} cy={82} rx={17} ry={20} fill="white" stroke="#C8B8A8" strokeWidth="0.8" />
          <ellipse cx={80} cy={84} rx={13} ry={16} fill="#3D2314" />
          <ellipse cx={80} cy={86} rx={9} ry={12} fill="#1A0D06" />
          <circle cx={87} cy={76} r={6} fill="white" />
          <circle cx={75} cy={92} r={3} fill="white" opacity="0.5" />
          <ellipse cx={122} cy={82} rx={17} ry={20} fill="white" stroke="#C8B8A8" strokeWidth="0.8" />
          <ellipse cx={120} cy={84} rx={13} ry={16} fill="#3D2314" />
          <ellipse cx={120} cy={86} rx={9} ry={12} fill="#1A0D06" />
          <circle cx={113} cy={76} r={6} fill="white" />
          <circle cx={125} cy={92} r={3} fill="white" opacity="0.5" />
          {nose}
          <ellipse cx={100} cy={114} rx={6} ry={8} fill="#2C1810" opacity="0.8" />
          <ellipse cx={100} cy={112} rx={4} ry={5} fill="#4A2020" />
        </>
      );
    case 'shy':
      return (
        <>
          <path d="M 65 66 Q 78 62 91 67" stroke={brow} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 109 67 Q 122 62 135 66" stroke={brow} strokeWidth="2" fill="none" strokeLinecap="round" />
          <ellipse cx={78} cy={84} rx={15} ry={14} fill="white" stroke="#C8B8A8" strokeWidth="0.8" />
          <ellipse cx={80} cy={88} rx={10} ry={10} fill="#3D2314" />
          <ellipse cx={80} cy={90} rx={7} ry={7} fill="#1A0D06" />
          <circle cx={85} cy={84} r={4} fill="white" />
          <path d="M 63 78 L 93 76" stroke="#2C1810" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx={122} cy={84} rx={15} ry={14} fill="white" stroke="#C8B8A8" strokeWidth="0.8" />
          <ellipse cx={120} cy={88} rx={10} ry={10} fill="#3D2314" />
          <ellipse cx={120} cy={90} rx={7} ry={7} fill="#1A0D06" />
          <circle cx={115} cy={84} r={4} fill="white" />
          <path d="M 107 76 L 137 78" stroke="#2C1810" strokeWidth="2" strokeLinecap="round" />
          {nose}
          <path d="M 94 112 Q 100 116 106 112" stroke="#D4836A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </>
      );
    case 'sleepy':
      return (
        <>
          <path d="M 66 67 Q 78 64 90 67" stroke={brow} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 110 67 Q 122 64 134 67" stroke={brow} strokeWidth="2" fill="none" strokeLinecap="round" />
          <ellipse cx={78} cy={84} rx={15} ry={10} fill="white" stroke="#C8B8A8" strokeWidth="0.8" />
          <ellipse cx={80} cy={86} rx={8} ry={6} fill="#3D2314" />
          <ellipse cx={80} cy={87} rx={5} ry={4} fill="#1A0D06" />
          <circle cx={84} cy={82} r={3} fill="white" />
          <path d="M 63 78 L 93 78" stroke="#2C1810" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx={122} cy={84} rx={15} ry={10} fill="white" stroke="#C8B8A8" strokeWidth="0.8" />
          <ellipse cx={120} cy={86} rx={8} ry={6} fill="#3D2314" />
          <ellipse cx={120} cy={87} rx={5} ry={4} fill="#1A0D06" />
          <circle cx={116} cy={82} r={3} fill="white" />
          <path d="M 107 78 L 137 78" stroke="#2C1810" strokeWidth="2.5" strokeLinecap="round" />
          {nose}
          <ellipse cx={100} cy={114} rx={5} ry={4} fill="#2C1810" opacity="0.6" />
          <text x={142} y={56} fontSize="16" fill="#9CA3AF" fontWeight="bold" opacity="0.7">z</text>
          <text x={154} y={44} fontSize="11" fill="#9CA3AF" fontWeight="bold" opacity="0.5">z</text>
        </>
      );
    default:
      return face('happy');
  }
}

function hairBack(style: string, c: string, d: string) {
  const outline = dk(c, 0.5);
  switch (style) {
    case 'short':
      return (
        <g>
          <ellipse cx={100} cy={60} rx={58} ry={42} fill={c} stroke={outline} strokeWidth="1.5" />
          <ellipse cx={100} cy={70} rx={56} ry={30} fill={d} opacity="0.3" />
        </g>
      );
    case 'bob':
      return (
        <g>
          <ellipse cx={100} cy={58} rx={60} ry={44} fill={c} stroke={outline} strokeWidth="1.5" />
          <rect x={40} y={65} width={24} height={60} rx={6} fill={c} stroke={outline} strokeWidth="1" />
          <rect x={136} y={65} width={24} height={60} rx={6} fill={c} stroke={outline} strokeWidth="1" />
          <rect x={42} y={90} width={20} height={30} rx={4} fill={d} opacity="0.25" />
          <rect x={138} y={90} width={20} height={30} rx={4} fill={d} opacity="0.25" />
        </g>
      );
    case 'medium':
      return (
        <g>
          <ellipse cx={100} cy={58} rx={60} ry={44} fill={c} stroke={outline} strokeWidth="1.5" />
          <rect x={38} y={65} width={26} height={85} rx={6} fill={c} stroke={outline} strokeWidth="1" />
          <rect x={136} y={65} width={26} height={85} rx={6} fill={c} stroke={outline} strokeWidth="1" />
          <rect x={40} y={100} width={22} height={45} rx={4} fill={d} opacity="0.25" />
          <rect x={138} y={100} width={22} height={45} rx={4} fill={d} opacity="0.25" />
        </g>
      );
    case 'long':
      return (
        <g>
          <ellipse cx={100} cy={58} rx={60} ry={44} fill={c} stroke={outline} strokeWidth="1.5" />
          <rect x={36} y={65} width={28} height={120} rx={8} fill={c} stroke={outline} strokeWidth="1" />
          <rect x={136} y={65} width={28} height={120} rx={8} fill={c} stroke={outline} strokeWidth="1" />
          <rect x={38} y={110} width={24} height={70} rx={6} fill={d} opacity="0.2" />
          <rect x={138} y={110} width={24} height={70} rx={6} fill={d} opacity="0.2" />
        </g>
      );
    case 'ponytail':
      return (
        <g>
          <ellipse cx={100} cy={60} rx={58} ry={42} fill={c} stroke={outline} strokeWidth="1.5" />
          <ellipse cx={100} cy={130} rx={12} ry={10} fill={c} stroke={outline} strokeWidth="1" />
          <rect x={88} y={130} width={24} height={65} rx={6} fill={c} stroke={outline} strokeWidth="1" />
          <rect x={92} y={150} width={16} height={40} rx={4} fill={d} opacity="0.2" />
        </g>
      );
    case 'curly':
      return (
        <g>
          <ellipse cx={100} cy={55} rx={64} ry={48} fill={c} stroke={outline} strokeWidth="1.5" />
          <circle cx={40} cy={78} r={18} fill={c} stroke={outline} strokeWidth="1" />
          <circle cx={160} cy={78} r={18} fill={c} stroke={outline} strokeWidth="1" />
          <circle cx={46} cy={108} r={14} fill={c} stroke={outline} strokeWidth="1" />
          <circle cx={154} cy={108} r={14} fill={c} stroke={outline} strokeWidth="1" />
          <circle cx={40} cy={82} r={8} fill={d} opacity="0.2" />
          <circle cx={160} cy={82} r={8} fill={d} opacity="0.2" />
        </g>
      );
    case 'twintail':
      return (
        <g>
          <ellipse cx={100} cy={60} rx={58} ry={42} fill={c} stroke={outline} strokeWidth="1.5" />
          <circle cx={38} cy={105} r={14} fill={c} stroke={outline} strokeWidth="1" />
          <rect x={28} y={105} width={20} height={65} rx={6} fill={c} stroke={outline} strokeWidth="1" />
          <circle cx={162} cy={105} r={14} fill={c} stroke={outline} strokeWidth="1" />
          <rect x={152} y={105} width={20} height={65} rx={6} fill={c} stroke={outline} strokeWidth="1" />
          <rect x={30} y={130} width={16} height={35} rx={4} fill={d} opacity="0.2" />
          <rect x={154} y={130} width={16} height={35} rx={4} fill={d} opacity="0.2" />
        </g>
      );
    case 'bun':
      return (
        <g>
          <ellipse cx={100} cy={60} rx={58} ry={42} fill={c} stroke={outline} strokeWidth="1.5" />
          <circle cx={100} cy={22} r={20} fill={c} stroke={outline} strokeWidth="1.5" />
          <circle cx={106} cy={16} r={6} fill={lt(c, 0.25)} opacity="0.5" />
        </g>
      );
    default:
      return hairBack('short', c, d);
  }
}

function hairFront(style: string, c: string, hi: string) {
  const fullBangs = (
    <g>
      <path d="M 50 56 Q 55 32 80 28 Q 100 26 120 28 Q 145 32 150 56 Q 135 44 100 42 Q 65 44 50 56 Z" fill={c} stroke={dk(c, 0.5)} strokeWidth="1" />
      <path d="M 65 48 Q 80 36 100 34 Q 115 35 125 40" stroke={hi} strokeWidth="3" fill="none" opacity="0.35" strokeLinecap="round" />
    </g>
  );
  const sideBangs = (
    <g>
      <path d="M 48 60 Q 50 32 74 28 Q 86 26 92 36 L 82 60 Q 70 50 48 60 Z" fill={c} stroke={dk(c, 0.5)} strokeWidth="1" />
      <path d="M 58 48 Q 68 34 80 32" stroke={hi} strokeWidth="2.5" fill="none" opacity="0.35" strokeLinecap="round" />
    </g>
  );

  switch (style) {
    case 'short':
      return sideBangs;
    case 'bob':
    case 'medium':
    case 'long':
    case 'twintail':
      return fullBangs;
    case 'ponytail':
    case 'bun':
      return sideBangs;
    case 'curly':
      return (
        <g>
          {fullBangs}
          <circle cx={44} cy={56} r={9} fill={c} stroke={dk(c, 0.5)} strokeWidth="1" />
          <circle cx={58} cy={44} r={6} fill={c} stroke={dk(c, 0.5)} strokeWidth="1" />
        </g>
      );
    default:
      return fullBangs;
  }
}

function body(outfit: string, c: string, cd: string, skin: string, sd: string) {
  const shoe = '#4A4A4A';
  const shoeDk = '#333333';
  const legs = (
    <>
      <rect x={78} y={216} width={18} height={36} rx={4} fill={skin} stroke={sd} strokeWidth="1" />
      <rect x={104} y={216} width={18} height={36} rx={4} fill={skin} stroke={sd} strokeWidth="1" />
      <rect x={74} y={248} width={24} height={14} rx={4} fill={shoe} stroke={shoeDk} strokeWidth="1" />
      <rect x={102} y={248} width={24} height={14} rx={4} fill={shoe} stroke={shoeDk} strokeWidth="1" />
      <rect x={76} y={249} width={8} height={4} rx={2} fill="white" opacity="0.3" />
      <rect x={116} y={249} width={8} height={4} rx={2} fill="white" opacity="0.3" />
    </>
  );
  const hands = (
    <>
      <rect x={42} y={172} width={14} height={16} rx={4} fill={skin} stroke={sd} strokeWidth="1" />
      <rect x={144} y={172} width={14} height={16} rx={4} fill={skin} stroke={sd} strokeWidth="1" />
    </>
  );

  switch (outfit) {
    case 'tshirt':
      return (
        <g>
          {legs}
          <rect x={66} y={144} width={68} height={74} rx={5} fill={c} stroke={cd} strokeWidth="1.5" />
          <rect x={66} y={180} width={68} height={38} rx={3} fill={cd} opacity="0.15" />
          <rect x={42} y={146} width={28} height={28} rx={4} fill={c} stroke={cd} strokeWidth="1" />
          <rect x={130} y={146} width={28} height={28} rx={4} fill={c} stroke={cd} strokeWidth="1" />
          <path d="M 82 144 Q 100 154 118 144" stroke="white" strokeWidth="2" fill="none" opacity="0.5" />
          {hands}
        </g>
      );
    case 'hoodie':
      return (
        <g>
          {legs}
          <rect x={63} y={144} width={74} height={76} rx={6} fill={c} stroke={cd} strokeWidth="1.5" />
          <rect x={63} y={185} width={74} height={35} rx={4} fill={cd} opacity="0.15" />
          <rect x={40} y={148} width={30} height={32} rx={5} fill={c} stroke={cd} strokeWidth="1" />
          <rect x={130} y={148} width={30} height={32} rx={5} fill={c} stroke={cd} strokeWidth="1" />
          <path d="M 74 144 Q 74 130 88 128 L 112 128 Q 126 130 126 144" fill={c} stroke={cd} strokeWidth="1" />
          <path d="M 78 144 Q 100 156 122 144" stroke="white" strokeWidth="1.5" fill="none" opacity="0.3" />
          <rect x={82} y={196} width={36} height={15} rx={3} fill="none" stroke="white" strokeWidth="1.5" opacity="0.3" />
          <line x1={100} y1={156} x2={100} y2={210} stroke={cd} strokeWidth="1.5" opacity="0.3" />
          {hands}
        </g>
      );
    case 'dress':
      return (
        <g>
          {legs}
          <rect x={70} y={144} width={60} height={38} rx={5} fill={c} stroke={cd} strokeWidth="1.5" />
          <path d="M 58 178 L 70 162 L 130 162 L 142 178 L 146 220 Q 146 226 138 226 L 62 226 Q 54 226 54 220 Z" fill={c} stroke={cd} strokeWidth="1.5" />
          <path d="M 58 200 L 146 200" stroke={cd} strokeWidth="1" opacity="0.15" />
          <rect x={44} y={146} width={30} height={26} rx={4} fill={c} stroke={cd} strokeWidth="1" />
          <rect x={126} y={146} width={30} height={26} rx={4} fill={c} stroke={cd} strokeWidth="1" />
          <path d="M 84 144 Q 100 152 116 144" stroke="white" strokeWidth="1.5" fill="none" opacity="0.4" />
          {hands}
        </g>
      );
    case 'suit':
      return (
        <g>
          {legs}
          <rect x={66} y={144} width={68} height={74} rx={5} fill={c} stroke={cd} strokeWidth="1.5" />
          <rect x={42} y={146} width={28} height={28} rx={4} fill={c} stroke={cd} strokeWidth="1" />
          <rect x={130} y={146} width={28} height={28} rx={4} fill={c} stroke={cd} strokeWidth="1" />
          <path d="M 86 144 L 100 172 L 96 144" fill="white" opacity="0.85" />
          <path d="M 114 144 L 100 172 L 104 144" fill="white" opacity="0.85" />
          <rect x={97} y={148} width={6} height={28} rx={2} fill="#E74C3C" />
          <circle cx={100} cy={148} r={3} fill="#E74C3C" stroke="#C0392B" strokeWidth="0.8" />
          {hands}
        </g>
      );
    case 'sweater':
      return (
        <g>
          {legs}
          <rect x={63} y={144} width={74} height={76} rx={6} fill={c} stroke={cd} strokeWidth="1.5" />
          <rect x={63} y={190} width={74} height={30} rx={4} fill={cd} opacity="0.12" />
          <rect x={38} y={148} width={32} height={34} rx={5} fill={c} stroke={cd} strokeWidth="1" />
          <rect x={130} y={148} width={32} height={34} rx={5} fill={c} stroke={cd} strokeWidth="1" />
          <path d="M 82 144 Q 100 154 118 144" stroke="white" strokeWidth="2.5" fill="none" opacity="0.3" />
          <line x1={63} y1={165} x2={137} y2={165} stroke={cd} strokeWidth="1" opacity="0.12" strokeDasharray="4 3" />
          <line x1={63} y1={178} x2={137} y2={178} stroke={cd} strokeWidth="1" opacity="0.12" strokeDasharray="4 3" />
          {hands}
        </g>
      );
    case 'overall':
      return (
        <g>
          {legs}
          <rect x={70} y={144} width={60} height={74} rx={5} fill="white" stroke="#D0D0D0" strokeWidth="1" />
          <rect x={44} y={146} width={30} height={26} rx={4} fill="white" stroke="#D0D0D0" strokeWidth="1" />
          <rect x={126} y={146} width={30} height={26} rx={4} fill="white" stroke="#D0D0D0" strokeWidth="1" />
          <rect x={66} y={172} width={68} height={46} rx={4} fill={c} stroke={cd} strokeWidth="1.5" />
          <rect x={78} y={144} width={12} height={32} rx={3} fill={c} stroke={cd} strokeWidth="1" />
          <rect x={110} y={144} width={12} height={32} rx={3} fill={c} stroke={cd} strokeWidth="1" />
          <rect x={86} y={185} width={28} height={16} rx={3} fill="none" stroke="white" strokeWidth="1.5" opacity="0.35" />
          <circle cx={84} cy={178} r={3} fill="white" opacity="0.6" />
          <circle cx={116} cy={178} r={3} fill="white" opacity="0.6" />
          {hands}
        </g>
      );
    default:
      return body('tshirt', c, cd, skin, sd);
  }
}

function accessory(type: string) {
  switch (type) {
    case 'glasses':
      return (
        <>
          <circle cx={78} cy={82} r={18} fill="rgba(200,220,255,0.12)" stroke="#8B7355" strokeWidth="2.5" />
          <circle cx={122} cy={82} r={18} fill="rgba(200,220,255,0.12)" stroke="#8B7355" strokeWidth="2.5" />
          <line x1={96} y1={82} x2={104} y2={82} stroke="#8B7355" strokeWidth="2.5" />
          <line x1={60} y1={82} x2={50} y2={78} stroke="#8B7355" strokeWidth="2" />
          <line x1={140} y1={82} x2={150} y2={78} stroke="#8B7355" strokeWidth="2" />
        </>
      );
    case 'sunglasses':
      return (
        <>
          <rect x={60} y={72} width={32} height={22} rx={4} fill="#222" opacity="0.88" stroke="#111" strokeWidth="1.5" />
          <rect x={108} y={72} width={32} height={22} rx={4} fill="#222" opacity="0.88" stroke="#111" strokeWidth="1.5" />
          <line x1={92} y1={83} x2={108} y2={83} stroke="#222" strokeWidth="3" />
          <line x1={60} y1={83} x2={48} y2={78} stroke="#222" strokeWidth="2.5" />
          <line x1={140} y1={83} x2={152} y2={78} stroke="#222" strokeWidth="2.5" />
          <rect x={64} y={74} width={10} height={4} rx={2} fill="white" opacity="0.15" />
          <rect x={112} y={74} width={10} height={4} rx={2} fill="white" opacity="0.15" />
        </>
      );
    case 'hat':
      return (
        <>
          <path d="M 50 40 Q 50 6 100 2 Q 150 6 150 40" fill="#E74C3C" stroke="#C0392B" strokeWidth="1.5" />
          <ellipse cx={100} cy={40} rx={58} ry={10} fill="#E74C3C" stroke="#C0392B" strokeWidth="1" />
          <rect x={56} y={36} width={88} height={7} rx={2} fill="#C0392B" />
          <circle cx={100} cy={10} r={5} fill="#C0392B" />
        </>
      );
    case 'bow':
      return (
        <>
          <circle cx={65} cy={38} r={5} fill="#FF69B4" stroke="#E0559A" strokeWidth="1" />
          <ellipse cx={53} cy={38} rx={12} ry={7} fill="#FF69B4" stroke="#E0559A" strokeWidth="1" />
          <ellipse cx={77} cy={38} rx={12} ry={7} fill="#FF69B4" stroke="#E0559A" strokeWidth="1" />
          <circle cx={58} cy={35} r={2.5} fill="white" opacity="0.3" />
          <circle cx={72} cy={35} r={2.5} fill="white" opacity="0.3" />
        </>
      );
    case 'earrings':
      return (
        <>
          <circle cx={44} cy={102} r={5} fill="#FFD700" stroke="#DAA520" strokeWidth="1" />
          <circle cx={156} cy={102} r={5} fill="#FFD700" stroke="#DAA520" strokeWidth="1" />
          <circle cx={43} cy={100} r={1.5} fill="white" opacity="0.4" />
          <circle cx={155} cy={100} r={1.5} fill="white" opacity="0.4" />
        </>
      );
    case 'necklace':
      return (
        <path d="M 80 134 Q 100 148 120 134" stroke="#FFD700" strokeWidth="2.5" fill="none" />
      );
    case 'headband':
      return (
        <g>
          <path d="M 48 62 Q 100 48 152 62" stroke="#FF69B4" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M 52 62 Q 100 50 148 62" stroke="#FFB5D8" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" />
        </g>
      );
    default:
      return null;
  }
}
