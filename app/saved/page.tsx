"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { authClient } from "@/lib/auth-client"
import { getSavedResources } from "@/lib/db/queries"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Bookmark } from "lucide-react"
import { ResourceCard } from "@/components/resource-card"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"

import { useRouter } from "next/navigation"

export default function SavedPage() {
  const { data: session, isPending } = authClient.useSession()
  const router = useRouter()
  const [resources, setResources] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login")
      return
    }

    const fetchSaved = async () => {
      if (session?.user?.id) {
        const data = await getSavedResources(session.user.id)
        setResources(data)
        setIsLoading(false)
      }
    }
    
    if (session?.user?.id) {
      fetchSaved()
    } else if (!isPending) {
        setIsLoading(false)
    }
  }, [session?.user?.id, isPending, session, router])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/home">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Saved Resources</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Saved Resources</h2>
            <p className="text-muted-foreground text-sm">Resources you&apos;ve bookmarked for later</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-80 w-full rounded-3xl" />
              ))}
            </div>
          ) : resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource: any) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No saved resources"
              description="Bookmark resources to find them here later."
              icon={Bookmark}
              className="min-h-[400px]"
            />
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
