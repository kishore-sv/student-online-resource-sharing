"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, FileText, UserPlus, UserCheck, MapPin, Calendar, BookOpen } from "lucide-react"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { getUserByUsername } from "@/lib/db/queries"
import { toggleFollow } from "@/lib/actions"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

export default function PublicProfilePage() {
    const { username } = useParams()
    const { data: session } = authClient.useSession()
    const [user, setUser] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isFollowing, setIsFollowing] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            if (username) {
                const data = await getUserByUsername(username as string)
                if (data) {
                    setUser(data)
                    setIsFollowing(data.followers?.some((f: any) => f.followerId === session?.user?.id))
                }
                setIsLoading(false)
            }
        }
        fetchUser()
    }, [username, session?.user?.id])

    const handleToggleFollow = async () => {
        if (!session?.user) {
            toast.error("Please login to follow users")
            return
        }
        if (session.user.id === user.id) {
            toast.error("You cannot follow yourself")
            return
        }

        // Optimistic update
        setIsFollowing(!isFollowing)
        setUser((prev: any) => ({
            ...prev,
            followers: isFollowing 
                ? prev.followers.filter((f: any) => f.followerId !== session.user.id)
                : [...(prev.followers || []), { followerId: session.user.id }]
        }))

        await toggleFollow(session.user.id, user.id)
        toast.success(isFollowing ? `Unfollowed @${user.username}` : `Followed @${user.username}`)
    }

    if (isLoading) {
        return (
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <div className="p-8 max-w-5xl mx-auto w-full space-y-8">
                        <Skeleton className="h-40 w-full rounded-2xl" />
                        <div className="flex gap-8">
                            <Skeleton className="size-24 rounded-full -mt-12 ml-8 border-4 border-background" />
                            <div className="flex-1 space-y-2 pt-4">
                                <Skeleton className="h-8 w-48" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <Skeleton className="h-64 col-span-1" />
                            <Skeleton className="h-64 col-span-2" />
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        )
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
                <FileText className="size-16 text-muted-foreground opacity-20" />
                <h1 className="text-2xl font-bold">User Not Found</h1>
                <p className="text-muted-foreground">The user @{username} doesn't exist.</p>
                <Button asChild><Link href="/search">Search Users</Link></Button>
            </div>
        )
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between border-b px-6 sticky top-0 bg-background/80 backdrop-blur-md z-30">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="h-4 mr-2" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/search">Search</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>@{user.username}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <main className="pb-20">
                    {/* Hero Header */}
                    <div className="h-48 bg-linear-to-r from-primary/10 via-primary/5 to-background border-b" />
                    
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-6 -mt-12 mb-12">
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
                                <Avatar className="size-24 md:size-32 border-4 border-background shadow-xl rounded-2xl">
                                    <AvatarImage src={user.image || ""} />
                                    <AvatarFallback className="text-3xl rounded-xl bg-primary/10 text-primary">{user.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1 mb-2">
                                    <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
                                    <p className="text-muted-foreground font-medium">@{user.username}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 mb-2">
                                {session?.user?.id !== user.id && (
                                    <Button 
                                        onClick={handleToggleFollow} 
                                        variant={isFollowing ? "outline" : "default"}
                                        className="rounded-full px-6 shadow-sm group"
                                    >
                                        {isFollowing ? (
                                            <><UserCheck className="size-4 mr-2" /> Following</>
                                        ) : (
                                            <><UserPlus className="size-4 mr-2" /> Follow</>
                                        )}
                                    </Button>
                                )}
                                {session?.user?.id === user.id && (
                                    <Button variant="outline" asChild className="rounded-full px-6">
                                        <Link href="/profile">Edit Profile</Link>
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-12 gap-8">
                            {/* Left Sidebar: About */}
                            <div className="md:col-span-4 space-y-6">
                                <Card className="rounded-2xl border-muted/60 shadow-sm overflow-hidden">
                                    <CardHeader className="bg-muted/30 border-b pb-3">
                                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80">About</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6 space-y-4">
                                        {user.collegeName && (
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                                    <MapPin className="size-4" />
                                                </div>
                                                <span className="font-medium">{user.collegeName}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                                <Calendar className="size-4" />
                                            </div>
                                            <span className="text-muted-foreground">Joined {format(new Date(user.createdAt), "MMMM yyyy")}</span>
                                        </div>
                                        <Separator className="my-4" />
                                        <div className="flex justify-between px-2">
                                            <div className="text-center">
                                                <p className="text-xl font-bold">{user.followers?.length || 0}</p>
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Followers</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xl font-bold">{user.following?.length || 0}</p>
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Following</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xl font-bold">{user.resources?.length || 0}</p>
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Posts</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Content: Resources */}
                            <div className="md:col-span-8 space-y-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <BookOpen className="size-5 text-primary" />
                                    Public Resources
                                </h2>

                                <div className="grid gap-4">
                                    {user.resources?.length > 0 ? user.resources.map((res: any) => (
                                        <Card key={res.id} className="group hover:shadow-md transition-all duration-300 border-muted/60 overflow-hidden relative">
                                            <Link href={`/resource/${res.id}`} className="absolute inset-0 z-10" />
                                            <CardContent className="p-5 flex gap-4">
                                                <div className="bg-primary/5 p-3 rounded-xl h-fit">
                                                    <FileText className="size-6 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-tighter">{res.category}</Badge>
                                                        <span className="text-[10px] text-muted-foreground">{format(new Date(res.createdAt), "MMM d, yyyy")}</span>
                                                    </div>
                                                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">{res.title}</h3>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">{res.description}</p>
                                                    
                                                    <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground font-medium">
                                                        <div className="flex items-center gap-1">
                                                            <Heart className="size-3" /> {res.likes?.length || 0}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <BookOpen className="size-3" /> {res.files?.length || 0} Files
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )) : (
                                        <div className="text-center py-20 border border-dashed rounded-2xl bg-muted/20">
                                            <FileText className="size-12 text-muted-foreground/20 mx-auto mb-4" />
                                            <p className="text-muted-foreground font-medium">No public resources shared yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
