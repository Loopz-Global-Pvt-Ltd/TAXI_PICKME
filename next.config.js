/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  devIndicators: {
    buildActivity: false,
  },
  env: {
    NEXT_PUBLIC_ONEPAY_APP_ID: process.env.ONEPAY_APP_ID,
    NEXT_PUBLIC_ONEPAY_HASH_TOKEN: process.env.ONEPAY_HASH_TOKEN,
    NEXT_PUBLIC_ONEPAY_APP_TOKEN: process.env.ONEPAY_APP_TOKEN,
    NEXT_PUBLIC_ONEPAY_CURRENCY: process.env.ONEPAY_CURRENCY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
}

export default nextConfig
