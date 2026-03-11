'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import { Heart, Users, Calendar, MessageCircle, Star, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/home');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
        <div className="animate-pulse">
          <Heart className="w-12 h-12 text-pink-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              RIMO
            </span>
          </div>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-5 py-2 text-sm font-medium text-pink-600 hover:text-pink-700 transition-colors"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full hover:shadow-lg hover:shadow-pink-500/25 transition-all"
            >
              시작하기
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 rounded-full text-pink-600 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            우리만의 특별한 공간
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            둘만의 미니홈피,
            <br />
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              RIMO
            </span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            나만의 미니룸과 커플룸에서 아바타를 꾸미고,
            <br className="hidden sm:block" />
            게시판, 일정, 할 일을 함께 관리하세요.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full text-lg font-semibold hover:shadow-xl hover:shadow-pink-500/30 transition-all hover:-translate-y-0.5"
          >
            <Heart className="w-5 h-5" />
            무료로 시작하기
          </Link>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            RIMO에서 할 수 있는 것들
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Star, title: '미니미 꾸미기', desc: '나만의 아바타를 만들고 자유롭게 커스터마이징하세요' },
              { icon: Users, title: '커플룸', desc: '둘만의 공간을 함께 꾸미고 추억을 쌓아요' },
              { icon: MessageCircle, title: '게시판', desc: '서로에게 메시지를 남기고 사진을 공유해요' },
              { icon: Calendar, title: '일정 관리', desc: '중요한 기념일과 약속을 함께 관리해요' },
              { icon: Heart, title: '상태 메시지', desc: '지금 기분과 감정을 상대방에게 전해요' },
              { icon: Sparkles, title: '실시간 동기화', desc: '변경사항이 실시간으로 반영돼요' },
            ].map((item, i) => (
              <div key={i} className="glass rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-pink-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-gray-400">
        <p>RIMO - 커플 미니홈 플랫폼</p>
      </footer>
    </div>
  );
}
