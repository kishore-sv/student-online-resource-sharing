"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ResourceCard } from "@/components/resource-card"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Search, Filter, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import { getResourcesByUser } from "@/lib/db/queries"
import { authClient } from "@/lib/auth-client"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"

export default function ResourcesPage() {
    const { user: usernameParam } = useParams()
    const { data: session } = authClient.useSession()
    const [resources, setResources] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    const username = typeof usernameParam === 'string' ? usernameParam : usernameParam?.[0]
    const isOwnProfile = session?.user?.username === username

    useEffect(() => {
        const fetchResources = async () => {
            if (username) {
                const data = await getResourcesByUser(username)
                setResources(data)
                setIsLoading(false)
            }
        }
        fetchResources()
    }, [username])

    const filteredResources = resources.filter(res =>
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-6">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{isOwnProfile ? "Your Resources" : `@${username}'s Resources`}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-6 md:p-10 pt-6">
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-1.5 text-center md:text-left">
                                <h1 className="text-4xl font-extrabold tracking-tight">
                                    {isOwnProfile ? "Your Resources" : `@${username}'s Resources`}
                                </h1>
                                <p className="text-muted-foreground font-medium">
                                    {isOwnProfile
                                        ? "Manage and organize all your shared documents and study materials."
                                        : `Browse all resources shared by @${username}.`}
                                </p>
                            </div>

                            {isOwnProfile && (
                                <Button className="rounded-xl cursor-pointer h-11 px-8 transition-all hover:shadow-xl hover:shadow-primary/20 shadow-md group" asChild>
                                    <a href="/home">
                                        <Plus className="size-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                                        Share New Resource
                                    </a>
                                </Button>
                            )}
                        </div>

                        <div className="flex items-center gap-3 w-full max-w-md mx-auto md:mx-0">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search resources..."
                                    className="pl-10 h-11 rounded-xl bg-background border-muted shadow-sm focus-visible:ring-primary"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="icon" className="h-11 w-11 cursor-pointer rounded-lg shadow-sm">
                                <Filter className="size-4" />
                            </Button>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, i) => (
                                    <Skeleton key={i} className="h-72 w-full rounded-2xl shadow-sm" />
                                ))}
                            </div>
                        ) : filteredResources.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
                                {filteredResources.map(resource => (
                                    <ResourceCard key={resource.id} resource={resource} />
                                ))}
                            </div>
                        ) : (
                            <Card className="border-none bg-muted/20 shadow-none rounded-[2rem] overflow-hidden group max-w-3xl mx-auto w-full mt-10">
                                <CardContent className="flex flex-col items-center justify-center py-20 text-center px-10">
                                    <div className="rounded-full bg-background border-8 border-muted p-8 mb-8 transition-all group-hover:scale-110 group-hover:rotate-12 duration-500 shadow-sm">
                                        <FileText className="h-14 w-14 text-muted-foreground/50" />
                                    </div>
                                    <h3 className="text-2xl font-black mb-3">No resources found</h3>
                                    <p className="text-muted-foreground max-w-sm mx-auto mb-10 leading-relaxed font-medium">
                                        {searchQuery
                                            ? `We couldn't find any resources matching "${searchQuery}".`
                                            : isOwnProfile
                                                ? "You haven't shared anything yet. Help your fellow students by uploading your study materials!"
                                                : `@${username} hasn't shared any resources yet.`}
                                    </p>
                                    {isOwnProfile && (
                                        <Button className="rounded-lg cursor-pointer h-14 px-10 text-lg font-bold transition-all hover:scale-105 shadow-xl hover:shadow-primary/30" asChild>
                                            <a href="/home">Start Sharing Now</a>
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}