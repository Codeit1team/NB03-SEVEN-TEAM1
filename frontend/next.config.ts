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
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
      },
      {
        protocol: 'https',
        hostname: 'seven.mimu.live',
      },
      {
        protocol: 'https',
        hostname: 'example.com', //커밋이나 푸시 전 지울 것
      },
    ],
  },
};

export default nextConfig;