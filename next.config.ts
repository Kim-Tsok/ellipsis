import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  serverExternalPackages: ['@prisma/client'],
};

export default nextConfig;
