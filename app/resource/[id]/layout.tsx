import { Metadata, ResolvingMetadata } from 'next'
import { getResourceById } from '@/lib/db/queries'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params
  
  const localIds = ["neet-prep", "dsa-prep", "dbms-prep", "os-notes", "learn-react", "expert-express"];
  let resource: any = null;
  
  if (localIds.includes(id)) {
      const { getOurResource } = await import("@/lib/actions");
      resource = await getOurResource(id);
  } else {
      resource = await getResourceById(id);
  }

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
