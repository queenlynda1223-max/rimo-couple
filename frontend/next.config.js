/** @type {import('next').NextConfig} */
// Vercel 배포 시 반드시 Environment Variables에 NEXT_PUBLIC_API_URL = (Render 백엔드 URL) 설정 후 재배포
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${BACKEND_URL}/uploads/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
