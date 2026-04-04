"use client"
import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { ResourceCard } from "@/components/resource-card"
import { getPublicResources } from "@/lib/db/queries"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CATEGORIES = ["All", "Education", "OS", "DBMS", "Java", "Python", "Mathematics", "Science", "Design"]

export default function AllResourcesPage() {
    const [resources, setResources] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [activeCategory, setActiveCategory] = useState("All")

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true)
            const data = await getPublicResources(50)
            setResources(data)
            setLoading(false)
        }
        fetchAll()
    }, [])

    const filtered = resources.filter(res => {
        const matchesSearch = res.title.toLowerCase().includes(search.toLowerCase()) || 
                             res.description?.toLowerCase().includes(search.toLowerCase())
        const matchesCategory = activeCategory === "All" || 
                               res.tags?.some((t: string) => t.toLowerCase() === activeCategory.toLowerCase())
        return matchesSearch && matchesCategory
    })

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
                                    <BreadcrumbPage>Explore Resources</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <main className="flex-1 overflow-auto bg-muted/10 p-6 md:p-10">
                    <div className="mx-auto max-w-7xl flex flex-col gap-8">
                        
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-2">
                                <h1 className="text-4xl font-extrabold tracking-tight">Public Resources</h1>
                                <p className="text-muted-foreground font-medium">Browse through thousands of study materials shared by students worldwide.</p>
                            </div>
                            
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative flex-1 md:w-80">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input 
                                        placeholder="Search by title or topic..." 
                                        className="pl-10 h-11 rounded-xl bg-background border-muted shadow-sm"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <Select defaultValue="recent">
                                    <SelectTrigger className="w-40 h-11 rounded-xl shadow-sm">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="recent">Most Recent</SelectItem>
                                        <SelectItem value="popular">Most Popular</SelectItem>
                                        <SelectItem value="likes">Most Liked</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Categories Bar */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
                            {CATEGORIES.map(cat => (
                                <Badge 
                                    key={cat} 
                                    variant={activeCategory === cat ? "default" : "outline"}
                                    onClick={() => setActiveCategory(cat)}
                                    className="cursor-pointer px-5 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95"
                                >
                                    {cat}
                                </Badge>
                            ))}
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />
                                ))}
                            </div>
                        ) : filtered.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filtered.map(resource => (
                                    <ResourceCard key={resource.id} resource={resource} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                                <div className="size-16 rounded-full bg-muted flex items-center justify-center">
                                    <Search className="size-8 text-muted-foreground opacity-50" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">No resources found</h3>
                                    <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
