import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Dot, Heart, MessageSquare, Share2, FileText, Bookmark, MoreVertical, Pencil, Settings, Trash, Pin, PinOff, Globe, Lock, Users } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { toggleLike, togglePin, deleteResource } from "@/lib/actions"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"
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

export type ResourceCardProps = {
  id: string
  title: string
  description: string | null
  category: "blog" | "file"
  visibility: "public" | "private" | "shared"
  url: string | null
  content: string | null
  tags: string[] | null
  authorId: string
  isPinned: boolean
  createdAt: Date
  updatedAt: Date
  author: {
    name: string
    image: string | null
    username: string | null
  }
  likes?: any[]
  comments?: any[]
}

export function ResourceCard({ resource }: { resource: ResourceCardProps }) {
  const { data: session } = authClient.useSession()
  const isOwner = session?.user?.id === resource.authorId
  const [isLiked, setIsLiked] = useState(resource.likes?.some(l => l.authorId === session?.user?.id))
  const [likesCount, setLikesCount] = useState(resource.likes?.length || 0)

  const handleLike = async () => {
    if (!session?.user) {
        toast.error("Please login to like resources");
        return;
    }
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    await toggleLike(resource.id, session.user.id);
  }

  const handleDelete = async () => {
    await deleteResource(resource.id);
    toast.success("Resource deleted successfully");
  }

  const handleTogglePin = async () => {
    await togglePin(resource.id, resource.isPinned);
    toast.success(resource.isPinned ? "Resource unpinned" : "Resource pinned");
  }

  const getVisibilityIcon = () => {
    switch (resource.visibility) {
        case "public": return <Globe className="size-3" />;
        case "private": return <Lock className="size-3" />;
        case "shared": return <Users className="size-3" />;
    }
  }

  return (
    <Card key={resource.id} className="group overflow-hidden border-border/50 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col rounded-3xl bg-card/50 backdrop-blur-sm">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Link href={`/resource/${resource.id}`} className="block h-full">
            {resource.category === "file" && resource.url ? (
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/10 to-blue-500/10 group-hover:scale-110 transition-transform duration-700">
                    <FileText className="w-16 h-16 text-primary/30" />
                </div>
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-purple-500/10 to-pink-500/10 group-hover:scale-110 transition-transform duration-700">
                    <Pencil className="w-16 h-16 text-purple-500/30" />
                </div>
            )}
        </Link>
        
        <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 bg-background/90 backdrop-blur-xl border border-border/50 rounded-full text-[10px] font-bold uppercase tracking-widest text-foreground/80 flex items-center gap-1.5 shadow-sm">
                {getVisibilityIcon()}
                {resource.visibility}
            </span>
        </div>

        {isOwner && (
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="h-8 w-8 rounded-full bg-background/90 backdrop-blur-xl border border-border/50 flex items-center justify-center cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all shadow-lg">
                            <MoreVertical className="size-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 shadow-2xl border-border/50">
                        <DropdownMenuItem onClick={handleTogglePin} className="rounded-xl cursor-pointer gap-2">
                            {resource.isPinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
                            {resource.isPinned ? "Unpin from top" : "Pin to top"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl cursor-pointer gap-2" asChild>
                            <Link href={`/resource/${resource.id}`}>
                                <Settings className="size-4" />
                                Resource settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="rounded-xl cursor-pointer gap-2 text-destructive focus:text-destructive focus:bg-destructive/10">
                                    <Trash className="size-4" />
                                    Delete resource
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your resource.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        )}

        {resource.isPinned && (
            <div className="absolute bottom-4 right-4">
                <div className="p-2 bg-primary/95 text-primary-foreground rounded-full shadow-lg">
                    <Pin className="size-3 fill-current" />
                </div>
            </div>
        )}
      </div>

      <CardContent className="p-6 flex-1 flex flex-col space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border-2 border-background ring-1 ring-border shadow-sm">
            <AvatarImage src={resource.author.image || ""} />
            <AvatarFallback className="text-xs bg-primary/5">{resource.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-tight">{resource.author.name}</span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                {formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Link href={`/resource/${resource.id}`}>
            <h4 className="text-xl font-black group-hover:text-primary transition-colors line-clamp-1 decoration-primary/30 decoration-2 underline-offset-4 hover:underline">
                {resource.title}
            </h4>
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                {resource.description || "No description provided."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2">
          {resource.tags?.map((tag, index) => (
            <span key={index} className="text-[10px] font-bold px-3 py-1 rounded-lg bg-primary/5 text-primary border border-primary/10 hover:bg-primary/10 transition-colors uppercase tracking-wider cursor-default">
              #{tag}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="px-6 py-5 border-t border-border/50 flex items-center justify-between bg-muted/20">
        <div className="flex items-center gap-5">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-2 transition-all group/stat cursor-pointer ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
          >
            <Heart className={`w-4.5 h-4.5 ${isLiked ? 'fill-current' : 'group-hover/stat:fill-current'} transition-transform active:scale-125`} />
            <span className="text-xs font-bold">{likesCount}</span>
          </button>
          
          <Link href={`/resource/${resource.id}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all group/stat">
            <MessageSquare className="w-4.5 h-4.5 group-hover/stat:fill-current" />
            <span className="text-xs font-bold">{resource.comments?.length || 0}</span>
          </Link>

          <button 
            onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/resource/${resource.id}`);
                toast.success("Link copied!");
            }}
            className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 transition-all group/stat cursor-pointer"
          >
            <Share2 className="w-4.5 h-4.5" />
          </button>
        </div>

        <Tooltip>
            <TooltipTrigger asChild>
                <button 
                    onClick={() => toast.info("Coming soon!")}
                    className="flex items-center active:scale-90 text-muted-foreground hover:text-orange-500 transition-all cursor-pointer rounded-full h-8 w-8 items-center justify-center hover:bg-orange-500/10"
                >
                    <Bookmark className="w-4.5 h-4.5" />
                </button>
            </TooltipTrigger>
            <TooltipContent className="rounded-xl font-bold bg-foreground text-background border-none">
                <p>Bookmark</p>
            </TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  )
}
