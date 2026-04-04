import { Metadata, ResolvingMetadata } from 'next'
import { getResourceById } from '@/lib/db/queries'

type Props = {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id
  const resource = await getResourceById(id)

  if (!resource) {
    return {
      title: 'Resource Not Found',
    }
  }

  const images = (await parent).openGraph?.images || []

  return {
    title: resource.title,
    description: resource.description || `Check out ${resource.title} on StudyHub.`,
    openGraph: {
      title: resource.title,
      description: resource.description || `Check out ${resource.title} on StudyHub.`,
      images: [resource.url || '/og-image.png', ...images],
    },
    twitter: {
        card: 'summary_large_image',
        title: resource.title,
        description: resource.description || `Check out ${resource.title} on StudyHub.`,
        images: [resource.url || '/og-image.png'],
    }
  }
}

export default function ResourceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
