'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useRoomStore } from '@/store/room-store';
import { roomApi, userApi } from '@/lib/api';
import { Heart, Home, Users, LogOut, MessageCircle, Calendar, CheckSquare, Smile, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { MinimeCharacter } from '@/components/MinimeCharacter';

export default function HomePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const { setMiniRoom, setCoupleRoom } = useRoomStore();
  const [coupleRoom, setLocalCoupleRoom] = useState<any>(null);
  const [inviteCode, setInviteCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [myMinime, setMyMinime] = useState<any>(null);
  const [partnerMinime, setPartnerMinime] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user) {
      loadRooms();
    }
  }, [user]);

  const loadRooms = async () => {
    try {
      const { data: miniData } = await roomApi.getMiniRoom(user!.id);
      setMiniRoom(miniData.room);
    } catch {}

    try {
      const { data: minimeData } = await userApi.getMinime(user!.id);
      if (minimeData?.minime) setMyMinime(minimeData.minime);
    } catch {}

    try {
      const { data: coupleData } = await roomApi.getMyCoupleRoom();
      if (coupleData?.room) {
        setLocalCoupleRoom(coupleData.room);
        setCoupleRoom(coupleData.room);
        const partnerId = coupleData.room.user1Id === user!.id
          ? coupleData.room.user2Id
          : coupleData.room.user1Id;
        if (partnerId) {
          try {
            const { data: pm } = await userApi.getMinime(partnerId);
            if (pm?.minime) setPartnerMinime(pm.minime);
          } catch {}
        }
      }
    } catch {}
  };

  const handleCreateCoupleRoom = async () => {
    try {
      const { data } = await roomApi.createCoupleRoom();
      setLocalCoupleRoom(data.room);
      setCoupleRoom(data.room);
      toast.success('커플룸이 생성되었습니다!');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleJoinCoupleRoom = async () => {
    if (!joinCode.trim()) return;
    try {
      const { data } = await roomApi.joinCoupleRoom(joinCode.trim());
      setLocalCoupleRoom(data.room);
      setCoupleRoom(data.room);
      toast.success('커플룸에 연결되었습니다!');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleCopyCode = () => {
    if (coupleRoom?.invitationCode) {
      navigator.clipboard.writeText(coupleRoom.invitationCode);
      setCopied(true);
      toast.success('초대 코드가 복사되었습니다');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
        <Heart className="w-10 h-10 text-pink-400 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      <nav className="glass sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
            <span className="text-lg font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">RIMO</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">{user.nickname || user.email}</span>
            <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">안녕하세요, {user.nickname || '회원'}님!</h2>
          <p className="text-sm text-gray-500">오늘도 RIMO에서 특별한 시간을 보내세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href={`/room/mini/${user.id}`} className="glass rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl flex items-center justify-center">
                <Home className="w-5 h-5 text-pink-500" />
              </div>
              <h3 className="font-semibold text-gray-800">내 미니룸</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-3 flex items-center justify-center">
                <MinimeCharacter config={myMinime ?? {}} size={60} />
              </div>
              <p className="text-sm text-gray-500">{myMinime ? `${user.nickname || '나'}의 미니룸` : '나만의 공간을 꾸미고 관리해요'}</p>
            </div>
          </Link>

          {coupleRoom?.isConnected ? (
            <Link href={`/room/couple/${coupleRoom.id}`} className="glass rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-rose-500" />
                </div>
                <h3 className="font-semibold text-gray-800">커플룸</h3>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-2 flex items-center justify-center">
                  <MinimeCharacter config={myMinime || {}} size={50} />
                </div>
                <Heart className="w-5 h-5 text-rose-400 fill-rose-400 animate-pulse" />
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-2 flex items-center justify-center">
                  <MinimeCharacter config={partnerMinime || {}} size={50} />
                </div>
              </div>
            </Link>
          ) : (
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-rose-500" />
                </div>
                <h3 className="font-semibold text-gray-800">커플룸</h3>
              </div>

              {coupleRoom && !coupleRoom.isConnected ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">초대 코드를 상대방에게 전달하세요</p>
                  <div className="flex gap-2">
                    <div className="flex-1 px-4 py-2.5 bg-pink-50 rounded-lg font-mono text-center text-pink-600 font-semibold tracking-wider">
                      {coupleRoom.invitationCode}
                    </div>
                    <button onClick={handleCopyCode} className="px-3 py-2.5 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors">
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleCreateCoupleRoom}
                    className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm"
                  >
                    커플룸 만들기
                  </button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                    <div className="relative flex justify-center"><span className="bg-white/70 px-3 text-xs text-gray-400">또는</span></div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      placeholder="초대 코드 입력"
                      className="flex-1 px-4 py-2.5 bg-white/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                    <button onClick={handleJoinCoupleRoom} className="px-4 py-2.5 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors text-sm font-medium">
                      참여
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: MessageCircle, label: '게시판', href: `/room/mini/${user.id}?tab=board`, color: 'from-violet-100 to-purple-100', iconColor: 'text-violet-500' },
            { icon: Calendar, label: '일정', href: `/room/mini/${user.id}?tab=schedule`, color: 'from-blue-100 to-cyan-100', iconColor: 'text-blue-500' },
            { icon: CheckSquare, label: '할 일', href: `/room/mini/${user.id}?tab=todo`, color: 'from-emerald-100 to-green-100', iconColor: 'text-emerald-500' },
            { icon: Smile, label: '미니미', href: `/room/mini/${user.id}?tab=minime`, color: 'from-amber-100 to-yellow-100', iconColor: 'text-amber-500' },
          ].map((item, i) => (
            <Link key={i} href={item.href} className="glass rounded-2xl p-4 hover:shadow-lg transition-all hover:-translate-y-0.5 text-center">
              <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                <item.icon className={`w-5 h-5 ${item.iconColor}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
