/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  images: {
    domains: [
      'localhost',
      '127.0.0.1',
      'api-elo.confianopai.com',
    ],
  },
};

export default nextConfig;