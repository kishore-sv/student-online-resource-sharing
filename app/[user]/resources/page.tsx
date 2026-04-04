"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { ResourceCard } from "@/components/resource-card"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock User Resources
const userResources = [
    {
        id: 1,
        author: "Kishore",
        authorImage: "https://avatars.githubusercontent.com/u/190291807?v=4",
        title: "Data Fetching in React",
        description: "A comprehensive guide to fetching data safely in React and Next.js.",
        image: "/demo-ppt.png",
        tags: ["Data Fetching", "React", "Next.js"],
        docType: "pptx",
        docUrl: "#",
        docSize: "10MB",
        docNumberOfPages: 29,
        likes: 42,
        comments: 12,
        shares: 8,
        createdAt: "2024-03-20",
        updatedAt: "2024-03-20",
    },
    {
        id: 2,
        author: "Kishore",
        authorImage: "https://avatars.githubusercontent.com/u/190291807?v=4",
        title: "DSA Graph Algorithms",
        description: "Notes on shortest path algorithms: Dijkstra, Bellman-Ford, and Floyd-Warshall.",
        image: "",
        tags: ["DSA", "Graphs", "CS"],
        docType: "pdf",
        docUrl: "#",
        docSize: "5MB",
        docNumberOfPages: 14,
        likes: 85,
        comments: 24,
        shares: 31,
        createdAt: "2024-02-15",
        updatedAt: "2024-02-15",
    },
    {
        id: 3,
        author: "Kishore",
        authorImage: "https://avatars.githubusercontent.com/u/190291807?v=4",
        title: "DBMS Entity Relationship",
        description: "Detailed study material for ER diagrams and database normalization.",
        image: "",
        tags: ["DBMS", "Database"],
        docType: "docx",
        docUrl: "#",
        docSize: "2MB",
        docNumberOfPages: 8,
        likes: 21,
        comments: 5,
        shares: 12,
        createdAt: "2024-01-10",
        updatedAt: "2024-01-10",
    }
]

export default function ResourcesPage() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Your Resources</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-4 md:p-8 pt-0">
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl font-bold tracking-tight">Your Resources</h1>
                            <p className="text-muted-foreground">Browse all the study materials and documents you have shared.</p>
                        </div>

                        {userResources.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                                {userResources.map(resource => (
                                    <ResourceCard key={resource.id} resource={resource} />
                                ))}
                            </div>
                        ) : (
                            <Card className="border-dashed shadow-none max-w-2xl mx-auto w-full mt-8">
                                <CardContent className="flex flex-col items-center justify-center h-64 text-center px-6">
                                    <div className="rounded-full bg-muted p-4 mb-4">
                                        <FileText className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <p className="font-medium text-lg">No resources shared yet</p>
                                    <p className="text-sm text-muted-foreground mt-2 mb-6 max-w-sm">
                                        You haven't uploaded any documents or study materials. Share your knowledge with the community!
                                    </p>
                                    <Button className="cursor-pointer" asChild>
                                        <a href="/home">Upload a Resource</a>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}