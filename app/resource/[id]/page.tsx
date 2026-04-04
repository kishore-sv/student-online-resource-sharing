"use client"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, Share2, Bookmark, FileText, Globe, Lock, Trash } from "lucide-react"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { getResourceById } from "@/lib/db/queries"
import { toggleLike, postComment, deleteResource, toggleSave } from "@/lib/actions"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { IconDownload, IconFileText } from "@tabler/icons-react"

export default function SingleResourcePage() {
    const { id } = useParams()
    const router = useRouter()
    const { data: session } = authClient.useSession()

    const [newComment, setNewComment] = useState("")
    const [resource, setResource] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [liked, setLiked] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        const fetchResource = async () => {
            if (id) {
                const data = await getResourceById(id as string)
                if (data) {
                    setResource(data)
                    setLiked(data.likes?.some((l: any) => l.authorId === session?.user?.id))
                    setSaved(data.savedResources?.some((s: any) => s.userId === session?.user?.id))
                }
                setIsLoading(false)
            }
        }
        fetchResource()
    }, [id, session?.user?.id])

    if (isLoading) {
        return (
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto w-full">
                        <Skeleton className="h-10 w-1/3 rounded-md" />
                        <div className="grid lg:grid-cols-12 gap-10">
                            <div className="lg:col-span-8 space-y-6">
                                <Skeleton className="aspect-video w-full rounded-md" />
                                <Skeleton className="h-32 w-full rounded-md" />
                            </div>
                            <div className="lg:col-span-4 space-y-6">
                                <Skeleton className="h-64 w-full rounded-md" />
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        )
    }

    if (!resource) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <FileText className="size-12 text-muted-foreground" />
                <h1 className="text-xl font-semibold">Resource Not Found</h1>
                <Button onClick={() => router.push("/home")}>Back to Home</Button>
            </div>
        )
    }

    const handleToggleLike = async () => {
        if (!session?.user) {
            toast.error("Login required")
            return
        }
        setLiked(!liked)
        setResource((prev: any) => ({
            ...prev,
            likes: liked
                ? prev.likes.filter((l: any) => l.authorId !== session.user.id)
                : [...(prev.likes || []), { authorId: session.user.id }]
        }))
        await toggleLike(resource.id, session.user.id)
    }

    const handlePostComment = async () => {
        if (!session?.user || !newComment.trim()) return
        const commentData = {
            id: Math.random().toString(),
            content: newComment,
            createdAt: new Date(),
            author: session.user
        }
        setResource((prev: any) => ({
            ...prev,
            comments: [commentData, ...(prev.comments || [])]
        }))
        setNewComment("")
        await postComment(resource.id, session.user.id, newComment)
        toast.success("Comment shared")
    }

    const handleDelete = async () => {
        await deleteResource(resource.id)
        toast.success("Deleted")
        router.push("/home")
    }

    const isOwner = session?.user?.id === resource.authorId

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between border-b px-6">
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
                                    <BreadcrumbPage>Resource</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="flex items-center gap-2">
                        {isOwner && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                                        <Trash className="size-4 mr-2" /> Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>This will permanently remove your resource.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                        <Badge variant="outline">Live</Badge>
                    </div>
                </header>

                <main className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
                    <div className="grid gap-10 lg:grid-cols-12">
                        <div className="lg:col-span-8 flex flex-col gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <Link href={`/${resource.author.username}/profile`} className="flex items-center gap-3 group">
                                        <Avatar className="size-9 border">
                                            <AvatarImage src={resource.author.image || ""} />
                                            <AvatarFallback>{resource.author.name?.[0] || "U"}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold group-hover:underline">{resource.author.name}</span>
                                            <span className="text-xs text-muted-foreground">@{resource.author.username}</span>
                                        </div>
                                    </Link>
                                    <div className="flex items-center gap-2 flex-wrap justify-end">
                                        {resource.tags?.map((tag: string) => (
                                            <Badge key={tag} variant="secondary" className="text-[10px]">#{tag}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">{resource.title}</h1>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                                    <div className="flex items-center gap-1">
                                        {resource.visibility === 'public' ? <Globe className="size-3" /> : <Lock className="size-3" />}
                                        <span className="capitalize">{resource.visibility}</span>
                                    </div>
                                    <span>{formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })}</span>
                                </div>
                                <p className="text-muted-foreground">{resource.description || "No description provided."}</p>
                            </div>

                            <div className="flex items-center gap-2 border-y py-4 flex-wrap">
                                <Button variant={liked ? "default" : "outline"} size="sm" onClick={handleToggleLike}>
                                    <Heart className={cn("size-4 mr-2", liked && "fill-current")} /> {resource.likes?.length || 0}
                                </Button>
                                <Button
                                    variant={saved ? "default" : "outline"}
                                    size="sm"
                                    onClick={async () => {
                                        if (!session?.user) { toast.error("Login required"); return; }
                                        setSaved(!saved);
                                        await toggleSave(resource.id, session.user.id);
                                        toast.success(saved ? "Removed from saved" : "Saved!");
                                    }}
                                >
                                    <Bookmark className={cn("size-4 mr-2", saved && "fill-current")} /> {saved ? "Saved" : "Save"}
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    toast.success("Link copied");
                                }}>
                                    <Share2 className="size-4 mr-2" /> Share
                                </Button>
                            </div>

                            {resource.files && resource.files.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Attached Files ({resource.files.length})</h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {resource.files.map((file: any) => (
                                            <div key={file.id} className="flex items-center justify-between p-3 border rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors group">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                                        <IconFileText className="size-5" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium line-clamp-1">{file.name}</span>
                                                        <span className="text-[10px] text-muted-foreground uppercase">{file.size || "Unknown size"} • {file.type?.split('/')[1] || "File"}</span>
                                                    </div>
                                                </div>
                                                <a href={file.url} download={file.name} target="_blank" rel="noreferrer">
                                                    <Button variant="ghost" size="icon" className="group-hover:text-primary">
                                                        <IconDownload className="size-4" />
                                                    </Button>
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {resource.category === "blog" ? (
                                <div className="space-y-6">
                                    {resource.url && (
                                        <div className="border rounded-md overflow-hidden">
                                            <img src={resource.url} alt={resource.title} className="w-full aspect-video object-cover" />
                                        </div>
                                    )}
                                    <div className="border rounded-md overflow-hidden bg-muted/40">
                                        <div
                                            className="p-8 prose dark:prose-invert max-w-none prose-pre:bg-zinc-950 prose-pre:text-zinc-100 prose-code:before:content-none prose-code:after:content-none"
                                            dangerouslySetInnerHTML={{ __html: resource.content || "<p>No content.</p>" }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="border rounded-md overflow-hidden bg-muted/40">
                                    {(resource.files?.[0]?.url || resource.url) ? (
                                        <div className="flex flex-col">
                                            <iframe
                                                src={`https://docs.google.com/viewer?url=${encodeURIComponent(resource.files?.[0]?.url || resource.url)}&embedded=true`}
                                                className="w-full border-0"
                                                style={{ minHeight: "80vh" }}
                                                title="Document Viewer"
                                                allowFullScreen
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-video flex flex-col items-center justify-center gap-2 text-muted-foreground/30">
                                            <FileText className="size-16" />
                                            <span className="text-xs uppercase font-bold tracking-widest">No file uploaded</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <Card className="rounded-md overflow-hidden border">
                                <CardHeader className="bg-muted/30 border-b">
                                    <CardTitle className="text-lg">Discussion</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="space-y-4">
                                        <Textarea
                                            placeholder="Add your thoughts..."
                                            value={newComment}
                                            onChange={e => setNewComment(e.target.value)}
                                            className="min-h-[100px]"
                                        />
                                        <div className="flex justify-end">
                                            <Button size="sm" onClick={handlePostComment} disabled={!newComment.trim()}>Post comment</Button>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="space-y-6">
                                        {resource.comments?.length > 0 ? resource.comments.map((comment: any) => (
                                            <div key={comment.id} className="flex gap-4">
                                                <Avatar className="size-10 rounded-md">
                                                    <AvatarImage src={comment.author.image || ""} className="rounded-md" />
                                                    <AvatarFallback className="rounded-md">{comment.author.name?.[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="font-bold">@{comment.author.username}</span>
                                                        <span className="text-muted-foreground">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                                                    </div>
                                                    <p className="text-sm">{comment.content}</p>
                                                </div>
                                            </div>
                                        )) : <p className="text-sm text-center text-muted-foreground py-10">No comments yet.</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-4 space-y-6">
                            <Card className="rounded-md border">
                                <CardHeader>
                                    <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Category</span>
                                        <span className="font-medium capitalize">{resource.category}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Type</span>
                                        <span className="font-medium uppercase">{resource.category === 'file' ? 'Document' : 'Blog'}</span>
                                    </div>
                                    <Separator />
                                    <div className="space-y-2">
                                        <span className="text-xs font-semibold text-muted-foreground uppercase">Tags</span>
                                        <div className="flex flex-wrap gap-2">
                                            {resource.tags?.map((t: string) => <Badge key={t} variant="outline" className="text-[10px]">#{t}</Badge>)}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
