import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Silence Turbopack/webpack mismatch warning
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Allow serving catalogue.pdf from /public
  async headers() {
    return [
      {
        source: '/catalogue.pdf',
        headers: [
          { key: 'Content-Disposition', value: 'attachment; filename="Shree-Radha-Studio-Catalogue.pdf"' },
          { key: 'Content-Type', value: 'application/pdf' },
        ],
      },
    ];
  },
};

export default nextConfig;
