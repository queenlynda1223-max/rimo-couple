'use client';

import { useState } from 'react';
import { userApi } from '@/lib/api';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface MinimePanelProps {
  userId: string;
  minime: any;
  onUpdate: (minime: any) => void;
}

const FACE_TYPES = [
  { id: 'default', emoji: '🙂', label: '기본' },
  { id: 'happy', emoji: '😊', label: '행복' },
  { id: 'cool', emoji: '😎', label: '쿨' },
  { id: 'love', emoji: '🥰', label: '사랑' },
  { id: 'cat', emoji: '😺', label: '고양이' },
  { id: 'star', emoji: '🤩', label: '스타' },
  { id: 'angel', emoji: '😇', label: '천사' },
  { id: 'wink', emoji: '😉', label: '윙크' },
];

const HAIR_STYLES = [
  { id: 'default', label: '기본', icon: '💇' },
  { id: 'long', label: '롱', icon: '💇‍♀️' },
  { id: 'short', label: '숏', icon: '💇‍♂️' },
  { id: 'curly', label: '곱슬', icon: '🌀' },
  { id: 'ponytail', label: '포니테일', icon: '🎀' },
];

const HAIR_COLORS = [
  { id: '#000000', label: '검정' },
  { id: '#8B4513', label: '갈색' },
  { id: '#FFD700', label: '금발' },
  { id: '#FF6B6B', label: '핑크' },
  { id: '#9B59B6', label: '보라' },
  { id: '#3498DB', label: '파랑' },
];

const OUTFITS = [
  { id: 'default', label: '캐주얼', icon: '👕' },
  { id: 'formal', label: '정장', icon: '👔' },
  { id: 'sporty', label: '스포티', icon: '🏃' },
  { id: 'cute', label: '큐트', icon: '🎀' },
  { id: 'pajama', label: '잠옷', icon: '🛌' },
];

export function MinimePanel({ userId, minime, onUpdate }: MinimePanelProps) {
  const [config, setConfig] = useState({
    faceType: minime.faceType || 'default',
    hairStyle: minime.hairStyle || 'default',
    hairColor: minime.hairColor || '#000000',
    outfit: minime.outfit || 'default',
    accessories: minime.accessories || [],
  });
  const [saving, setSaving] = useState(false);

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

  const currentFace = FACE_TYPES.find(f => f.id === config.faceType) || FACE_TYPES[0];

  return (
    <div className="space-y-6 mb-20 md:mb-4">
      <div className="glass rounded-3xl p-8 text-center">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 border-4 border-white shadow-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-6xl">{currentFace.emoji}</span>
        </div>
        <p className="text-sm text-gray-500">미리보기</p>
      </div>

      <div className="glass rounded-2xl p-5 space-y-5">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">표정</h4>
          <div className="grid grid-cols-4 gap-2">
            {FACE_TYPES.map((face) => (
              <button
                key={face.id}
                onClick={() => setConfig({ ...config, faceType: face.id })}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                  config.faceType === face.id
                    ? 'border-pink-400 bg-pink-50'
                    : 'border-transparent bg-white/50 hover:border-pink-200'
                }`}
              >
                <span className="text-2xl">{face.emoji}</span>
                <span className="text-xs text-gray-600">{face.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">헤어스타일</h4>
          <div className="grid grid-cols-5 gap-2">
            {HAIR_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => setConfig({ ...config, hairStyle: style.id })}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                  config.hairStyle === style.id
                    ? 'border-pink-400 bg-pink-50'
                    : 'border-transparent bg-white/50 hover:border-pink-200'
                }`}
              >
                <span className="text-xl">{style.icon}</span>
                <span className="text-xs text-gray-600">{style.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">헤어 컬러</h4>
          <div className="flex gap-3">
            {HAIR_COLORS.map((color) => (
              <button
                key={color.id}
                onClick={() => setConfig({ ...config, hairColor: color.id })}
                className={`w-10 h-10 rounded-full border-3 transition-all ${
                  config.hairColor === color.id ? 'ring-2 ring-pink-400 ring-offset-2 scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color.id }}
                title={color.label}
              />
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">의상</h4>
          <div className="grid grid-cols-5 gap-2">
            {OUTFITS.map((outfit) => (
              <button
                key={outfit.id}
                onClick={() => setConfig({ ...config, outfit: outfit.id })}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                  config.outfit === outfit.id
                    ? 'border-pink-400 bg-pink-50'
                    : 'border-transparent bg-white/50 hover:border-pink-200'
                }`}
              >
                <span className="text-xl">{outfit.icon}</span>
                <span className="text-xs text-gray-600">{outfit.label}</span>
              </button>
            ))}
          </div>
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
