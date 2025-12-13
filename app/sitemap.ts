import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://taxisrilanka.com'
  const now = new Date()

  // Core pages
  const staticPages = [
    '',
    '/about',
    '/services',
    '/destinations',
    '/booking',
    '/contact',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1.0 : 0.8,
  }))

  // Destination pages (Tourism)
  const destinations = [
    'colombo',
    'kandy',
    'galle',
    'negombo',
    'bentota',
    'hikkaduwa',
    'mirissa',
    'unawatuna',
    'weligama',
    'ella',
    'nuwara-eliya',
    'dambulla',
    'sigiriya',
    'arugam-bay',
    'pasikuda',
    'trincomalee',
    ].map((slug) => ({
      url: `${baseUrl}/destinations/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  
    return [...staticPages, ...destinations]
  }
