'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000 },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    checkAuth().catch(() => {});
    setMounted(true);
  }, [checkAuth]);

  if (!mounted) return null;

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: '#fff', color: '#333', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
        }}
      />
    </QueryClientProvider>
  );
}
