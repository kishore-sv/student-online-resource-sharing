"use client"
import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import FileUpload from "@/components/file-upload"
import { authClient } from "@/lib/auth-client"
import { createResource } from "@/lib/actions"
import { getPublicResources } from "@/lib/db/queries"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X } from "lucide-react"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowRight, Dot, Heart, MessageSquare, Share2, FileText, Download, Save, SaveAllIcon, Bookmark, Upload, Pencil } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { ResourceCard } from "@/components/resource-card"
import { EmptyState } from "@/components/ui/empty-state"

const AVAILABLE_TOPICS = [
  "Programming", "Mathematics", "Science", "History", "Design", "Business", "Language", "Music", "Other"
]

export default function Page() {
  const { data: session } = authClient.useSession()
  const [showProfilePrompt, setShowProfilePrompt] = useState(false)
  const [selectedCollege, setSelectedCollege] = useState("")
  const [username, setUsername] = useState("")
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [topics, setTopics] = useState<string[]>([])
  const [visibility, setVisibility] = useState("Public")
  const [isUploading, setIsUploading] = useState(false)

  const handleAddTopic = (topic: string) => {
    if (!topics.includes(topic)) {
      setTopics([...topics, topic])
    }
  }

  const handleRemoveTopic = (topic: string) => {
    setTopics(topics.filter((t: string) => t !== topic))
  }

  const [featured, setFeatured] = useState<any[]>([])
  const [popular, setPopular] = useState<any[]>([])

  useEffect(() => {
    if (session?.user && (!session.user.collegeName || !session.user.username)) {
      setShowProfilePrompt(true)
    }

    // Fetch real resources
    const fetchResources = async () => {
      const data = await getPublicResources(20)
      setFeatured(data.slice(0, 10))
      setPopular(data.slice(10, 20))
    }
    fetchResources()
  }, [session])

  const handleProfileUpdate = async () => {
    if (!selectedCollege || !username) {
      toast.error("Please fill in all fields")
      return
    }

    if (username.length < 3) {
      toast.error("Username too short")
      return
    }

    setIsUpdatingProfile(true)
    const { error } = await authClient.updateUser({
      collegeName: selectedCollege,
      username: username.toLowerCase().replace(/\s+/g, ""),
    })
    setIsUpdatingProfile(false)
    if (!error) {
      setShowProfilePrompt(false)
      toast.success("Profile saved!")
    } else {
      toast.error(error.message || "Failed to update profile")
    }
  }

  const handleUpload = async () => {
    if (!title || topics.length === 0) {
      toast.error("Please fill in all required fields")
      return
    }
    if (!session?.user) return

    setIsUploading(true)
    const { error }: any = await createResource({
      title,
      description,
      category: "file",
      visibility: visibility.toLowerCase() as any,
      authorId: session.user.id,
      tags: topics
    })

    setIsUploading(false)
    if (!error) {
      toast.success("Resource shared!")
      setTitle("")
      setDescription("")
      setTopics([])
    } else {
      toast.error(error.message || "Failed to share")
    }
  }

  return (
    <>
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
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <section className="p-6 pb-2 space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">New Resource</h2>
              <p className="text-muted-foreground text-sm">Share knowledge with your community</p>
            </div>
            <div className="flex gap-3 items-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload file
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Share File</DialogTitle>
                    <DialogDescription>
                      Fill in the details below to upload your resource.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Resource title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="What is this about?"
                        className="min-h-[100px]"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Visibility</Label>
                        <Select value={visibility} onValueChange={setVisibility}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Public">Public</SelectItem>
                            <SelectItem value="Private">Private</SelectItem>
                            <SelectItem value="Shared">Friends</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 text-right">
                        <Label>File Upload</Label>
                        <FileUpload />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Topics</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {topics.map(topic => (
                          <Badge key={topic} variant="secondary" className="gap-1">
                            {topic}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => handleRemoveTopic(topic)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <Select onValueChange={handleAddTopic}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select topic" />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_TOPICS.map(topic => (
                            <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleUpload} disabled={isUploading}>
                      {isUploading ? "Uploading..." : "Publish"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Link href="/write-blog">
                <Button variant="outline">
                  <Pencil className="mr-2 h-4 w-4" />
                  Write blog
                </Button>
              </Link>
            </div>
          </section>

          <Separator className="mx-6 w-auto" />

          <div className="p-6 space-y-12">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Featured</h2>
                <div className="flex items-center gap-2">
                  <Link href="/all-resources" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    View all
                  </Link>
                </div>
              </div>

              <Carousel className="w-full">
                <CarouselContent className="-ml-4">
                  {featured.length > 0 ? featured.map(resource => (
                    <CarouselItem key={resource.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                      <ResourceCard resource={resource} />
                    </CarouselItem>
                  )) : (
                    <div className="w-full px-4">
                      <EmptyState
                        title="No resources found"
                        description="No featured resources available yet."
                        icon={FileText}
                        className="min-h-[300px]"
                      />
                    </div>
                  )}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-4 bg-background shadow-md border-border" />
                <CarouselNext className="hidden md:flex -right-4 bg-background shadow-md border-border" />
              </Carousel>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Popular in Education</h2>
                <Link href="/all-resources?category=education" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  View all
                </Link>
              </div>

              <Carousel className="w-full">
                <CarouselContent className="-ml-4">
                  {popular.length > 0 ? popular.map(resource => (
                    <CarouselItem key={resource.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                      <ResourceCard resource={resource} />
                    </CarouselItem>
                  )) : (
                    <div className="w-full px-4">
                      <EmptyState
                        title="No trending resources"
                        description="Be first to share something trending."
                        icon={Heart}
                        className="min-h-[300px]"
                      />
                    </div>
                  )}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-4 bg-background shadow-md border-border" />
                <CarouselNext className="hidden md:flex -right-4 bg-background shadow-md border-border" />
              </Carousel>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider >

      {/* Profile Prompt for new social signups */}
      <Dialog open={showProfilePrompt} onOpenChange={() => { }}>
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()} className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Profile Information</DialogTitle>
            <DialogDescription>
              Please provide your details before you start.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <span className="absolute left-3 top-1.5 text-muted-foreground text-sm">@</span>
                <Input
                  id="username"
                  className="pl-8"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="college">College Name</Label>
              <Select onValueChange={setSelectedCollege}>
                <SelectTrigger id="college">
                  <SelectValue placeholder="Select institution" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Presidency University">Presidency University</SelectItem>
                  <SelectItem value="RV University">RV University</SelectItem>
                  <SelectItem value="REVA University">REVA University</SelectItem>
                  <SelectItem value="BMSCE">BMSCE</SelectItem>
                  <SelectItem value="PES University">PES University</SelectItem>
                  <SelectItem value="MSRIT">MSRIT</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="default"
              onClick={handleProfileUpdate}
              disabled={isUpdatingProfile}
              className="w-full"
            >
              {isUpdatingProfile ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
