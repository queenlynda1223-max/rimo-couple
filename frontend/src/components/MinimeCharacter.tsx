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

export function MinimeCharacter({ config = {}, size = 120 }: MinimeCharacterProps) {
  const skin = SKIN_MAP[config.skinColor || 'fair'] || '#FDE8D0';
  const hairColor = config.hairColor || '#2C1810';
  const outfitColor = config.outfitColor || '#FF6B8A';
  const expression = config.expression || 'happy';
  const hairStyle = config.hairStyle || 'short';
  const outfit = config.outfit || 'tshirt';
  const accessories = config.accessories || [];

  const accessoryOrder = ['necklace', 'earrings', 'glasses', 'sunglasses', 'headband', 'bow', 'hat'];
  const sorted = accessoryOrder.filter(a => accessories.includes(a));

  return (
    <svg viewBox="0 0 200 260" width={size} height={size * 1.3}>
      {renderHairBack(hairStyle, hairColor)}
      {renderBody(outfit, outfitColor, skin)}
      <rect x="92" y="127" width="16" height="15" rx="6" fill={skin} />
      <circle cx="100" cy="82" r="48" fill={skin} />
      <ellipse cx="53" cy="86" rx="6" ry="8" fill={skin} />
      <ellipse cx="147" cy="86" rx="6" ry="8" fill={skin} />
      {renderExpression(expression)}
      <circle cx="68" cy="95" r="7" fill="#FFB5B5" opacity="0.35" />
      <circle cx="132" cy="95" r="7" fill="#FFB5B5" opacity="0.35" />
      {renderHairFront(hairStyle, hairColor)}
      {sorted.map((acc) => (
        <React.Fragment key={acc}>{renderAccessory(acc)}</React.Fragment>
      ))}
    </svg>
  );
}

function renderExpression(type: string) {
  const c = '#2C1810';
  switch (type) {
    case 'happy':
      return (
        <>
          <path d="M 76 78 Q 82 71 88 78" stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 112 78 Q 118 71 124 78" stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 88 100 Q 100 110 112 100" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      );
    case 'neutral':
      return (
        <>
          <circle cx="82" cy="78" r="3" fill={c} />
          <circle cx="118" cy="78" r="3" fill={c} />
          <circle cx="83.5" cy="77" r="1" fill="white" />
          <circle cx="119.5" cy="77" r="1" fill="white" />
          <line x1="93" y1="100" x2="107" y2="100" stroke={c} strokeWidth="2" strokeLinecap="round" />
        </>
      );
    case 'wink':
      return (
        <>
          <circle cx="82" cy="78" r="3" fill={c} />
          <circle cx="83.5" cy="77" r="1" fill="white" />
          <path d="M 112 78 Q 118 71 124 78" stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 90 100 Q 100 108 110 100" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      );
    case 'love':
      return (
        <>
          <path d="M 76 75 C 76 70 80 68 83 72 C 86 68 90 70 90 75 C 90 80 83 84 83 84 C 83 84 76 80 76 75 Z" fill="#FF6B8A" />
          <path d="M 110 75 C 110 70 114 68 117 72 C 120 68 124 70 124 75 C 124 80 117 84 117 84 C 117 84 110 80 110 75 Z" fill="#FF6B8A" />
          <path d="M 88 100 Q 100 112 112 100" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      );
    case 'cool':
      return (
        <>
          <path d="M 76 80 L 88 78" stroke={c} strokeWidth="3" strokeLinecap="round" />
          <circle cx="84" cy="78" r="1.5" fill={c} />
          <path d="M 112 78 L 124 80" stroke={c} strokeWidth="3" strokeLinecap="round" />
          <circle cx="120" cy="78" r="1.5" fill={c} />
          <path d="M 90 100 Q 104 108 114 100" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      );
    case 'surprised':
      return (
        <>
          <circle cx="82" cy="76" r="5" fill="white" stroke={c} strokeWidth="2" />
          <circle cx="82" cy="76" r="2.5" fill={c} />
          <circle cx="118" cy="76" r="5" fill="white" stroke={c} strokeWidth="2" />
          <circle cx="118" cy="76" r="2.5" fill={c} />
          <ellipse cx="100" cy="102" rx="5" ry="6" fill={c} opacity="0.8" />
        </>
      );
    case 'shy':
      return (
        <>
          <path d="M 77 80 Q 82 75 87 80" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 113 80 Q 118 75 123 80" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 95 102 Q 100 105 105 102" stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </>
      );
    case 'sleepy':
      return (
        <>
          <path d="M 76 80 L 88 80" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 112 80 L 124 80" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="100" cy="102" rx="5" ry="4" fill={c} opacity="0.6" />
          <text x="138" y="58" fontSize="14" fill="#9CA3AF" fontWeight="bold" opacity="0.7">z</text>
          <text x="148" y="48" fontSize="10" fill="#9CA3AF" fontWeight="bold" opacity="0.5">z</text>
        </>
      );
    default:
      return renderExpression('happy');
  }
}

function renderHairBack(style: string, color: string) {
  switch (style) {
    case 'short':
      return <ellipse cx={100} cy={62} rx={52} ry={38} fill={color} />;
    case 'bob':
      return (
        <g>
          <ellipse cx={100} cy={60} rx={54} ry={40} fill={color} />
          <rect x={46} y={65} width={20} height={55} rx={10} fill={color} />
          <rect x={134} y={65} width={20} height={55} rx={10} fill={color} />
        </g>
      );
    case 'medium':
      return (
        <g>
          <ellipse cx={100} cy={60} rx={54} ry={40} fill={color} />
          <rect x={44} y={65} width={22} height={80} rx={10} fill={color} />
          <rect x={134} y={65} width={22} height={80} rx={10} fill={color} />
        </g>
      );
    case 'long':
      return (
        <g>
          <ellipse cx={100} cy={60} rx={54} ry={40} fill={color} />
          <rect x={42} y={65} width={24} height={115} rx={12} fill={color} />
          <rect x={134} y={65} width={24} height={115} rx={12} fill={color} />
        </g>
      );
    case 'ponytail':
      return (
        <g>
          <ellipse cx={100} cy={62} rx={52} ry={38} fill={color} />
          <ellipse cx={100} cy={128} rx={10} ry={8} fill={color} />
          <rect x={92} y={128} width={16} height={55} rx={8} fill={color} />
        </g>
      );
    case 'curly':
      return (
        <g>
          <ellipse cx={100} cy={58} rx={58} ry={44} fill={color} />
          <circle cx={46} cy={80} r={16} fill={color} />
          <circle cx={154} cy={80} r={16} fill={color} />
          <circle cx={52} cy={105} r={12} fill={color} />
          <circle cx={148} cy={105} r={12} fill={color} />
        </g>
      );
    case 'twintail':
      return (
        <g>
          <ellipse cx={100} cy={62} rx={52} ry={38} fill={color} />
          <circle cx={42} cy={105} r={12} fill={color} />
          <rect x={34} y={105} width={16} height={60} rx={8} fill={color} />
          <circle cx={158} cy={105} r={12} fill={color} />
          <rect x={150} y={105} width={16} height={60} rx={8} fill={color} />
        </g>
      );
    case 'bun':
      return (
        <g>
          <ellipse cx={100} cy={62} rx={52} ry={38} fill={color} />
          <circle cx={100} cy={26} r={18} fill={color} />
        </g>
      );
    default:
      return <ellipse cx={100} cy={62} rx={52} ry={38} fill={color} />;
  }
}

function renderHairFront(style: string, color: string) {
  const fullBangs = (
    <path d="M 56 55 Q 60 38 80 35 Q 100 33 120 35 Q 140 38 144 55 Q 130 48 100 46 Q 70 48 56 55 Z" fill={color} />
  );
  const sideBangs = (
    <path d="M 54 58 Q 56 38 76 34 Q 86 33 90 40 L 82 58 Q 72 52 54 58 Z" fill={color} />
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
          <circle cx={50} cy={56} r={7} fill={color} />
          <circle cx={62} cy={46} r={5} fill={color} />
        </g>
      );
    default:
      return fullBangs;
  }
}

function renderBody(outfit: string, color: string, skin: string) {
  const shoes = '#4A4A4A';
  const legs = (
    <>
      <rect x="78" y="212" width="18" height="35" rx="9" fill={skin} />
      <rect x="104" y="212" width="18" height="35" rx="9" fill={skin} />
      <ellipse cx="87" cy="250" rx="13" ry="7" fill={shoes} />
      <ellipse cx="113" cy="250" rx="13" ry="7" fill={shoes} />
    </>
  );
  const hands = (
    <>
      <circle cx="50" cy="180" r="7" fill={skin} />
      <circle cx="150" cy="180" r="7" fill={skin} />
    </>
  );

  switch (outfit) {
    case 'tshirt':
      return (
        <g>
          {legs}
          <rect x="68" y="140" width="64" height="76" rx="12" fill={color} />
          <ellipse cx="58" cy="158" rx="14" ry="10" fill={color} />
          <ellipse cx="142" cy="158" rx="14" ry="10" fill={color} />
          {hands}
        </g>
      );
    case 'hoodie':
      return (
        <g>
          {legs}
          <rect x="65" y="140" width="70" height="78" rx="14" fill={color} />
          <ellipse cx="55" cy="160" rx="16" ry="12" fill={color} />
          <ellipse cx="145" cy="160" rx="16" ry="12" fill={color} />
          <path d="M 72 140 Q 72 128 85 126 L 115 126 Q 128 128 128 140" fill={color} />
          <rect x="82" y="192" width="36" height="14" rx="4" fill="none" stroke="white" strokeWidth="1.5" opacity="0.35" />
          {hands}
        </g>
      );
    case 'dress':
      return (
        <g>
          {legs}
          <rect x="72" y="140" width="56" height="40" rx="10" fill={color} />
          <path d="M 62 175 L 72 160 L 128 160 L 138 175 L 140 215 Q 140 222 130 222 L 70 222 Q 60 222 60 215 Z" fill={color} />
          <ellipse cx="58" cy="158" rx="14" ry="10" fill={color} />
          <ellipse cx="142" cy="158" rx="14" ry="10" fill={color} />
          {hands}
        </g>
      );
    case 'suit':
      return (
        <g>
          {legs}
          <rect x="68" y="140" width="64" height="76" rx="10" fill={color} />
          <ellipse cx="58" cy="158" rx="14" ry="10" fill={color} />
          <ellipse cx="142" cy="158" rx="14" ry="10" fill={color} />
          <path d="M 88 140 L 100 168 L 94 140" fill="white" opacity="0.85" />
          <path d="M 112 140 L 100 168 L 106 140" fill="white" opacity="0.85" />
          <rect x="97" y="145" width="6" height="25" rx="2" fill="#E74C3C" />
          {hands}
        </g>
      );
    case 'sweater':
      return (
        <g>
          {legs}
          <rect x="65" y="140" width="70" height="78" rx="14" fill={color} />
          <ellipse cx="55" cy="162" rx="16" ry="14" fill={color} />
          <ellipse cx="145" cy="162" rx="16" ry="14" fill={color} />
          <path d="M 85 140 Q 100 150 115 140" stroke="white" strokeWidth="2" fill="none" opacity="0.4" />
          {hands}
        </g>
      );
    case 'overall':
      return (
        <g>
          {legs}
          <rect x="72" y="140" width="56" height="76" rx="10" fill="white" />
          <ellipse cx="60" cy="155" rx="12" ry="10" fill="white" />
          <ellipse cx="140" cy="155" rx="12" ry="10" fill="white" />
          <rect x="70" y="168" width="60" height="48" rx="8" fill={color} />
          <rect x="78" y="140" width="10" height="32" rx="3" fill={color} />
          <rect x="112" y="140" width="10" height="32" rx="3" fill={color} />
          <rect x="88" y="180" width="24" height="14" rx="3" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4" />
          {hands}
        </g>
      );
    default:
      return renderBody('tshirt', color, skin);
  }
}

function renderAccessory(type: string) {
  switch (type) {
    case 'glasses':
      return (
        <>
          <circle cx="82" cy="78" r="11" fill="rgba(200,220,255,0.15)" stroke="#8B7355" strokeWidth="2" />
          <circle cx="118" cy="78" r="11" fill="rgba(200,220,255,0.15)" stroke="#8B7355" strokeWidth="2" />
          <line x1="93" y1="78" x2="107" y2="78" stroke="#8B7355" strokeWidth="2" />
          <line x1="71" y1="78" x2="58" y2="74" stroke="#8B7355" strokeWidth="2" />
          <line x1="129" y1="78" x2="142" y2="74" stroke="#8B7355" strokeWidth="2" />
        </>
      );
    case 'sunglasses':
      return (
        <>
          <rect x="70" y="70" width="24" height="18" rx="4" fill="#333" opacity="0.85" />
          <rect x="106" y="70" width="24" height="18" rx="4" fill="#333" opacity="0.85" />
          <line x1="94" y1="79" x2="106" y2="79" stroke="#333" strokeWidth="2.5" />
          <line x1="70" y1="79" x2="56" y2="75" stroke="#333" strokeWidth="2.5" />
          <line x1="130" y1="79" x2="144" y2="75" stroke="#333" strokeWidth="2.5" />
        </>
      );
    case 'hat':
      return (
        <>
          <path d="M 55 42 Q 55 12 100 8 Q 145 12 145 42" fill="#E74C3C" />
          <ellipse cx="100" cy="42" rx="55" ry="8" fill="#E74C3C" />
          <rect x="60" y="38" width="80" height="6" rx="2" fill="#C0392B" />
        </>
      );
    case 'bow':
      return (
        <>
          <circle cx="68" cy="42" r="4" fill="#FF69B4" />
          <ellipse cx="57" cy="42" rx="10" ry="6" fill="#FF69B4" />
          <ellipse cx="79" cy="42" rx="10" ry="6" fill="#FF69B4" />
        </>
      );
    case 'earrings':
      return (
        <>
          <circle cx="50" cy="100" r="4" fill="#FFD700" />
          <circle cx="150" cy="100" r="4" fill="#FFD700" />
        </>
      );
    case 'necklace':
      return (
        <path d="M 82 130 Q 100 142 118 130" stroke="#FFD700" strokeWidth="2" fill="none" />
      );
    case 'headband':
      return (
        <path d="M 54 62 Q 100 50 146 62" stroke="#FF69B4" strokeWidth="5" fill="none" strokeLinecap="round" />
      );
    default:
      return null;
  }
}
