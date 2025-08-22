import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://health-check-sepia.vercel.app'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/_next/',
        '/test-results/',
        '/playwright-report/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}