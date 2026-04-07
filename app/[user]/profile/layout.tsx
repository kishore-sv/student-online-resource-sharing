import { Metadata, ResolvingMetadata } from 'next'
import { getUserByUsername } from '@/lib/db/queries'

type Props = {
  params: Promise<{ user: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { user: username } = await params
  const user = await getUserByUsername(username)

  if (!user) {
    return {
      title: 'User Not Found',
    }
  }

  const images = (await parent).openGraph?.images || []

  return {
    title: `${user.name} (@${user.username})`,
    description: `Check out educational resources shared by ${user.name} on StudyHub.`,
    openGraph: {
      title: `${user.name} on StudyHub`,
      description: `View ${user.name}'s profile and shared learning resources.`,
      images: [user.image || '/og-image.png', ...images],
    },
    twitter: {
        card: 'summary',
        title: `${user.name} on StudyHub`,
        description: `View ${user.name}'s profile and shared learning resources.`,
        images: [user.image || '/og-image.png'],
    }
  }
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
