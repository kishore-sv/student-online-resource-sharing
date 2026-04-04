import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Discover Resources',
  description: 'Explore the latest study notes, lecture slides, and student blogs on StudyHub.',
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
