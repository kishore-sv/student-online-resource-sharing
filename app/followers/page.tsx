"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { authClient } from "@/lib/auth-client"
import { getFollowers, getFollowing } from "@/lib/db/queries"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Users, UserPlus, UserCheck } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export default function FollowersPage() {
    const { data: session } = authClient.useSession()
    const [followers, setFollowers] = useState<any[]>([])
    const [following, setFollowing] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            if (session?.user?.id) {
                try {
                    const [followersData, followingData] = await Promise.all([
                        getFollowers(session.user.id),
                        getFollowing(session.user.id)
                    ])
                    setFollowers(followersData)
                    setFollowing(followingData)
                } catch (error) {
                    console.error("Failed to fetch followers:", error)
                } finally {
                    setIsLoading(false)
                }
            }
        }
        fetchData()
    }, [session])

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
                                <BreadcrumbPage>Followers</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>

                <main className="p-6 max-w-4xl mx-auto w-full space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight">Community</h1>
                        <p className="text-muted-foreground text-lg">See who is following you and who you are following.</p>
                    </div>

                    <Tabs defaultValue="followers" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8 h-12 p-1.5 bg-muted/50 rounded-xl">
                            <TabsTrigger value="followers" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300">
                                <Users className="size-4 mr-2" /> Followers ({followers.length})
                            </TabsTrigger>
                            <TabsTrigger value="following" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300">
                                <UserPlus className="size-4 mr-2" /> Following ({following.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="followers" className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {isLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[...Array(4)].map((_, i) => (
                                        <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                                    ))}
                                </div>
                            ) : followers.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {followers.map((user) => (
                                        <UserCard key={user.id} user={user} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="bg-muted size-16 rounded-3xl flex items-center justify-center mb-4">
                                        <Users className="size-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-xl font-semibold">No followers yet</h3>
                                    <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                                        Share more resources to grow your audience in the community!
                                    </p>
                                    <Button variant="outline" className="mt-6 rounded-xl" asChild>
                                        <Link href="/home">Share Resource</Link>
                                    </Button>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="following" className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {isLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[...Array(4)].map((_, i) => (
                                        <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                                    ))}
                                </div>
                            ) : following.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {following.map((user) => (
                                        <UserCard key={user.id} user={user} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="bg-muted size-16 rounded-3xl flex items-center justify-center mb-4">
                                        <UserPlus className="size-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-xl font-semibold">Not following anyone</h3>
                                    <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                                        Explore our community and find experts to follow!
                                    </p>
                                    <Button className="mt-6 rounded-xl" asChild>
                                        <Link href="/search">Explore Users</Link>
                                    </Button>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

function UserCard({ user }: { user: any }) {
    return (
        <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-muted/60 cursor-pointer relative overflow-hidden rounded-2xl">
            <Link href={`/${user.username}/profile`} className="absolute inset-0 z-10" />
            <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-4 flex items-center gap-4 relative z-20">
                <Avatar className="size-14 border-2 border-background shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <AvatarImage src={user.image || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {user.name?.[0] || user.username?.[0] || "?"}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors truncate">{user.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        @{user.username}
                        <UserCheck className="size-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                    {user.collegeName && (
                        <p className="text-xs text-primary/80 mt-1 font-medium truncate">{user.collegeName}</p>
                    )}
                </div>
                <Button size="sm" variant="secondary" className="rounded-xl px-4 h-9 font-medium transition-all group-hover:bg-primary cursor-pointer">
                    View
                </Button>
            </CardContent>
        </Card>
    )
}
