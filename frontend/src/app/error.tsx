'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Heart, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 px-4">
      <div className="glass rounded-2xl p-8 max-w-md w-full text-center">
        <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-800 mb-2">일시적인 오류가 발생했어요</h2>
        <p className="text-sm text-gray-500 mb-6">잠시 후 다시 시도해 주세요.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            다시 시도
          </button>
          <Link
            href="/home"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
