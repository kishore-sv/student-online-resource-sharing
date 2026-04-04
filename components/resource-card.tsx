import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Dot, Heart, MessageSquare, Share2, FileText, Bookmark } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export type ResourceCardProps = {
  id: number
  author: string
  authorImage: string
  createdAt: string
  image: string
  title: string
  description: string
  tags: string[]
  docType: string
  docUrl: string
  docSize: string
  docNumberOfPages: number
  likes: number
  comments: number
  shares: number
  updatedAt: string
}

export function ResourceCard({ resource }: { resource: ResourceCardProps }) {
  return (
    <Card key={resource.id} className="group overflow-hidden border-border/50 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col">
      <Link href={`/home/${resource.id}`} className="block">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {resource.image ? (
            <img
              src={resource.image}
              alt={resource.title}
              className="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-105"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/10 to-blue-500/10">
              <FileText className="w-12 h-12 text-primary/20" />
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-2">
            <span className="px-2 py-1 bg-background/80 backdrop-blur-md border border-border rounded-md text-[10px] font-bold uppercase tracking-wider">
              {resource.docType}
            </span>
          </div>
        </div>
      </Link>

      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage src={resource.authorImage} />
            <AvatarFallback className="text-[10px]">{resource.author.slice(0, 1).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none">{resource.author}</span>
            <span className="text-[10px] text-muted-foreground mt-1">{resource.createdAt}</span>
          </div>
        </div>

        <Link href={`/home/${resource.id}`} className="flex-1">
          <h4 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1 mb-2" >{resource.title}</h4>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{resource.description}</p>
        </Link>

        <div className="flex flex-wrap items-center gap-1.5 mt-auto">
          {resource.tags.map((tag, index) => (
            <span key={index} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border/50">
              {tag}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="px-5 py-4 border-t border-border/50 flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-red-500 transition-colors group/stat cursor-pointer">
            <Heart className="w-4 h-4 group-hover/stat:fill-current" />
            <span className="text-xs font-medium">{resource.likes}</span>
          </button>
          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group/stat cursor-pointer">
            <MessageSquare className="w-4 h-4 group-hover/stat:fill-current" />
            <span className="text-xs font-medium">{resource.comments}</span>
          </button>
          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-blue-500 transition-colors group/stat cursor-pointer">
            <Share2 className="w-4 h-4" />
            <span className="text-xs font-medium">{resource.shares}</span>
          </button>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                role="button"
                tabIndex={0}
                onClick={() => toast.success("Resource saved successfully", {
                  description: "You can view it in your saved resources",
                })}
                className="flex items-center active:scale-95 gap-1.5 text-muted-foreground hover:text-green-500 transition-colors group/stat cursor-pointer outline-hidden"
              >
                <Bookmark className="w-4 h-4" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save it</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-[10px] font-medium">{resource.docSize}</span>
          <Dot className="w-4 h-4" />
          <span className="text-[10px] font-medium">{resource.docNumberOfPages} Pages</span>
        </div>
      </CardFooter>
    </Card>
  )
}
