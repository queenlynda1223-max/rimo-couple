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

const SKIN: Record<string, string> = {
  fair: '#FDE8D0', light: '#F5D6B8', medium: '#DBA97B',
  tan: '#C08B5C', dark: '#8D5524', deep: '#5C3310',
};

function dk(h: string, f = 0.75): string {
  const m = h.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return h;
  return '#' + [m[1], m[2], m[3]].map(s => Math.floor(parseInt(s, 16) * f).toString(16).padStart(2, '0')).join('');
}
function lt(h: string, f = 0.35): string {
  const m = h.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return h;
  return '#' + [m[1], m[2], m[3]].map(s => { const v = parseInt(s, 16); return Math.min(255, v + Math.floor((255 - v) * f)).toString(16).padStart(2, '0'); }).join('');
}

export function MinimeCharacter({ config = {}, size = 120 }: MinimeCharacterProps) {
  const skin = SKIN[config.skinColor || 'fair'] || '#FDE8D0';
  const skinDk = dk(skin, 0.85);
  const hair = config.hairColor || '#2C1810';
  const hairDk = dk(hair, 0.6);
  const hairLt = lt(hair, 0.35);
  const oc = config.outfitColor || '#FF6B8A';
  const ocDk = dk(oc, 0.7);
  const expr = config.expression || 'happy';
  const hs = config.hairStyle || 'short';
  const outfit = config.outfit || 'tshirt';
  const acc = config.accessories || [];
  const order = ['necklace', 'earrings', 'glasses', 'sunglasses', 'headband', 'bow', 'hat'];
  const sorted = order.filter(a => acc.includes(a));
  const ol = '#2A1A0A';

  return (
    <svg
      viewBox="0 0 48 68"
      width={size}
      height={size * (68 / 48)}
      shapeRendering="crispEdges"
      style={{ imageRendering: 'pixelated' }}
    >
      {hBack(hs, hair, hairDk, hairLt)}
      {bodyR(outfit, oc, ocDk, skin, skinDk, ol)}
      <rect x={21} y={26} width={6} height={3} fill={skin} />
      <circle cx={24} cy={15} r={11} fill={skin} />
      <rect x={24 - 11} y={15} width={22} height={11} fill={skin} />
      <circle cx={24} cy={15} r={11} fill={skin} stroke={ol} strokeWidth={0.6} />
      <rect x={12} y={17} width={3} height={4} fill={skin} />
      <rect x={33} y={17} width={3} height={4} fill={skin} />
      <rect x={12} y={18} width={2} height={2} fill={skinDk} />
      <rect x={34} y={18} width={2} height={2} fill={skinDk} />
      {faceR(expr, ol)}
      <rect x={14} y={20} width={3} height={2} fill="#FFB5C5" opacity={0.55} />
      <rect x={31} y={20} width={3} height={2} fill="#FFB5C5" opacity={0.55} />
      {hFront(hs, hair, hairDk, hairLt, ol)}
      {sorted.map(a => <React.Fragment key={a}>{accR(a, ol)}</React.Fragment>)}
    </svg>
  );
}

function faceR(t: string, ol: string) {
  const eye = (x: number) => (
    <>
      <ellipse cx={x} cy={16} rx={4} ry={5} fill="white" stroke={ol} strokeWidth={0.4} />
      <ellipse cx={x} cy={17} rx={3} ry={4} fill="#3D2314" />
      <ellipse cx={x} cy={18} rx={2} ry={2.5} fill="#0D0805" />
      <rect x={x + 1} y={13} width={2} height={2} fill="white" />
      <rect x={x - 2} y={18} width={1} height={1} fill="white" opacity={0.6} />
    </>
  );
  const closedEye = (x: number) => (
    <>
      <rect x={x - 4} y={16} width={8} height={1} fill={ol} />
      <rect x={x - 3} y={15} width={1} height={1} fill={ol} />
      <rect x={x + 3} y={15} width={1} height={1} fill={ol} />
    </>
  );
  const nose = <rect x={23} y={22} width={2} height={1} fill={dk('#D4A076', 0.9)} opacity={0.5} />;

  switch (t) {
    case 'happy':
      return (
        <>
          <rect x={16} y={11} width={6} height={1} fill={ol} opacity={0.6} />
          <rect x={27} y={11} width={6} height={1} fill={ol} opacity={0.6} />
          {closedEye(19)}
          {closedEye(29)}
          {nose}
          <rect x={20} y={24} width={8} height={1} fill="#E8847A" />
          <rect x={21} y={25} width={6} height={1} fill="#E8847A" />
        </>
      );
    case 'neutral':
      return (
        <>
          <rect x={16} y={11} width={6} height={1} fill={ol} opacity={0.6} />
          <rect x={27} y={11} width={6} height={1} fill={ol} opacity={0.6} />
          {eye(19)}
          {eye(29)}
          {nose}
          <rect x={21} y={24} width={6} height={1} fill="#D4836A" />
        </>
      );
    case 'wink':
      return (
        <>
          <rect x={16} y={11} width={6} height={1} fill={ol} opacity={0.6} />
          <rect x={27} y={11} width={6} height={1} fill={ol} opacity={0.6} />
          {eye(19)}
          {closedEye(29)}
          {nose}
          <rect x={20} y={24} width={8} height={1} fill="#E8847A" />
          <rect x={22} y={25} width={4} height={1} fill="#E8847A" />
        </>
      );
    case 'love':
      return (
        <>
          <rect x={16} y={11} width={6} height={1} fill={ol} opacity={0.6} />
          <rect x={27} y={11} width={6} height={1} fill={ol} opacity={0.6} />
          {heartEye(17)}
          {heartEye(27)}
          {nose}
          <rect x={20} y={24} width={8} height={1} fill="#E8847A" />
          <rect x={21} y={25} width={6} height={1} fill="#E8847A" />
        </>
      );
    case 'cool':
      return (
        <>
          <rect x={16} y={12} width={7} height={1} fill={ol} />
          <rect x={26} y={12} width={7} height={1} fill={ol} />
          <ellipse cx={19} cy={16} rx={4} ry={3} fill="white" stroke={ol} strokeWidth={0.4} />
          <ellipse cx={19} cy={17} rx={3} ry={2} fill="#3D2314" />
          <rect x={15} y={15} width={8} height={1} fill={ol} />
          <ellipse cx={29} cy={16} rx={4} ry={3} fill="white" stroke={ol} strokeWidth={0.4} />
          <ellipse cx={29} cy={17} rx={3} ry={2} fill="#3D2314" />
          <rect x={25} y={15} width={8} height={1} fill={ol} />
          {nose}
          <rect x={21} y={24} width={7} height={1} fill="#D4836A" />
          <rect x={26} y={25} width={2} height={1} fill="#D4836A" />
        </>
      );
    case 'surprised':
      return (
        <>
          <rect x={17} y={10} width={4} height={1} fill={ol} opacity={0.7} />
          <rect x={28} y={10} width={4} height={1} fill={ol} opacity={0.7} />
          <ellipse cx={19} cy={16} rx={4} ry={6} fill="white" stroke={ol} strokeWidth={0.4} />
          <ellipse cx={19} cy={17} rx={3} ry={5} fill="#3D2314" />
          <ellipse cx={19} cy={18} rx={2} ry={3} fill="#0D0805" />
          <rect x={20} y={12} width={2} height={2} fill="white" />
          <ellipse cx={29} cy={16} rx={4} ry={6} fill="white" stroke={ol} strokeWidth={0.4} />
          <ellipse cx={29} cy={17} rx={3} ry={5} fill="#3D2314" />
          <ellipse cx={29} cy={18} rx={2} ry={3} fill="#0D0805" />
          <rect x={30} y={12} width={2} height={2} fill="white" />
          {nose}
          <ellipse cx={24} cy={25} rx={2} ry={2} fill={ol} opacity={0.7} />
        </>
      );
    case 'shy':
      return (
        <>
          <rect x={16} y={12} width={6} height={1} fill={ol} opacity={0.5} />
          <rect x={27} y={12} width={6} height={1} fill={ol} opacity={0.5} />
          <ellipse cx={19} cy={17} rx={4} ry={4} fill="white" stroke={ol} strokeWidth={0.4} />
          <ellipse cx={19} cy={19} rx={3} ry={3} fill="#3D2314" />
          <ellipse cx={19} cy={20} rx={2} ry={2} fill="#0D0805" />
          <rect x={15} y={15} width={8} height={1} fill={ol} opacity={0.5} />
          <ellipse cx={29} cy={17} rx={4} ry={4} fill="white" stroke={ol} strokeWidth={0.4} />
          <ellipse cx={29} cy={19} rx={3} ry={3} fill="#3D2314" />
          <ellipse cx={29} cy={20} rx={2} ry={2} fill="#0D0805" />
          <rect x={25} y={15} width={8} height={1} fill={ol} opacity={0.5} />
          {nose}
          <rect x={22} y={24} width={4} height={1} fill="#D4836A" />
        </>
      );
    case 'sleepy':
      return (
        <>
          <rect x={16} y={12} width={6} height={1} fill={ol} opacity={0.4} />
          <rect x={27} y={12} width={6} height={1} fill={ol} opacity={0.4} />
          <ellipse cx={19} cy={17} rx={4} ry={3} fill="white" stroke={ol} strokeWidth={0.4} />
          <ellipse cx={19} cy={18} rx={2} ry={2} fill="#3D2314" />
          <rect x={15} y={16} width={8} height={1} fill={ol} />
          <ellipse cx={29} cy={17} rx={4} ry={3} fill="white" stroke={ol} strokeWidth={0.4} />
          <ellipse cx={29} cy={18} rx={2} ry={2} fill="#3D2314" />
          <rect x={25} y={16} width={8} height={1} fill={ol} />
          {nose}
          <ellipse cx={24} cy={25} rx={2} ry={1.5} fill={ol} opacity={0.5} />
          <rect x={37} y={6} width={3} height={2} fill="#9CA3AF" opacity={0.6} />
          <rect x={40} y={3} width={2} height={2} fill="#9CA3AF" opacity={0.4} />
        </>
      );
    default:
      return faceR('happy', ol);
  }
}

function heartEye(x: number) {
  return (
    <>
      <rect x={x} y={14} width={2} height={1} fill="#FF6B8A" />
      <rect x={x + 3} y={14} width={2} height={1} fill="#FF6B8A" />
      <rect x={x - 1} y={15} width={8} height={1} fill="#FF6B8A" />
      <rect x={x - 1} y={16} width={8} height={1} fill="#FF6B8A" />
      <rect x={x} y={17} width={6} height={1} fill="#FF6B8A" />
      <rect x={x + 1} y={18} width={4} height={1} fill="#FF6B8A" />
      <rect x={x + 2} y={19} width={2} height={1} fill="#FF6B8A" />
      <rect x={x + 1} y={14} width={1} height={1} fill="white" opacity={0.4} />
    </>
  );
}

function hBack(s: string, c: string, d: string, l: string) {
  const ol = dk(c, 0.4);
  switch (s) {
    case 'short':
      return (
        <g>
          <circle cx={24} cy={12} r={13} fill={c} stroke={ol} strokeWidth={0.6} />
          <rect x={12} y={12} width={24} height={8} fill={c} />
          <rect x={14} y={8} width={4} height={3} fill={l} opacity={0.3} />
        </g>
      );
    case 'bob':
      return (
        <g>
          <circle cx={24} cy={12} r={14} fill={c} stroke={ol} strokeWidth={0.6} />
          <rect x={10} y={12} width={5} height={16} fill={c} stroke={ol} strokeWidth={0.5} />
          <rect x={33} y={12} width={5} height={16} fill={c} stroke={ol} strokeWidth={0.5} />
          <rect x={10} y={20} width={4} height={6} fill={d} opacity={0.3} />
          <rect x={34} y={20} width={4} height={6} fill={d} opacity={0.3} />
          <rect x={14} y={6} width={6} height={2} fill={l} opacity={0.25} />
        </g>
      );
    case 'medium':
      return (
        <g>
          <circle cx={24} cy={12} r={14} fill={c} stroke={ol} strokeWidth={0.6} />
          <rect x={9} y={12} width={5} height={22} fill={c} stroke={ol} strokeWidth={0.5} />
          <rect x={34} y={12} width={5} height={22} fill={c} stroke={ol} strokeWidth={0.5} />
          <rect x={9} y={24} width={4} height={8} fill={d} opacity={0.3} />
          <rect x={35} y={24} width={4} height={8} fill={d} opacity={0.3} />
          <rect x={14} y={5} width={8} height={2} fill={l} opacity={0.25} />
        </g>
      );
    case 'long':
      return (
        <g>
          <circle cx={24} cy={12} r={14} fill={c} stroke={ol} strokeWidth={0.6} />
          <rect x={8} y={12} width={6} height={34} fill={c} stroke={ol} strokeWidth={0.5} />
          <rect x={34} y={12} width={6} height={34} fill={c} stroke={ol} strokeWidth={0.5} />
          <rect x={8} y={30} width={5} height={14} fill={d} opacity={0.25} />
          <rect x={35} y={30} width={5} height={14} fill={d} opacity={0.25} />
          <rect x={14} y={4} width={8} height={2} fill={l} opacity={0.3} />
        </g>
      );
    case 'ponytail':
      return (
        <g>
          <circle cx={24} cy={12} r={13} fill={c} stroke={ol} strokeWidth={0.6} />
          <rect x={12} y={12} width={24} height={8} fill={c} />
          <rect x={22} y={24} width={4} height={18} fill={c} stroke={ol} strokeWidth={0.5} />
          <rect x={20} y={22} width={8} height={4} fill={c} />
          <rect x={23} y={32} width={2} height={8} fill={d} opacity={0.3} />
          <rect x={14} y={6} width={5} height={2} fill={l} opacity={0.25} />
        </g>
      );
    case 'curly':
      return (
        <g>
          <circle cx={24} cy={11} r={15} fill={c} stroke={ol} strokeWidth={0.6} />
          <rect x={7} y={14} width={5} height={5} fill={c} stroke={ol} strokeWidth={0.4} />
          <rect x={36} y={14} width={5} height={5} fill={c} stroke={ol} strokeWidth={0.4} />
          <rect x={9} y={20} width={4} height={4} fill={c} stroke={ol} strokeWidth={0.4} />
          <rect x={35} y={20} width={4} height={4} fill={c} stroke={ol} strokeWidth={0.4} />
          <rect x={11} y={25} width={3} height={3} fill={c} stroke={ol} strokeWidth={0.4} />
          <rect x={34} y={25} width={3} height={3} fill={c} stroke={ol} strokeWidth={0.4} />
          <rect x={15} y={4} width={4} height={2} fill={l} opacity={0.3} />
        </g>
      );
    case 'twintail':
      return (
        <g>
          <circle cx={24} cy={12} r={13} fill={c} stroke={ol} strokeWidth={0.6} />
          <rect x={12} y={12} width={24} height={6} fill={c} />
          <rect x={6} y={20} width={5} height={4} fill={c} stroke={ol} strokeWidth={0.5} />
          <rect x={7} y={24} width={4} height={18} fill={c} stroke={ol} strokeWidth={0.5} />
          <rect x={37} y={20} width={5} height={4} fill={c} stroke={ol} strokeWidth={0.5} />
          <rect x={37} y={24} width={4} height={18} fill={c} stroke={ol} strokeWidth={0.5} />
          <rect x={8} y={32} width={2} height={8} fill={d} opacity={0.25} />
          <rect x={38} y={32} width={2} height={8} fill={d} opacity={0.25} />
          <rect x={15} y={5} width={6} height={2} fill={l} opacity={0.25} />
        </g>
      );
    case 'bun':
      return (
        <g>
          <circle cx={24} cy={12} r={13} fill={c} stroke={ol} strokeWidth={0.6} />
          <rect x={12} y={12} width={24} height={6} fill={c} />
          <rect x={20} y={-2} width={8} height={8} rx={0} fill={c} stroke={ol} strokeWidth={0.6} />
          <rect x={22} y={-1} width={3} height={2} fill={l} opacity={0.35} />
        </g>
      );
    default:
      return hBack('short', c, d, l);
  }
}

function hFront(s: string, c: string, d: string, l: string, ol: string) {
  const bangs = (
    <g>
      <rect x={13} y={5} width={22} height={5} fill={c} stroke={dk(c, 0.4)} strokeWidth={0.5} />
      <rect x={14} y={10} width={20} height={2} fill={c} />
      <rect x={16} y={6} width={6} height={2} fill={l} opacity={0.3} />
    </g>
  );
  const sideBang = (
    <g>
      <rect x={12} y={5} width={10} height={6} fill={c} stroke={dk(c, 0.4)} strokeWidth={0.5} />
      <rect x={13} y={11} width={6} height={2} fill={c} />
      <rect x={14} y={6} width={4} height={2} fill={l} opacity={0.3} />
    </g>
  );

  switch (s) {
    case 'short':
    case 'ponytail':
    case 'bun':
      return sideBang;
    case 'bob':
    case 'medium':
    case 'long':
    case 'twintail':
      return bangs;
    case 'curly':
      return (
        <g>
          {bangs}
          <rect x={9} y={9} width={3} height={3} fill={c} stroke={dk(c, 0.4)} strokeWidth={0.4} />
        </g>
      );
    default:
      return bangs;
  }
}

function bodyR(outfit: string, c: string, cd: string, skin: string, sd: string, ol: string) {
  const shoe = '#4A4A4A';
  const legs = (
    <>
      <rect x={16} y={46} width={6} height={12} fill={skin} stroke={ol} strokeWidth={0.5} />
      <rect x={26} y={46} width={6} height={12} fill={skin} stroke={ol} strokeWidth={0.5} />
      <rect x={14} y={57} width={8} height={4} fill={shoe} stroke={ol} strokeWidth={0.5} />
      <rect x={26} y={57} width={8} height={4} fill={shoe} stroke={ol} strokeWidth={0.5} />
      <rect x={15} y={58} width={3} height={1} fill="white" opacity={0.2} />
      <rect x={30} y={58} width={3} height={1} fill="white" opacity={0.2} />
    </>
  );
  const hands = (
    <>
      <rect x={7} y={40} width={5} height={5} fill={skin} stroke={ol} strokeWidth={0.4} />
      <rect x={36} y={40} width={5} height={5} fill={skin} stroke={ol} strokeWidth={0.4} />
    </>
  );

  switch (outfit) {
    case 'tshirt':
      return (
        <g>
          {legs}
          <rect x={14} y={29} width={20} height={18} fill={c} stroke={ol} strokeWidth={0.6} />
          <rect x={14} y={40} width={20} height={7} fill={cd} opacity={0.15} />
          <rect x={7} y={30} width={7} height={12} fill={c} stroke={ol} strokeWidth={0.5} />
          <rect x={34} y={30} width={7} height={12} fill={c} stroke={ol} strokeWidth={0.5} />
          <rect x={18} y={29} width={12} height={2} fill="white" opacity={0.3} />
          {hands}
        </g>
      );
    case 'hoodie':
      return (
        <g>
          {legs}
          <rect x={13} y={29} width={22} height={18} fill={c} stroke={ol} strokeWidth={0.6} />
          <rect x={13} y={40} width={22} height={7} fill={cd} opacity={0.15} />
          <rect x={6} y={30} width={8} height={14} fill={c} stroke={ol} strokeWidth={0.5} />
          <rect x={34} y={30} width={8} height={14} fill={c} stroke={ol} strokeWidth={0.5} />
          <rect x={18} y={26} width={12} height={4} fill={c} stroke={ol} strokeWidth={0.4} />
          <rect x={20} y={29} width={8} height={2} fill="white" opacity={0.2} />
          <rect x={24} y={32} width={1} height={12} fill={cd} opacity={0.2} />
          <rect x={19} y={42} width={10} height={3} fill="none" stroke="white" strokeWidth={0.5} opacity={0.25} />
          {hands}
        </g>
      );
    case 'dress':
      return (
        <g>
          {legs}
          <rect x={14} y={29} width={20} height={12} fill={c} stroke={ol} strokeWidth={0.6} />
          <rect x={11} y={40} width={26} height={10} fill={c} stroke={ol} strokeWidth={0.5} />
          <rect x={12} y={38} width={24} height={3} fill={c} />
          <rect x={11} y={46} width={26} height={4} fill={cd} opacity={0.15} />
          <rect x={7} y={30} width={7} height={11} fill={c} stroke={ol} strokeWidth={0.5} />
          <rect x={34} y={30} width={7} height={11} fill={c} stroke={ol} strokeWidth={0.5} />
          <rect x={18} y={29} width={12} height={2} fill="white" opacity={0.3} />
          {hands}
        </g>
      );
    case 'suit':
      return (
        <g>
          {legs}
          <rect x={14} y={29} width={20} height={18} fill={c} stroke={ol} strokeWidth={0.6} />
          <rect x={7} y={30} width={7} height={12} fill={c} stroke={ol} strokeWidth={0.5} />
          <rect x={34} y={30} width={7} height={12} fill={c} stroke={ol} strokeWidth={0.5} />
          <rect x={20} y={29} width={4} height={10} fill="white" opacity={0.7} />
          <rect x={24} y={29} width={4} height={10} fill="white" opacity={0.7} />
          <rect x={23} y={31} width={2} height={8} fill="#E74C3C" />
          <rect x={22} y={30} width={4} height={2} fill="#E74C3C" />
          {hands}
        </g>
      );
    case 'sweater':
      return (
        <g>
          {legs}
          <rect x={13} y={29} width={22} height={18} fill={c} stroke={ol} strokeWidth={0.6} />
          <rect x={13} y={42} width={22} height={5} fill={cd} opacity={0.12} />
          <rect x={6} y={30} width={8} height={14} fill={c} stroke={ol} strokeWidth={0.5} />
          <rect x={34} y={30} width={8} height={14} fill={c} stroke={ol} strokeWidth={0.5} />
          <rect x={18} y={29} width={12} height={2} fill="white" opacity={0.25} />
          <rect x={13} y={36} width={22} height={1} fill={cd} opacity={0.12} />
          <rect x={13} y={39} width={22} height={1} fill={cd} opacity={0.12} />
          {hands}
        </g>
      );
    case 'overall':
      return (
        <g>
          {legs}
          <rect x={14} y={29} width={20} height={18} fill="white" stroke="#D0D0D0" strokeWidth={0.5} />
          <rect x={8} y={30} width={6} height={11} fill="white" stroke="#D0D0D0" strokeWidth={0.4} />
          <rect x={34} y={30} width={6} height={11} fill="white" stroke="#D0D0D0" strokeWidth={0.4} />
          <rect x={14} y={38} width={20} height={9} fill={c} stroke={ol} strokeWidth={0.5} />
          <rect x={17} y={29} width={4} height={10} fill={c} stroke={ol} strokeWidth={0.4} />
          <rect x={27} y={29} width={4} height={10} fill={c} stroke={ol} strokeWidth={0.4} />
          <rect x={20} y={41} width={8} height={3} fill="none" stroke="white" strokeWidth={0.5} opacity={0.3} />
          <rect x={18} y={38} width={2} height={2} fill="white" opacity={0.5} />
          <rect x={28} y={38} width={2} height={2} fill="white" opacity={0.5} />
          {hands}
        </g>
      );
    default:
      return bodyR('tshirt', c, cd, skin, sd, ol);
  }
}

function accR(t: string, ol: string) {
  switch (t) {
    case 'glasses':
      return (
        <>
          <rect x={14} y={14} width={9} height={7} fill="none" stroke="#8B7355" strokeWidth={0.8} />
          <rect x={25} y={14} width={9} height={7} fill="none" stroke="#8B7355" strokeWidth={0.8} />
          <rect x={23} y={17} width={2} height={1} fill="#8B7355" />
          <rect x={12} y={17} width={2} height={1} fill="#8B7355" />
          <rect x={34} y={17} width={2} height={1} fill="#8B7355" />
        </>
      );
    case 'sunglasses':
      return (
        <>
          <rect x={14} y={14} width={9} height={7} fill="#222" opacity={0.85} stroke={ol} strokeWidth={0.5} />
          <rect x={25} y={14} width={9} height={7} fill="#222" opacity={0.85} stroke={ol} strokeWidth={0.5} />
          <rect x={23} y={17} width={2} height={1} fill="#222" />
          <rect x={12} y={17} width={2} height={1} fill="#222" />
          <rect x={34} y={17} width={2} height={1} fill="#222" />
          <rect x={15} y={15} width={3} height={1} fill="white" opacity={0.15} />
          <rect x={26} y={15} width={3} height={1} fill="white" opacity={0.15} />
        </>
      );
    case 'hat':
      return (
        <>
          <rect x={10} y={2} width={28} height={6} fill="#E74C3C" stroke="#C0392B" strokeWidth={0.5} />
          <rect x={14} y={0} width={20} height={3} fill="#E74C3C" stroke="#C0392B" strokeWidth={0.5} />
          <rect x={8} y={7} width={32} height={2} fill="#C0392B" />
          <rect x={22} y={-1} width={4} height={2} fill="#C0392B" />
        </>
      );
    case 'bow':
      return (
        <>
          <rect x={10} y={5} width={5} height={3} fill="#FF69B4" stroke="#E0559A" strokeWidth={0.4} />
          <rect x={17} y={5} width={5} height={3} fill="#FF69B4" stroke="#E0559A" strokeWidth={0.4} />
          <rect x={15} y={5} width={2} height={4} fill="#FF69B4" stroke="#E0559A" strokeWidth={0.4} />
          <rect x={11} y={5} width={2} height={1} fill="white" opacity={0.3} />
        </>
      );
    case 'earrings':
      return (
        <>
          <rect x={11} y={22} width={2} height={2} fill="#FFD700" stroke="#DAA520" strokeWidth={0.3} />
          <rect x={35} y={22} width={2} height={2} fill="#FFD700" stroke="#DAA520" strokeWidth={0.3} />
        </>
      );
    case 'necklace':
      return (
        <>
          <rect x={19} y={27} width={10} height={1} fill="#FFD700" />
          <rect x={22} y={28} width={4} height={2} fill="#FFD700" />
        </>
      );
    case 'headband':
      return (
        <>
          <rect x={12} y={8} width={24} height={2} fill="#FF69B4" stroke="#E0559A" strokeWidth={0.3} />
          <rect x={14} y={8} width={8} height={1} fill="#FFB5D8" opacity={0.4} />
        </>
      );
    default:
      return null;
  }
}
