"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Pencil, User as UserIcon, FileText, ArrowRight } from "lucide-react"
import { ResourceCard } from "@/components/resource-card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { toast } from "sonner"

// Mock Profile Data based on DB schema
const initialProfile = {
    name: "Kishore",
    email: "kishore@presidency.edu.in",
    collegeName: "Presidency University",
    role: "student",
    image: "https://avatars.githubusercontent.com/u/190291807?v=4",
    createdAt: "2024-01-15T00:00:00.000Z"
}

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
    }
]

export default function ProfilePage() {
    const [profile, setProfile] = useState(initialProfile)
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState(profile)

    const handleSave = () => {
        setProfile(editForm)
        setIsEditing(false)
        toast.success("Profile updated successfully!")
    }

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
                                    <BreadcrumbPage>Profile</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-4 md:p-8 pt-0">
                    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
                            <p className="text-muted-foreground">Manage your personal information and view your shared resources.</p>
                        </div>

                        <div className="flex flex-col gap-8">
                            {/* Profile Details Card - Full Width */}
                            <Card className="w-full">
                                <div className="flex flex-col md:flex-row items-center md:items-start p-6 gap-6 lg:gap-8">
                                    <div className="relative shrink-0">
                                        <Avatar className="h-32 w-32 border-4 border-background shadow-sm">
                                            <AvatarImage src={profile.image} alt={profile.name} />
                                            <AvatarFallback className="text-4xl"><UserIcon className="h-14 w-14" /></AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <div className="flex-1 flex flex-col md:flex-row justify-between items-center md:items-start w-full gap-6">
                                        <div className="space-y-4 text-center md:text-left flex-1 w-full">
                                            <div>
                                                <CardTitle className="text-3xl mb-1">{profile.name}</CardTitle>
                                                <CardDescription className="uppercase tracking-wider text-xs font-bold text-primary">{profile.role}</CardDescription>
                                            </div>

                                            <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-8 bg-muted/30 p-4 rounded-lg w-full">
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-muted-foreground block text-center md:text-left">Email Address</Label>
                                                    <p className="text-sm font-medium">{profile.email}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-muted-foreground block text-center md:text-left">College / University</Label>
                                                    <p className="text-sm font-medium">{profile.collegeName}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-muted-foreground block text-center md:text-left">Member Since</Label>
                                                    <p className="text-sm font-medium">{new Date(profile.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="shrink-0 w-full md:w-auto">
                                            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                                                <DialogTrigger asChild>
                                                    <Button className="w-full cursor-pointer" variant="outline">
                                                        <Pencil className="mr-2 h-4 w-4" /> Edit Profile
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Edit profile</DialogTitle>
                                                        <DialogDescription>
                                                            Make changes to your profile here. Click save when you're done.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="name">Name</Label>
                                                            <Input
                                                                id="name"
                                                                value={editForm.name}
                                                                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                                            />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="college">College / University</Label>
                                                            <Input
                                                                id="college"
                                                                value={editForm.collegeName}
                                                                onChange={(e) => setEditForm(prev => ({ ...prev, collegeName: e.target.value }))}
                                                            />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="image">Profile Image URL</Label>
                                                            <Input
                                                                id="image"
                                                                value={editForm.image}
                                                                onChange={(e) => setEditForm(prev => ({ ...prev, image: e.target.value }))}
                                                            />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button variant="outline" onClick={() => setIsEditing(false)} className="cursor-pointer">Cancel</Button>
                                                        <Button onClick={handleSave} className="cursor-pointer">Save changes</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Resources Carousel Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold">Your Resources</h2>
                                        <p className="text-muted-foreground text-sm">Resources you have shared with the community</p>
                                    </div>
                                </div>

                                {userResources.length > 0 ? (
                                    <Carousel className="w-full">
                                        <div className="flex justify-end gap-2 mb-2">
                                            <CarouselPrevious className="static cursor-pointer translate-y-0 translate-x-0 h-9 w-9" />
                                            <CarouselNext className="static cursor-pointer translate-y-0 translate-x-0 h-9 w-9" />
                                        </div>
                                        <CarouselContent className="-ml-4 p-2">
                                            {userResources.map(resource => (
                                                <CarouselItem key={resource.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                                    <ResourceCard resource={resource} />
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                    </Carousel>
                                ) : (
                                    <Card className="border-dashed shadow-none">
                                        <CardContent className="flex flex-col items-center justify-center h-48 text-center px-6">
                                            <div className="rounded-full bg-muted p-3 mb-4">
                                                <FileText className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                            <p className="font-medium">No resources shared yet</p>
                                            <p className="text-sm text-muted-foreground mt-1 mb-4">You haven't uploaded any documents or study materials.</p>
                                            <Button variant="outline" className="cursor-pointer" asChild>
                                                <a href="/home">Share a Resource</a>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}