'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { roomApi, userApi } from '@/lib/api';
import { Heart, ArrowLeft, Users, MessageCircle, Calendar, CheckSquare, Image, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { BoardPanel } from '@/components/BoardPanel';
import { SchedulePanel } from '@/components/SchedulePanel';
import { TodoPanel } from '@/components/TodoPanel';
import { joinRoom, leaveRoom } from '@/lib/socket';

const BACKGROUNDS = [
  { id: 'bg_couple_default', name: '기본', color: 'from-pink-200 to-rose-200' },
  { id: 'bg_couple_sunset', name: '노을', color: 'from-orange-200 to-pink-300' },
  { id: 'bg_couple_night', name: '별밤', color: 'from-indigo-200 to-purple-300' },
  { id: 'bg_couple_garden', name: '정원', color: 'from-green-200 to-emerald-300' },
  { id: 'bg_couple_ocean', name: '바다', color: 'from-cyan-200 to-blue-300' },
  { id: 'bg_couple_cherry', name: '벚꽃', color: 'from-pink-300 to-rose-400' },
];

type Tab = 'room' | 'board' | 'schedule' | 'todo';

export default function CoupleRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const roomId = params.roomId as string;

  const [room, setRoom] = useState<any>(null);
  const [user1Minime, setUser1Minime] = useState<any>(null);
  const [user2Minime, setUser2Minime] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>('room');
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    loadRoom();
    joinRoom(roomId);
    return () => { leaveRoom(roomId); };
  }, [roomId, isAuthenticated, isLoading]);

  const loadRoom = async () => {
    try {
      const { data } = await roomApi.getCoupleRoom(roomId);
      setRoom(data.room);

      if (data.room.user1Id) {
        try {
          const { data: m1 } = await userApi.getMinime(data.room.user1Id);
          setUser1Minime(m1.minime);
        } catch {}
      }
      if (data.room.user2Id) {
        try {
          const { data: m2 } = await userApi.getMinime(data.room.user2Id);
          setUser2Minime(m2.minime);
        } catch {}
      }
    } catch (err: any) {
      toast.error('커플룸을 불러올 수 없습니다');
      router.push('/home');
    }
  };

  const handleBgChange = async (bgId: string) => {
    try {
      const { data } = await roomApi.updateCoupleRoom(roomId, { backgroundId: bgId });
      setRoom(data.room);
      setShowBgPicker(false);
      toast.success('배경이 변경되었습니다');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleCopyCode = () => {
    if (room?.invitationCode) {
      navigator.clipboard.writeText(room.invitationCode);
      setCopied(true);
      toast.success('초대 코드가 복사되었습니다');
      setTimeout(() => setCopied(false), 2000);
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
  const getEmoji = (minime: any) => {
    if (!minime) return '🙂';
    if (minime.faceType === 'happy') return '😊';
    if (minime.faceType === 'cool') return '😎';
    if (minime.faceType === 'love') return '🥰';
    if (minime.faceType === 'cat') return '😺';
    return '🙂';
  };

  const tabs = [
    { key: 'room' as Tab, icon: Users, label: '룸' },
    { key: 'board' as Tab, icon: MessageCircle, label: '게시판' },
    { key: 'schedule' as Tab, icon: Calendar, label: '일정' },
    { key: 'todo' as Tab, icon: CheckSquare, label: '할 일' },
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
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <span className="font-semibold text-gray-800">커플룸</span>
            </div>
          </div>
          {!room.isConnected && (
            <button onClick={handleCopyCode} className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-100 text-pink-600 rounded-lg text-sm">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              초대코드
            </button>
          )}
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-4">
        {activeTab === 'room' && (
          <div className={`relative rounded-3xl bg-gradient-to-br ${currentBg.color} p-8 min-h-[320px] md:min-h-[400px] overflow-hidden mb-4`}>
            <div className="absolute inset-0 bg-white/10" />
            <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[280px]">
              {room.isConnected ? (
                <div className="flex items-end gap-6">
                  <div className="text-center">
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/60 backdrop-blur-sm border-4 border-white/80 flex items-center justify-center mx-auto mb-2 shadow-lg">
                      <span className="text-3xl md:text-4xl">{getEmoji(user1Minime)}</span>
                    </div>
                    <span className="text-xs font-medium text-gray-600 bg-white/60 px-3 py-1 rounded-full">나</span>
                  </div>
                  <Heart className="w-8 h-8 text-rose-400 fill-rose-400 animate-pulse mb-8" />
                  <div className="text-center">
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/60 backdrop-blur-sm border-4 border-white/80 flex items-center justify-center mx-auto mb-2 shadow-lg">
                      <span className="text-3xl md:text-4xl">{getEmoji(user2Minime)}</span>
                    </div>
                    <span className="text-xs font-medium text-gray-600 bg-white/60 px-3 py-1 rounded-full">상대방</span>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Users className="w-16 h-16 text-gray-400/50 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">상대방의 연결을 기다리고 있어요</p>
                  <p className="text-sm text-gray-400 mt-1">초대 코드: {room.invitationCode}</p>
                </div>
              )}
            </div>

            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={() => setShowBgPicker(!showBgPicker)}
                className="p-2.5 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white transition-colors shadow-sm"
              >
                <Image className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {showBgPicker && (
              <div className="absolute bottom-16 right-4 glass rounded-2xl p-4 w-64 z-20">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">배경 선택</h4>
                <div className="grid grid-cols-3 gap-2">
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

        {activeTab === 'board' && <BoardPanel roomType="couple" roomId={room.id} userId={user!.id} />}
        {activeTab === 'schedule' && <SchedulePanel roomType="couple" roomId={room.id} userId={user!.id} />}
        {activeTab === 'todo' && <TodoPanel roomType="couple" roomId={room.id} userId={user!.id} />}

        <div className="fixed bottom-0 left-0 right-0 glass border-t border-white/30 md:relative md:mt-4 md:rounded-2xl md:border">
          <div className="max-w-3xl mx-auto flex justify-around py-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-colors ${
                  activeTab === tab.key ? 'text-pink-500' : 'text-gray-400 hover:text-gray-600'
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
