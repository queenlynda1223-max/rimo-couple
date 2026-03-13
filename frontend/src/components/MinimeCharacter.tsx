'use client';

import { useRef, useEffect, useCallback } from 'react';
import { generateSprite, buildColorMap, SpriteConfig } from './MinimeSprites';

const SKIN: Record<string, string> = {
  fair: '#FDE8D0', light: '#F5D6B8', medium: '#DBA97B',
  tan: '#C08B5C', dark: '#8D5524', deep: '#5C3310',
};

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
  animated?: boolean;
  frame?: number;
}

export function MinimeCharacter({ config = {}, size = 128, animated = false, frame: extFrame }: MinimeCharacterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const animRef = useRef<number>();
  const configRef = useRef(config);
  configRef.current = config;

  const render = useCallback((canvas: HTMLCanvasElement, f: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cfg = configRef.current;
    const spriteConfig: SpriteConfig = {
      skinColor: SKIN[cfg.skinColor || 'fair'] || '#FDE8D0',
      hairColor: cfg.hairColor || '#2C1810',
      outfitColor: cfg.outfitColor || '#FF6B8A',
      hairStyle: cfg.hairStyle || 'short',
      outfit: cfg.outfit || 'tshirt',
      expression: cfg.expression || 'happy',
      accessories: cfg.accessories || [],
      frame: f,
    };

    const grid = generateSprite(spriteConfig);
    const colorMap = buildColorMap(spriteConfig);

    const off = document.createElement('canvas');
    off.width = 32;
    off.height = 32;
    const offCtx = off.getContext('2d')!;
    offCtx.clearRect(0, 0, 32, 32);

    for (let y = 0; y < 32; y++) {
      for (let x = 0; x < 32; x++) {
        const key = grid[y][x];
        if (key && colorMap[key]) {
          offCtx.fillStyle = colorMap[key];
          offCtx.fillRect(x, y, 1, 1);
        }
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(off, 0, 0, 32, 32, 0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (animated) {
      let lastTime = 0;
      const tick = (time: number) => {
        if (time - lastTime > 200) {
          frameRef.current = (frameRef.current + 1) % 4;
          render(canvas, frameRef.current);
          lastTime = time;
        }
        animRef.current = requestAnimationFrame(tick);
      };
      render(canvas, 0);
      animRef.current = requestAnimationFrame(tick);
      return () => {
        if (animRef.current) cancelAnimationFrame(animRef.current);
      };
    } else {
      render(canvas, extFrame ?? 0);
    }
  }, [config, size, animated, extFrame, render]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ imageRendering: 'pixelated', width: size, height: size }}
    />
  );
}
