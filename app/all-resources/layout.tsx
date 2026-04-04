import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Explore All Resources',
  description: 'Browse through a vast collection of study materials, lecture notes, and educational blogs shared by students worldwide.',
  openGraph: {
    title: 'Explore Public Resources | StudyHub',
    description: 'Find the study materials you need from our global community.',
  }
}

export default function AllResourcesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
