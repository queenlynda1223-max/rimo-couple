import type { Minime3DConfig } from './Minime3DCharacter';
import type { AtlasGender, AtlasHair, AtlasOutfit, AtlasShoes } from './atlasUV';

export function configToAtlasProps(c: Partial<Minime3DConfig> | undefined | null): {
  gender: AtlasGender;
  hair: AtlasHair;
  outfit: AtlasOutfit;
  shoes: AtlasShoes;
} {
  const cfg = c ?? {};
  const ft = String(cfg.faceType ?? 'default');
  const gender: AtlasGender = ft === 'boy' ? 'boy' : 'girl';

  const hs = String(cfg.hairStyle ?? 'long_straight');
  const hair: AtlasHair =
    hs === 'curly' || hs === 'wave' || hs.includes('wave') ? 'wave' : 'long';

  const om = String(cfg.outfit ?? 'casual');
  let outfit: AtlasOutfit = 'casual';
  if (om === 'school' || om === 'dress' || om === 'dress_cream') outfit = 'school';
  else if (om === 'winter' || om === 'hoodie') outfit = 'winter';
  else outfit = 'casual';

  const acc = (Array.isArray(cfg.accessories) ? cfg.accessories : []) as string[];
  let shoes: AtlasShoes = 'sneakers';
  if (acc.includes('shoes_loafers')) shoes = 'loafers';
  else if (acc.includes('shoes_boots')) shoes = 'boots';
  else if (acc.includes('shoes_sneakers')) shoes = 'sneakers';

  return { gender, hair, outfit, shoes };
}
