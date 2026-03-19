'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore, purgeAllLocalSession } from '@/store/auth-store';
import { Heart, Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('rimo_remember') === 'true';
    return false;
  });
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const handleClearStoredLogin = () => {
    purgeAllLocalSession();
    setRememberMe(false);
    toast.success('저장된 로그인 정보를 모두 지웠어요');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, rememberMe);
      toast.success('로그인 성공!');
      router.push('/home');
    } catch (err: any) {
      toast.error(err.message || '로그인에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-8">
          <ArrowLeft className="w-4 h-4" /> 돌아가기
        </Link>

        <div className="glass rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl mb-4">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">로그인</h1>
            <p className="text-sm text-gray-500 mt-1">RIMO에 돌아오신 것을 환영해요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8자 이상"
                  className="w-full pl-11 pr-11 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-300 cursor-pointer"
              />
              <span className="text-sm text-gray-600">로그인 저장</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <button
            type="button"
            onClick={handleClearStoredLogin}
            className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-gray-700 underline-offset-2 hover:underline"
          >
            저장된 로그인 정보 모두 지우기
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            아직 계정이 없으신가요?{' '}
            <Link href="/signup" className="text-pink-500 font-medium hover:text-pink-600">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
