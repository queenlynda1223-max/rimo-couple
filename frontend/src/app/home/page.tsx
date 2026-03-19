'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, purgeAllLocalSession } from '@/store/auth-store';
import { useRoomStore } from '@/store/room-store';
import { roomApi, userApi } from '@/lib/api';
import {
  Heart,
  Home,
  Users,
  LogOut,
  ChevronDown,
  MessageCircle,
  Calendar,
  CheckSquare,
  Smile,
  Copy,
  Check,
  UserX,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { SafeMinime } from '@/components/SafeMinime';

export default function HomePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const { setMiniRoom, setCoupleRoom } = useRoomStore();
  const [coupleRoom, setLocalCoupleRoom] = useState<any>(null);
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [myMinime, setMyMinime] = useState<any>(null);
  const [partnerMinime, setPartnerMinime] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmPhrase, setDeleteConfirmPhrase] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const DELETE_PHRASE = '회원탈퇴';

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    if (!accountMenuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAccountMenuOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [accountMenuOpen]);

  const loadRooms = async () => {
    if (!user?.id) return;
    try {
      const { data: miniData } = await roomApi.getMiniRoom(user.id);
      setMiniRoom(miniData.room);
    } catch {}

    try {
      const { data: minimeData } = await userApi.getMinime(user.id);
      if (minimeData?.minime) setMyMinime(minimeData.minime);
    } catch {}

    try {
      const { data: coupleData } = await roomApi.getMyCoupleRoom();
      if (coupleData?.room) {
        setLocalCoupleRoom(coupleData.room);
        setCoupleRoom(coupleData.room);
        const partnerId = coupleData.room.user1Id === user.id
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

  const handlePurgeLocalLogin = () => {
    purgeAllLocalSession();
    toast.success('이 기기에 저장된 로그인 정보를 지웠어요');
    router.push('/login');
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    const usesOAuthOnly = Boolean(user.oauthProvider);
    if (usesOAuthOnly) {
      if (deleteConfirmPhrase !== DELETE_PHRASE) {
        toast.error(`확인 문구를 정확히 입력해 주세요: ${DELETE_PHRASE}`);
        return;
      }
    } else if (!deletePassword.trim()) {
      toast.error('비밀번호를 입력해 주세요');
      return;
    }

    setDeleteLoading(true);
    try {
      await userApi.deleteUser(user.id, {
        ...(usesOAuthOnly
          ? { confirmation: deleteConfirmPhrase }
          : { password: deletePassword }),
      });
      toast.success('계정이 삭제되었습니다');
      purgeAllLocalSession();
      router.push('/login');
    } catch (err: any) {
      toast.error(err.message || '탈퇴 처리에 실패했습니다');
    } finally {
      setDeleteLoading(false);
    }
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
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-sm text-gray-600 hidden sm:block truncate max-w-[140px] md:max-w-none">
              {user.nickname || user.email}
            </span>
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setAccountMenuOpen((o) => !o)}
                className="flex items-center gap-1 p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-white/60 transition-colors"
                aria-expanded={accountMenuOpen}
                aria-haspopup="menu"
                title="계정 메뉴"
              >
                <LogOut className="w-5 h-5" />
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </button>
              {accountMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-1 min-w-[11rem] py-1 rounded-xl border border-gray-200/80 bg-white/95 shadow-lg backdrop-blur-md z-[60]"
                >
                  <button
                    type="button"
                    role="menuitem"
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-800 hover:bg-pink-50/80"
                    onClick={async () => {
                      setAccountMenuOpen(false);
                      await handleLogout();
                    }}
                  >
                    로그아웃
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/80 flex items-center gap-2"
                    onClick={() => {
                      setAccountMenuOpen(false);
                      setDeletePassword('');
                      setDeleteConfirmPhrase('');
                      setDeleteModalOpen(true);
                    }}
                  >
                    <UserX className="w-4 h-4 shrink-0" />
                    회원 탈퇴
                  </button>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    type="button"
                    role="menuitem"
                    className="w-full text-left px-4 py-2 text-xs text-gray-500 hover:bg-gray-50"
                    title="서버 로그아웃 없이 이 브라우저에 저장된 토큰만 삭제합니다"
                    onClick={() => {
                      setAccountMenuOpen(false);
                      handlePurgeLocalLogin();
                    }}
                  >
                    이 기기 로그인만 지우기
                  </button>
                </div>
              )}
            </div>
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
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-3 flex items-center justify-center min-w-[84px] min-h-[99px] shrink-0">
                {mounted && <SafeMinime config={myMinime ?? {}} size={60} />}
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
                  <SafeMinime config={myMinime || {}} size={50} />
                </div>
                <Heart className="w-5 h-5 text-rose-400 fill-rose-400 animate-pulse" />
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-2 flex items-center justify-center">
                  <SafeMinime config={partnerMinime || {}} size={50} />
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

      {deleteModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
        >
          <div className="w-full max-w-md glass rounded-2xl p-6 shadow-xl border border-red-100">
            <h2 id="delete-account-title" className="text-lg font-bold text-gray-900">
              회원 탈퇴
            </h2>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              이 작업은 되돌릴 수 없습니다. 미니룸·게시·일정·할 일·미디어가 삭제되며, 참여 중인 커플룸은 전체가 삭제됩니다.
            </p>

            {user.oauthProvider ? (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  확인 문구 입력
                </label>
                <input
                  type="text"
                  value={deleteConfirmPhrase}
                  onChange={(e) => setDeleteConfirmPhrase(e.target.value)}
                  placeholder={DELETE_PHRASE}
                  className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                  autoComplete="off"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  아래 문구를 그대로 입력하세요: <strong>{DELETE_PHRASE}</strong>
                </p>
              </div>
            ) : (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호 확인</label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="현재 비밀번호"
                  className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                  autoComplete="current-password"
                />
              </div>
            )}

            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleteLoading}
                className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-700 bg-white/80 border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
              >
                {deleteLoading ? '처리 중...' : '탈퇴하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
