import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/groups/:groupId((?!/new).)*',
        destination: '/groups/:groupId*/records',
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      // 로컬 개발 서버
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
      },
      // 실제 운영 서버
      {
        protocol: 'https',
        hostname: 'seven.mimu.live',
      },
      // S3, CDN 등 추가 이미지 호스트
    ],
  },
};

export default nextConfig;
