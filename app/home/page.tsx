"use client"
import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import FileUpload from "@/components/file-upload"
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

const featuredResources = [
  {
    id: 1,
    author: "Kishore",
    authorImage: "https://avatars.githubusercontent.com/u/190291807?v=4",
    title: "Data Fetching",
    description: "Data Fetching is a process of fetching data from a data source.",
    image: "/demo-ppt.png",
    tags: ["Data Fetching", "React", "Next.js"],
    docType: "pptx",
    docUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    docSize: "10MB",
    docNumberOfPages: 29,
    likes: 10,
    comments: 5,
    shares: 2,
    createdAt: "2022-01-01",
    updatedAt: "2022-01-01",
  },
  {
    id: 2,
    author: "Mohan",
    authorImage: "https://avatars.githubusercontent.com/u/102384377?v=4",
    title: "Data Fetching",
    description: "Data Fetching is a process of fetching data from a data source.",
    image: "",
    tags: ["Data Fetching", "React", "Next.js"],
    docType: "docx",
    docUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    docSize: "10MB",
    docNumberOfPages: 29,
    likes: 10,
    comments: 5,
    shares: 2,
    createdAt: "2022-01-01",
    updatedAt: "2022-01-01",
  }, {
    id: 3,
    author: "Mohan",
    authorImage: "https://avatars.githubusercontent.com/u/102384377?v=4",
    title: "Data Fetching",
    description: "Data Fetching is a process of fetching data from a data source.",
    image: "/neo.webp",
    tags: ["Data Fetching", "React", "Next.js"],
    docType: "blog",
    docUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    docSize: "10MB",
    docNumberOfPages: 29,
    likes: 10,
    comments: 5,
    shares: 2,
    createdAt: "2022-01-01",
    updatedAt: "2022-01-01",
  },
  {
    id: 4,
    author: "Mohan",
    authorImage: "https://avatars.githubusercontent.com/u/102384377?v=4",
    title: "Data Fetching",
    description: "Data Fetching is a process of fetching data from a data source.",
    image: "/demo-ppt.png",
    tags: ["Data Fetching", "React", "Next.js"],
    docType: "doc",
    docUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    docSize: "10MB",
    docNumberOfPages: 29,
    likes: 10,
    comments: 5,
    shares: 2,
    createdAt: "2022-01-01",
    updatedAt: "2022-01-01",
  },
]

const MostPopularinEducation = [
  {
    id: 1,
    author: "Kishore",
    authorImage: "https://avatars.githubusercontent.com/u/190291807?v=4",
    title: "Data Fetching",
    description: "Data Fetching is a process of fetching data from a data source.",
    image: "/demo-ppt.png",
    tags: ["Data Fetching", "React", "Next.js"],
    docType: "pptx",
    docUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    docSize: "10MB",
    docNumberOfPages: 29,
    likes: 10,
    comments: 5,
    shares: 2,
    createdAt: "2022-01-01",
    updatedAt: "2022-01-01",
  },
  {
    id: 2,
    author: "Mohan",
    authorImage: "https://avatars.githubusercontent.com/u/102384377?v=4",
    title: "Data Fetching",
    description: "Data Fetching is a process of fetching data from a data source.",
    image: "",
    tags: ["Data Fetching", "React", "Next.js"],
    docType: "docx",
    docUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    docSize: "10MB",
    docNumberOfPages: 29,
    likes: 10,
    comments: 5,
    shares: 2,
    createdAt: "2022-01-01",
    updatedAt: "2022-01-01",
  }, {
    id: 3,
    author: "Mohan",
    authorImage: "https://avatars.githubusercontent.com/u/102384377?v=4",
    title: "Data Fetching",
    description: "Data Fetching is a process of fetching data from a data source.",
    image: "/demo-ppt.png",
    tags: ["Data Fetching", "React", "Next.js"],
    docType: "doc",
    docUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    docSize: "10MB",
    docNumberOfPages: 29,
    likes: 10,
    comments: 5,
    shares: 2,
    createdAt: "2022-01-01",
    updatedAt: "2022-01-01",
  },
  {
    id: 4,
    author: "Mohan",
    authorImage: "https://avatars.githubusercontent.com/u/102384377?v=4",
    title: "Data Fetching",
    description: "Data Fetching is a process of fetching data from a data source.",
    image: "/demo-ppt.png",
    tags: ["Data Fetching", "React", "Next.js"],
    docType: "doc",
    docUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    docSize: "10MB",
    docNumberOfPages: 29,
    likes: 10,
    comments: 5,
    shares: 2,
    createdAt: "2022-01-01",
    updatedAt: "2022-01-01",
  },
]

const AVAILABLE_TOPICS = [
  "Programming", "Mathematics", "Science", "History", "Design", "Business", "Language", "Music", "Other"
]

export default function Page() {
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

  const handleUpload = () => {
    if (!title || !description || topics.length === 0) {
      toast.error("Please fill in all fields and add at least one topic")
      return
    }
    setIsUploading(true)
    // Here logic for upload would go
    setTimeout(() => {
      toast.success("Resource uploaded successfully!")
      setIsUploading(false)
      // Reset state
      setTitle("")
      setDescription("")
      setTopics([])
    }, 1500)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="md:block">
                  <BreadcrumbLink href="/home">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {/* <BreadcrumbSeparator className="hidden md:block" /> */}
                {/* <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem> */}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <section className="flex flex-1 flex-col gap-4 p-4 pt-0 h-[40vh] max-h-[40vh] overflow-hidden mb-4">
          <div>
            <h2 className="text-2xl font-bold">New Resource</h2>
            <p className="text-muted-foreground">What&apos;s new thing you want to share?</p>
          </div>
          <div className="flex gap-2 items-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="cursor-pointer">Upload file <Upload className="ml-2 h-4 w-4" /></Button>
              </DialogTrigger>
              <DialogContent
                className="sm:max-w-xl max-h-[90vh] flex flex-col p-0 overflow-hidden"
                onInteractOutside={(e) => e.preventDefault()}
              >
                <DialogHeader className="p-6 pb-2">
                  <DialogTitle className="text-xl font-bold">Share a Resource</DialogTitle>
                  <DialogDescription>
                    Provide details about the resource to help other students find it.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g. Intro to Quantum Computing"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe what's in this resource..."
                        className="resize-none min-h-24"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Visibility</Label>
                      <Select value={visibility} onValueChange={setVisibility}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Public">Public (Everyone can view)</SelectItem>
                          <SelectItem value="Private">Private (Only you can view)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label>Topics</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {topics.map(topic => (
                          <Badge key={topic} variant="secondary" className="gap-1 px-2 py-1">
                            {topic}
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-destructive"
                              onClick={() => handleRemoveTopic(topic)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <Select onValueChange={handleAddTopic}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Add a topic..." />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_TOPICS.map(topic => (
                            <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2 border-t border-border/50 pt-4 mt-2">
                      <Label>File Upload</Label>
                      <FileUpload />
                    </div>
                  </div>
                </div>

                <DialogFooter className="p-6 pt-2 gap-2 sm:gap-0 font-bold border-t bg-muted/30">
                  <DialogClose asChild>
                    <Button variant="outline" className="cursor-pointer">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="cursor-pointer"
                  >
                    {isUploading ? "Uploading..." : "Share Resource"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Link href="/write-blog">
              <Button className="cursor-pointer">Write blog <Pencil className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
        </section>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Carousel className="w-[80vw]">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-2xl font-bold">Featured</h2>
              <div className="flex items-center gap-2">
                <CarouselPrevious className="static cursor-pointer translate-y-0 translate-x-0 h-9 w-9" />
                <CarouselNext className="static cursor-pointer translate-y-0 translate-x-0 h-9 w-9" />
              </div>
            </div>
            <CarouselContent className="-ml-4 p-2">
              {featuredResources.map(resource => (
                <CarouselItem key={resource.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <ResourceCard resource={resource} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <Button className="w-fit mx-auto cursor-pointer group">View More <ArrowRight className="size-4 group-hover:translate-x-1 transition-all duration-300" /> </Button>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Carousel className="w-[80vw]">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-2xl font-bold">Most Popular in Education</h2>
              <div className="flex items-center gap-2">
                <CarouselPrevious className="static cursor-pointer translate-y-0 translate-x-0 h-9 w-9" />
                <CarouselNext className="static cursor-pointer translate-y-0 translate-x-0 h-9 w-9" />
              </div>
            </div>
            <CarouselContent className="-ml-4 p-2">
              {MostPopularinEducation.map(resource => (
                <CarouselItem key={resource.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <ResourceCard resource={resource} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <Button className="w-fit mx-auto cursor-pointer group">View More <ArrowRight className="size-4 group-hover:translate-x-1 transition-all duration-300" /> </Button>
        </div>
      </SidebarInset>
    </SidebarProvider >
  )
}
