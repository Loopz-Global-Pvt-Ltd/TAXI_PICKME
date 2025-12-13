import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/checkout/',
          '/payment/',
          '/thank-you/',
          '/search',
        ],
      },
    ],
    sitemap: 'https://taxisrilanka.com/sitemap.xml',
  }
}
