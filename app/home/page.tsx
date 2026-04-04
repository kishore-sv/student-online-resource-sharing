"use client"
import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { authClient } from "@/lib/auth-client"
import { getPublicResources } from "@/lib/db/queries"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Heart, FileText, Upload, Pencil } from "lucide-react"
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
import { UploadResourceDialog } from "@/components/upload-resource-dialog"

export default function Page() {
  const { data: session } = authClient.useSession()
  const [showProfilePrompt, setShowProfilePrompt] = useState(false)
  const [selectedCollege, setSelectedCollege] = useState("")
  const [username, setUsername] = useState("")
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)

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
              <Button onClick={() => setIsUploadOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload file
              </Button>
              <UploadResourceDialog open={isUploadOpen} onOpenChange={setIsUploadOpen} />
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
                <CarouselContent className="-ml-4 p-2">
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
                <CarouselContent className="-ml-4 p-2">
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
