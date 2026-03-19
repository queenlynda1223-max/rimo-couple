'use client';

import { useState, useEffect } from 'react';
import { userApi } from '@/lib/api';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { MinimeGenderReferencePreview } from './MinimeGenderReferencePreview';

interface MinimePanelProps {
  userId: string;
  minime: any;
  onUpdate: (minime: any) => void;
}

const GENDERS = [
  { id: 'girl', label: '여자' },
  { id: 'boy', label: '남자' },
];

/** 조합 UI 제거 후에도 API·미니룸 워커 호환용 기본값 */
const DEFAULT_COMBO = {
  hairStyle: 'long_straight',
  outfit: 'casual' as string,
  accessories: ['shoes_sneakers'] as string[],
};

function normalizeConfig(minime: any) {
  const base = {
    faceType: 'girl' as const,
    hairStyle: DEFAULT_COMBO.hairStyle,
    outfit: DEFAULT_COMBO.outfit,
    accessories: [...DEFAULT_COMBO.accessories],
  };
  if (!minime) return base;

  const faceType = minime.faceType === 'boy' ? ('boy' as const) : ('girl' as const);

  return {
    faceType,
    hairStyle: typeof minime.hairStyle === 'string' ? minime.hairStyle : DEFAULT_COMBO.hairStyle,
    outfit: typeof minime.outfit === 'string' ? minime.outfit : DEFAULT_COMBO.outfit,
    accessories:
      Array.isArray(minime.accessories) && minime.accessories.length > 0
        ? [...minime.accessories]
        : [...DEFAULT_COMBO.accessories],
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
      const payload = {
        faceType: config.faceType,
        hairStyle: config.hairStyle,
        outfit: config.outfit,
        accessories: config.accessories,
      };
      const { data } = await userApi.updateMinime(userId, payload);
      onUpdate(data.minime);
      toast.success('미니미가 업데이트되었습니다!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const update = (key: string, value: any) => setConfig((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-5 mb-20 md:mb-4">
      <div className="glass rounded-3xl p-4 sm:p-5 flex flex-col items-center">
        <MinimeGenderReferencePreview faceType={config.faceType === 'boy' ? 'boy' : 'girl'} />
      </div>

      <div className="glass rounded-2xl p-5 space-y-4">
        <div className="flex gap-2">
          {GENDERS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => update('faceType', g.id)}
              className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                config.faceType === g.id ? 'border-pink-400 bg-pink-50' : 'border-transparent bg-white/50'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

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
