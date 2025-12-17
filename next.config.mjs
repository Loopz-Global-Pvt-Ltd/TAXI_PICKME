/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['taxisrilanka.com'],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  
  // Enable static generation where possible
  output: 'standalone',
  
  // Optimize fonts
  optimizeFonts: true,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  },

  // Redirects for common misspellings
  async redirects() {
    return [
      {
        source: '/taxi',
        destination: '/',
        permanent: true,
      },
      {
        source: '/booking',
        destination: '/search',
        permanent: true,
      },
    ]
  },
}

export default nextConfig