'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { roomApi, userApi } from '@/lib/api';
import { Heart, Home, ArrowLeft, MessageCircle, Calendar, CheckSquare, Smile, Music, Image, Pencil } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { BoardPanel } from '@/components/BoardPanel';
import { SchedulePanel } from '@/components/SchedulePanel';
import { TodoPanel } from '@/components/TodoPanel';
import { MinimePanel } from '@/components/MinimePanel';
import { MinimeWalker } from '@/components/MinimeWalker';
import { StatusMessage } from '@/components/StatusMessage';

const BACKGROUNDS = [
  { id: 'bg_default', name: '기본', color: 'from-pink-100 to-rose-100' },
  { id: 'bg_sky', name: '하늘', color: 'from-sky-100 to-blue-200' },
  { id: 'bg_sunset', name: '노을', color: 'from-orange-100 to-pink-200' },
  { id: 'bg_forest', name: '숲', color: 'from-green-100 to-emerald-200' },
  { id: 'bg_night', name: '밤', color: 'from-indigo-200 to-purple-300' },
  { id: 'bg_ocean', name: '바다', color: 'from-cyan-100 to-blue-200' },
  { id: 'bg_cherry', name: '벚꽃', color: 'from-pink-200 to-rose-300' },
  { id: 'bg_lavender', name: '라벤더', color: 'from-purple-100 to-violet-200' },
];

type Tab = 'room' | 'board' | 'schedule' | 'todo' | 'minime';

export default function MiniRoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const userId = params.userId as string;
  const isOwner = user?.id === userId;

  const [room, setRoom] = useState<any>(null);
  const [minime, setMinime] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>((searchParams.get('tab') as Tab) || 'room');
  const [showBgPicker, setShowBgPicker] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    loadRoom();
  }, [userId, isAuthenticated, isLoading]);

  const loadRoom = async () => {
    try {
      const { data: roomData } = await roomApi.getMiniRoom(userId);
      setRoom(roomData.room);
      const { data: minimeData } = await userApi.getMinime(userId);
      setMinime(minimeData.minime);
    } catch (err: any) {
      toast.error('미니룸을 불러올 수 없습니다');
    }
  };

  const handleBgChange = async (bgId: string) => {
    try {
      const { data } = await roomApi.updateMiniRoom(userId, { backgroundId: bgId });
      setRoom(data.room);
      setShowBgPicker(false);
      toast.success('배경이 변경되었습니다');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (isLoading || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
        <Heart className="w-10 h-10 text-pink-400 animate-pulse" />
      </div>
    );
  }

  const currentBg = BACKGROUNDS.find(b => b.id === room.backgroundId) || BACKGROUNDS[0];

  const tabs = [
    { key: 'room' as Tab, icon: Home, label: '룸' },
    { key: 'board' as Tab, icon: MessageCircle, label: '게시판' },
    { key: 'schedule' as Tab, icon: Calendar, label: '일정' },
    { key: 'todo' as Tab, icon: CheckSquare, label: '할 일' },
    { key: 'minime' as Tab, icon: Smile, label: '미니미' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      <nav className="glass sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/home" className="p-1.5 text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-pink-500" />
              <span className="font-semibold text-gray-800">내 미니룸</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-4">
        <StatusMessage
          roomId={room.id}
          userId={userId}
          statusMessage={room.statusMessage}
          isOwner={isOwner}
          onUpdate={(msg) => setRoom({ ...room, statusMessage: msg })}
        />

        {activeTab === 'room' && (
          <div className={`relative rounded-3xl bg-gradient-to-br ${currentBg.color} p-8 min-h-[320px] md:min-h-[400px] overflow-hidden mb-4`}>
            <div className="absolute inset-0 bg-white/10" />
            <div className="relative z-10 h-full min-h-[280px] md:min-h-[360px]">
              {minime && (
                <MinimeWalker config={minime} size={90} nickname={user?.nickname || '나'} />
              )}
            </div>

            {isOwner && (
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={() => setShowBgPicker(!showBgPicker)}
                  className="p-2.5 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white transition-colors shadow-sm"
                >
                  <Image className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}

            {showBgPicker && isOwner && (
              <div className="absolute bottom-16 right-4 glass rounded-2xl p-4 w-64 z-20">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">배경 선택</h4>
                <div className="grid grid-cols-4 gap-2">
                  {BACKGROUNDS.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => handleBgChange(bg.id)}
                      className={`aspect-square rounded-lg bg-gradient-to-br ${bg.color} border-2 transition-all ${room.backgroundId === bg.id ? 'border-pink-500 scale-105' : 'border-transparent hover:border-pink-300'}`}
                      title={bg.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'board' && <BoardPanel roomType="mini" roomId={room.id} userId={userId} />}
        {activeTab === 'schedule' && <SchedulePanel roomType="mini" roomId={room.id} userId={userId} />}
        {activeTab === 'todo' && <TodoPanel roomType="mini" roomId={room.id} userId={userId} />}
        {activeTab === 'minime' && minime && <MinimePanel userId={userId} minime={minime} onUpdate={setMinime} />}

        <div className="fixed bottom-0 left-0 right-0 glass border-t border-white/30 md:relative md:mt-4 md:rounded-2xl md:border">
          <div className="max-w-3xl mx-auto flex justify-around py-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-colors ${
                  activeTab === tab.key
                    ? 'text-pink-500'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
