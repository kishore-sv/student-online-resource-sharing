import { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { resource } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://resource.kishore-sv.me'

  // Fetch all public resources
  const publicResources = await db.query.resource.findMany({
    where: eq(resource.visibility, 'public'),
    columns: {
      id: true,
      updatedAt: true,
    },
  })

  const resourceUrls = publicResources.map((res) => ({
    url: `${baseUrl}/resource/${res.id}`,
    lastModified: res.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/home`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
        url: `${baseUrl}/signup`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
    },
  ]

  return [...staticUrls, ...resourceUrls]
}
