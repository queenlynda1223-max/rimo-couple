'use client';

import { useState, useEffect } from 'react';
import { userApi } from '@/lib/api';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { Minime3D } from './Minime3D';

interface MinimePanelProps {
  userId: string;
  minime: any;
  onUpdate: (minime: any) => void;
}

const SKIN_COLORS = [
  { id: 'fair', label: '밝은', hex: '#FDE8D0' },
  { id: 'light', label: '살구', hex: '#F5D6B8' },
  { id: 'medium', label: '중간', hex: '#DBA97B' },
  { id: 'tan', label: '탠', hex: '#C08B5C' },
  { id: 'dark', label: '어두운', hex: '#8D5524' },
  { id: 'deep', label: '진한', hex: '#5C3310' },
];

const EXPRESSIONS = [
  { id: 'gentle_smile', label: '부드러운 미소', emoji: '😊' },
  { id: 'happy', label: '행복', emoji: '😄' },
  { id: 'neutral', label: '평온', emoji: '😐' },
  { id: 'wink', label: '윙크', emoji: '😉' },
];

const HAIR_STYLES = [
  { id: 'long_straight', label: '롱 스트레이트', icon: '👩' },
  { id: 'bob', label: '단발', icon: '💇‍♀️' },
  { id: 'ponytail', label: '포니테일', icon: '🎀' },
  { id: 'bun', label: '번헤어', icon: '💫' },
  { id: 'short', label: '숏컷', icon: '💇‍♂️' },
];

const HAIR_COLORS = [
  { id: '#2C1810', label: '다크브라운' },
  { id: '#000000', label: '검정' },
  { id: '#8B4513', label: '갈색' },
  { id: '#D4A76A', label: '밝은갈색' },
  { id: '#FFD700', label: '금발' },
  { id: '#FF6B6B', label: '핑크' },
  { id: '#9B59B6', label: '보라' },
  { id: '#3498DB', label: '파랑' },
  { id: '#E74C3C', label: '레드' },
  { id: '#AAAA99', label: '실버' },
];

const OUTFITS = [
  { id: 'dress_cream', label: '크림 원피스', icon: '👗' },
  { id: 'dress', label: '원피스', icon: '👗' },
  { id: 'casual', label: '캐주얼', icon: '👕' },
  { id: 'hoodie', label: '후디', icon: '🧥' },
];

const OUTFIT_COLORS = [
  { id: '#FF6B8A', label: '핑크' },
  { id: '#FF8C42', label: '오렌지' },
  { id: '#FFD93D', label: '옐로우' },
  { id: '#6BCB77', label: '그린' },
  { id: '#4D96FF', label: '블루' },
  { id: '#9B59B6', label: '퍼플' },
  { id: '#2C3E50', label: '네이비' },
  { id: '#E74C3C', label: '레드' },
  { id: '#F5F0E1', label: '아이보리' },
  { id: '#333333', label: '블랙' },
];

const ACCESSORIES = [
  { id: 'glasses_silver', label: '실버 안경', icon: '👓' },
  { id: 'glasses', label: '안경', icon: '👓' },
  { id: 'headband', label: '머리띠', icon: '👑' },
  { id: 'bow', label: '리본', icon: '🎀' },
];

const LEGACY_HAIR: Record<string, string> = { long: 'long_straight', medium: 'bob', curly: 'bun', twintail: 'ponytail' };
const LEGACY_OUTFIT: Record<string, string> = { tshirt: 'casual', suit: 'casual', sweater: 'hoodie', overall: 'casual' };
const LEGACY_EXPRESSION: Record<string, string> = { love: 'gentle_smile', cool: 'neutral', surprised: 'happy', shy: 'gentle_smile', sleepy: 'neutral' };

function normalizeConfig(minime: any) {
  if (!minime) {
    return {
      skinColor: 'fair',
      expression: 'gentle_smile',
      hairStyle: 'long_straight',
      hairColor: '#2C1810',
      outfit: 'dress_cream',
      outfitColor: '#F5F0E1',
      accessories: [] as string[],
    };
  }
  return {
    skinColor: minime.skinColor || 'fair',
    expression: LEGACY_EXPRESSION[minime.expression ?? ''] ?? minime.expression ?? 'gentle_smile',
    hairStyle: LEGACY_HAIR[minime.hairStyle ?? ''] ?? minime.hairStyle ?? 'long_straight',
    hairColor: minime.hairColor || '#2C1810',
    outfit: LEGACY_OUTFIT[minime.outfit ?? ''] ?? minime.outfit ?? 'dress_cream',
    outfitColor: minime.outfitColor || '#F5F0E1',
    accessories: Array.isArray(minime.accessories) ? minime.accessories : [],
  };
}

export function MinimePanel({ userId, minime, onUpdate }: MinimePanelProps) {
  const [config, setConfig] = useState(() => normalizeConfig(minime));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setConfig(normalizeConfig(minime));
  }, [minime]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await userApi.updateMinime(userId, config);
      onUpdate(data.minime);
      toast.success('미니미가 업데이트되었습니다!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleAccessory = (id: string) => {
    setConfig(prev => ({
      ...prev,
      accessories: prev.accessories.includes(id)
        ? prev.accessories.filter((a: string) => a !== id)
        : [...prev.accessories, id],
    }));
  };

  const update = (key: string, value: any) => setConfig(prev => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-5 mb-20 md:mb-4">
      <div className="glass rounded-3xl p-6 flex flex-col items-center">
        <div className="rounded-2xl overflow-hidden mb-2 min-h-[150px] min-w-[150px]">
          <Minime3D config={config} size={150} />
        </div>
        <p className="text-sm text-gray-500">미리보기</p>
      </div>

      <div className="glass rounded-2xl p-5 space-y-6">
        <Section title="피부색">
          <div className="flex gap-3 flex-wrap">
            {SKIN_COLORS.map((s) => (
              <button
                key={s.id}
                onClick={() => update('skinColor', s.id)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  config.skinColor === s.id ? 'ring-2 ring-pink-400 ring-offset-2 scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: s.hex }}
                title={s.label}
              />
            ))}
          </div>
        </Section>

        <Section title="표정">
          <div className="grid grid-cols-4 gap-2">
            {EXPRESSIONS.map((e) => (
              <OptionButton
                key={e.id}
                selected={config.expression === e.id}
                onClick={() => update('expression', e.id)}
                icon={e.emoji}
                label={e.label}
              />
            ))}
          </div>
        </Section>

        <Section title="헤어 스타일">
          <div className="grid grid-cols-4 gap-2">
            {HAIR_STYLES.map((h) => (
              <OptionButton
                key={h.id}
                selected={config.hairStyle === h.id}
                onClick={() => update('hairStyle', h.id)}
                icon={h.icon}
                label={h.label}
              />
            ))}
          </div>
        </Section>

        <Section title="헤어 색상">
          <div className="flex gap-3 flex-wrap">
            {HAIR_COLORS.map((c) => (
              <button
                key={c.id}
                onClick={() => update('hairColor', c.id)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  config.hairColor === c.id ? 'ring-2 ring-pink-400 ring-offset-2 scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: c.id }}
                title={c.label}
              />
            ))}
          </div>
        </Section>

        <Section title="의상">
          <div className="grid grid-cols-3 gap-2">
            {OUTFITS.map((o) => (
              <OptionButton
                key={o.id}
                selected={config.outfit === o.id}
                onClick={() => update('outfit', o.id)}
                icon={o.icon}
                label={o.label}
              />
            ))}
          </div>
        </Section>

        <Section title="의상 색상">
          <div className="flex gap-3 flex-wrap">
            {OUTFIT_COLORS.map((c) => (
              <button
                key={c.id}
                onClick={() => update('outfitColor', c.id)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  config.outfitColor === c.id ? 'ring-2 ring-pink-400 ring-offset-2 scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: c.id }}
                title={c.label}
              />
            ))}
          </div>
        </Section>

        <Section title="악세사리 (여러 개 선택 가능)">
          <div className="grid grid-cols-4 gap-2">
            {ACCESSORIES.map((a) => (
              <OptionButton
                key={a.id}
                selected={config.accessories.includes(a.id)}
                onClick={() => toggleAccessory(a.id)}
                icon={a.icon}
                label={a.label}
              />
            ))}
          </div>
        </Section>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {saving ? '저장 중...' : '미니미 저장'}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-3">{title}</h4>
      {children}
    </div>
  );
}

function OptionButton({ selected, onClick, icon, label }: { selected: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
        selected
          ? 'border-pink-400 bg-pink-50'
          : 'border-transparent bg-white/50 hover:border-pink-200'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-xs text-gray-600">{label}</span>
    </button>
  );
}
