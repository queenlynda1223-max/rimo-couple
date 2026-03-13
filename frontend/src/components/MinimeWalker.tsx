'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { MinimeCharacter } from './MinimeCharacter';
import { SPRITE_W, SPRITE_H } from './MinimeSprites';

interface MinimeWalkerProps {
  config: Record<string, any>;
  size?: number;
  nickname?: string;
  initialX?: number;
  initialY?: number;
}

export function MinimeWalker({ config, size = 80, nickname, initialX, initialY }: MinimeWalkerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [walking, setWalking] = useState(false);
  const [facingRight, setFacingRight] = useState(true);
  const targetRef = useRef<{ x: number; y: number } | null>(null);
  const posRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animRef = useRef<number>();

  const charH = Math.round(size * (SPRITE_H / SPRITE_W));

  useEffect(() => {
    if (pos !== null || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const startX = initialX ?? (rect.width / 2 - size / 2);
    const startY = initialY ?? (rect.height - charH - 20);
    setPos({ x: startX, y: startY });
    posRef.current = { x: startX, y: startY };
  }, [pos, size, charH, initialX, initialY]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left - size / 2;
    const clickY = e.clientY - rect.top - charH / 2;
    const maxX = rect.width - size;
    const maxY = rect.height - charH - 10;
    const minY = rect.height * 0.2;
    const tx = Math.max(0, Math.min(maxX, clickX));
    const ty = Math.max(minY, Math.min(maxY, clickY));

    targetRef.current = { x: tx, y: ty };
    setFacingRight(tx > posRef.current.x);
    setWalking(true);
  }, [size]);

  useEffect(() => {
    if (!walking || !targetRef.current) return;

    const speed = 1.5;
    const tick = () => {
      const t = targetRef.current;
      if (!t) { setWalking(false); return; }

      const cur = posRef.current;
      const dx = t.x - cur.x;
      const dy = t.y - cur.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < speed) {
        posRef.current = { x: t.x, y: t.y };
        setPos({ x: t.x, y: t.y });
        targetRef.current = null;
        setWalking(false);
        return;
      }

      const nx = cur.x + (dx / dist) * speed;
      const ny = cur.y + (dy / dist) * speed;
      posRef.current = { x: nx, y: ny };
      setPos({ x: nx, y: ny });
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [walking]);

  if (!pos) return <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }} />;

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer' }}
    >
      <div
        style={{
          position: 'absolute',
          left: pos.x,
          top: pos.y,
          transform: facingRight ? 'none' : 'scaleX(-1)',
          transition: 'transform 0.15s',
          zIndex: Math.round(pos.y),
        }}
      >
        <MinimeCharacter config={config} size={size} animated={walking} frame={walking ? undefined : 0} />
        {nickname && (
          <p
            className="text-center text-xs font-medium text-gray-600 bg-white/70 backdrop-blur-sm px-2 py-0.5 rounded-full mx-auto mt-1 whitespace-nowrap"
            style={{ transform: facingRight ? 'none' : 'scaleX(-1)' }}
          >
            {nickname}
          </p>
        )}
      </div>
    </div>
  );
}
