"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Pencil, User as UserIcon, FileText, ArrowRight, Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useDropzone } from "react-dropzone"
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
import { authClient } from "@/lib/auth-client"
import { updateUser, uploadBlogThumbnail } from "@/lib/actions"
import { getResourcesByUser, getUserByUsername } from "@/lib/db/queries"
import { toast } from "sonner"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

// Mock Profile Data based on DB schema
const initialProfile = {
    name: "Kishore",
    email: "kishore@presidency.edu.in",
    collegeName: "Presidency University",
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
    const { user: usernameParam } = useParams()
    const { data: session } = authClient.useSession()
    const [isEditing, setIsEditing] = useState(false)
    const [resources, setResources] = useState<any[]>([])
    const [targetProfile, setTargetProfile] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [editForm, setEditForm] = useState({
        name: "",
        username: "",
        collegeName: "",
        image: ""
    })

    useEffect(() => {
        if (session?.user) {
            setEditForm({
                name: session.user.name || "",
                username: session.user.username || "",
                collegeName: session.user.collegeName || "",
                image: session.user.image || ""
            })
        }
    }, [session])

    useEffect(() => {
        const fetchAll = async () => {
            if (usernameParam) {
                const usernameStr = typeof usernameParam === 'string' ? usernameParam : usernameParam?.[0]
                const [userData, resData] = await Promise.all([
                    getUserByUsername(usernameStr),
                    getResourcesByUser(usernameStr)
                ])
                setTargetProfile(userData)
                setResources(resData)
                setIsLoading(false)
            }
        }
        fetchAll()
    }, [usernameParam])

    useEffect(() => {
        if (targetProfile) {
            setEditForm({
                name: targetProfile.name || "",
                username: targetProfile.username || "",
                collegeName: targetProfile.collegeName || "",
                image: targetProfile.image || ""
            })
        }
    }, [targetProfile])

    const handleFileChange = (files: File[]) => {
        if (files.length > 0) {
            const file = files[0];
            
            // Check file size (2MB limit)
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image must be smaller than 2MB");
                return;
            }

            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleFileChange,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        multiple: false
    })

    const handleSave = async () => {
        if (!session?.user?.id) return

        setIsLoading(true)
        try {
            let imageUrl = editForm.image;
            
            if (previewImage && selectedFile) {
                // Use FormData to avoid Maximum array nesting exceeded error for large strings
                const formData = new FormData();
                formData.append("image", previewImage);
                formData.append("name", `profile-${session.user.id}-${Date.now()}`);
                const uploadedUrl = await uploadBlogThumbnail(formData);
                if (uploadedUrl) imageUrl = uploadedUrl;
            }

            const finalData = { ...editForm, image: imageUrl };
            await updateUser(session.user.id, finalData)
            setTargetProfile((prev: any) => ({ ...prev, ...finalData }))
            setIsEditing(false)
            setSelectedFile(null)
            setPreviewImage(null)
            toast.success("Profile updated successfully!")
        } catch (error) {
            toast.error("Failed to update profile")
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading && !session?.user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Skeleton className="h-32 w-32 rounded-full" />
            </div>
        )
    }

    const usernameParamStr = typeof usernameParam === 'string' ? usernameParam : usernameParam?.[0]
    const isOwnProfile = session?.user?.username === usernameParamStr
    const profile = targetProfile || { name: usernameParamStr, username: usernameParamStr, image: "", email: "", collegeName: "", createdAt: new Date() }

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
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-muted-foreground">@{profile.username}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-8 bg-muted/30 p-4 rounded-lg w-full">
                                                <div className="space-y-1 overflow-hidden">
                                                    <Label className="text-xs text-muted-foreground block text-center md:text-left">Email Address</Label>
                                                    <p className="text-sm font-medium truncate">{profile.email || 'N/A'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-muted-foreground block text-center md:text-left">College / University</Label>
                                                    <p className="text-sm font-medium">{profile.collegeName || 'N/A'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-muted-foreground block text-center md:text-left">Member Since</Label>
                                                    <p className="text-sm font-medium">{new Date((profile as any).createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {isOwnProfile && (
                                            <div className="shrink-0 w-full md:w-auto">
                                                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                                                    <DialogTrigger asChild>
                                                        <Button className="w-full cursor-pointer transition-all hover:shadow-lg" variant="outline">
                                                            <Pencil className="mr-2 h-4 w-4" /> Edit Profile
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[425px] rounded-2xl">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
                                                            <DialogDescription>
                                                                Update your personal details here.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="grid gap-6 py-6 h-[400px] overflow-y-auto pr-2">
                                                            <div className="flex flex-col items-center gap-4 mb-4">
                                                                <Avatar className="h-24 w-24 border-2 border-primary/20">
                                                                    <AvatarImage src={previewImage || editForm.image} />
                                                                    <AvatarFallback><UserIcon /></AvatarFallback>
                                                                </Avatar>
                                                                <div className="w-full">
                                                                    <Label className="text-xs font-bold mb-2 block text-center">Change Profile Picture</Label>
                                                                    <div 
                                                                        {...getRootProps()} 
                                                                        className={cn(
                                                                            "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors",
                                                                            isDragActive ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50 bg-muted/20"
                                                                        )}
                                                                    >
                                                                        <input {...getInputProps()} />
                                                                        <div className="flex flex-col items-center gap-2">
                                                                            <Upload className="h-4 w-4 text-muted-foreground" />
                                                                            <p className="text-xs text-muted-foreground">
                                                                                {isDragActive ? "Drop it here!" : "Drag 'n' drop, or click to select"}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label htmlFor="name" className="text-sm font-semibold">Display Name</Label>
                                                                <Input
                                                                    id="name"
                                                                    value={editForm.name}
                                                                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="username" className="text-sm font-semibold">Username</Label>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">@</span>
                                                                    <Input
                                                                        id="username"
                                                                        className="pl-8"
                                                                        value={editForm.username}
                                                                        onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/\s+/g, "") }))}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="college" className="text-sm font-semibold">College / University</Label>
                                                                <Input
                                                                    id="college"
                                                                    value={editForm.collegeName}
                                                                    onChange={(e) => setEditForm(prev => ({ ...prev, collegeName: e.target.value }))}
                                                                />
                                                            </div>
                                                        </div>
                                                        <DialogFooter className="gap-3">
                                                            <Button variant="ghost" onClick={() => setIsEditing(false)} className="cursor-pointer rounded-xl grow">Cancel</Button>
                                                            <Button onClick={handleSave} className="cursor-pointer rounded-xl grow transition-all hover:scale-[1.02]">Save Changes</Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        )}
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

                                {isLoading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)}
                                    </div>
                                ) : resources.length > 0 ? (
                                    <Carousel className="w-full">
                                        <div className="flex justify-end gap-2 mb-2">
                                            <CarouselPrevious className="static cursor-pointer translate-y-0 translate-x-0 h-9 w-9" />
                                            <CarouselNext className="static cursor-pointer translate-y-0 translate-x-0 h-9 w-9" />
                                        </div>
                                        <CarouselContent className="-ml-4 p-2">
                                            {resources.map(res => (
                                                <CarouselItem key={res.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                                    <ResourceCard resource={res} />
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                    </Carousel>
                                ) : (
                                    <Card className="border-none bg-muted/20 shadow-none rounded-3xl overflow-hidden group">
                                        <CardContent className="flex flex-col items-center justify-center py-16 text-center px-6">
                                            <div className="rounded-full bg-background border-4 border-muted p-6 mb-6 transition-transform group-hover:scale-110 duration-500">
                                                <FileText className="h-10 w-10 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">No resources shared yet</h3>
                                            <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-8 leading-relaxed">
                                                {isOwnProfile
                                                    ? "Start by uploading your first document, PPT, or writing a blog post to help other students!"
                                                    : `It looks like @${usernameParam} hasn't shared any resources yet.`}
                                            </p>
                                            {isOwnProfile && (
                                                <Button className="cursor-pointer rounded-xl h-11 px-8 transition-all hover:shadow-xl hover:shadow-primary/20" asChild>
                                                    <a href="/home">Share Your First Resource</a>
                                                </Button>
                                            )}
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