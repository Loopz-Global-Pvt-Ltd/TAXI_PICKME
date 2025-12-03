/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  devIndicators: {
    buildActivity: false,
  },
  env: {
    NEXT_PUBLIC_ONEPAY_APP_ID: process.env.ONEPAY_APP_ID,
    NEXT_PUBLIC_ONEPAY_APP_TOKEN: process.env.ONEPAY_APP_TOKEN,
    NEXT_PUBLIC_ONEPAY_CURRENCY: process.env.ONEPAY_CURRENCY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
}

module.exports = nextConfig
