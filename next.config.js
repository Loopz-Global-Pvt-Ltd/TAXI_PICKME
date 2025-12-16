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
    domains: ['taxisrilanka.com'],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dynamic-media-cdn.tripadvisor.com",
        pathname: "/media/**",
      },
    ],
  },
  compress: true,
  devIndicators: {
    buildActivity: false,
  },
  env: {
    NEXT_PUBLIC_ONEPAY_APP_ID: process.env.ONEPAY_APP_ID,
    NEXT_PUBLIC_ONEPAY_APP_TOKEN: process.env.ONEPAY_APP_TOKEN,
    NEXT_PUBLIC_ONEPAY_CURRENCY: process.env.ONEPAY_CURRENCY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  webpack: (config, { dev, isServer }) => {
    // Suppress moment-timezone warnings
    if (dev && !isServer) {
      const originalWarn = console.warn
      console.warn = (...args) => {
        if (typeof args[0] === 'string' && args[0].includes('Moment Timezone')) {
          return
        }
        originalWarn.apply(console, args)
      }
    }
    return config
  },
}

module.exports = nextConfig
