"use client"

import { useState, useEffect, useCallback } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { authClient } from "@/lib/auth-client"
import { searchUsers, searchResources } from "@/lib/db/queries"
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
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Search, User as UserIcon, BookOpen, Heart, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SearchPage() {
    const { data: session } = authClient.useSession()
    const router = useRouter()
    const [query, setQuery] = useState("")
    const [userResults, setUserResults] = useState<any[]>([])
    const [resourceResults, setResourceResults] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)

    // Initial resources (mock data for the 6 MDX blogs)
    const initialResources = [
        { id: "neet-prep", title: "NEET Prep", author: { name: "StudyHub", username: "StudyHub" }, description: "Everything you need for NEET", likes: [], comments: [] },
        { id: "dsa-prep", title: "DSA Prep", author: { name: "StudyHub", username: "StudyHub" }, description: "Master coding interviews", likes: [], comments: [] },
        { id: "dbms-prep", title: "DBMS Prep", author: { name: "StudyHub", username: "StudyHub" }, description: "Master SQL and databases", likes: [], comments: [] },
        { id: "os-notes", title: "OS complete notes", author: { name: "StudyHub", username: "StudyHub" }, description: "Review core OS concepts", likes: [], comments: [] },
        { id: "learn-react", title: "Learn React", author: { name: "StudyHub", username: "StudyHub" }, description: "Build modern UIs", likes: [], comments: [] },
        { id: "expert-express", title: "Expert Express", author: { name: "StudyHub", username: "StudyHub" }, description: "Master Node and Express", likes: [], comments: [] },
    ]

    const handleSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setUserResults([])
            setResourceResults([])
            return
        }
        setIsSearching(true)
        try {
            const [users, resources] = await Promise.all([
                searchUsers(searchQuery),
                searchResources(searchQuery, session?.user?.id)
            ])
            setUserResults(users)
            setResourceResults(resources)
        } catch (error) {
            console.error("Search failed:", error)
        } finally {
            setIsSearching(false)
        }
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch(query)
        }, 300)
        return () => clearTimeout(timer)
    }, [query, handleSearch])

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
                                <BreadcrumbPage>Search</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>

                <main className="p-6 max-w-4xl mx-auto w-full space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight">Explore</h1>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                            <Input
                                placeholder="Search users, notes, blogs..."
                                className="pl-10 h-12 text-lg rounded-xl"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <Tabs defaultValue="resources" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8 h-12 p-1.5 bg-muted/50 rounded-xl">
                            <TabsTrigger value="resources" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                <BookOpen className="size-4 mr-2" /> Resources
                            </TabsTrigger>
                            <TabsTrigger value="users" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                <UserIcon className="size-4 mr-2" /> Users
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="resources" className="space-y-4">
                            {!query && (
                                <div className="space-y-4">
                                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recommended by StudyHub</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {initialResources.map((res) => (
                                            <ResourceCard key={res.id} resource={res} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {query && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {resourceResults.length > 0 ? (
                                        resourceResults.map((res) => (
                                            <ResourceCard key={res.id} resource={res} />
                                        ))
                                    ) : !isSearching && (
                                        <p className="text-center text-muted-foreground col-span-2 py-12">No resources found matching "{query}"</p>
                                    )}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="users" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {userResults.length > 0 ? (
                                    userResults.map((user) => (
                                        <UserCard key={user.id} user={user} />
                                    ))
                                ) : query && !isSearching ? (
                                    <p className="text-center text-muted-foreground col-span-2 py-12">No users found matching "{query}"</p>
                                ) : !query && (
                                    <p className="text-center text-muted-foreground col-span-2 py-12">Start searching for users...</p>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

function ResourceCard({ resource }: { resource: any }) {
    return (
        <Card className="group hover:shadow-lg transition-all duration-300 border-muted/60 overflow-hidden cursor-pointer relative">
            <Link href={`/resource/${resource.id}`} className="absolute inset-0 z-10" />
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                    <Avatar className="size-6">
                        <AvatarImage src={resource.author.image || ""} />
                        <AvatarFallback>{resource.author.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground font-medium">@{resource.author.username}</span>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">{resource.title}</CardTitle>
                <CardDescription className="line-clamp-2">{resource.description || "No description provided."}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Heart className="size-3" /> {resource.likes?.length || 0}
                    </div>
                    <div className="flex items-center gap-1">
                        <MessageSquare className="size-3" /> {resource.comments?.length || 0}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function UserCard({ user }: { user: any }) {
    return (
        <Card className="hover:shadow-md transition-all duration-200 border-muted/60 cursor-pointer relative group">
            <Link href={`/profile/${user.username}`} className="absolute inset-0 z-10" />
            <CardContent className="p-4 flex items-center gap-4">
                <Avatar className="size-12">
                    <AvatarImage src={user.image || ""} />
                    <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                    {user.collegeName && (
                        <p className="text-xs text-primary mt-1">{user.collegeName}</p>
                    )}
                </div>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">View</Button>
            </CardContent>
        </Card>
    )
}
