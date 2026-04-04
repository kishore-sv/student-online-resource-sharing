"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { IconDots, IconFolder, IconPin, IconPinFilled, IconShare2, IconTrash, IconPlus } from "@tabler/icons-react"
import Link from "next/link"
import { deleteResource } from "@/lib/actions"
import { toast } from "sonner"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
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

export function NavYourResources({
  resources,
  isLoading,
  onTogglePin,
  onDelete,
}: {
  resources: any[]
  isLoading?: boolean
  onTogglePin?: (id: string, currentState: boolean) => void
  onDelete?: (id: string) => void
}) {
  const { isMobile } = useSidebar()

  const sortedResources = [...resources].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return 0
  })

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Your Resources</SidebarGroupLabel>
      <ScrollArea className="h-[45vh]">
        <SidebarMenu>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <NavYourResourcesSkeleton key={i} />)
          ) : sortedResources.length > 0 ? (
            sortedResources.map((r) => (
              <SidebarMenuItem key={r.id}>
                <SidebarMenuButton asChild>
                  <Link href={`/resource/${r.id}`}>
                    <span className="truncate">{r.title}</span>
                    {r.isPinned && <IconPinFilled className="ml-auto size-4 text-muted-foreground" />}
                  </Link>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <IconDots />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem onClick={() => onTogglePin?.(r.id, !!r.isPinned)}>
                      {r.isPinned ? (
                        <>
                          <IconPinFilled className="mr-2 size-4" />
                          <span>Unpin</span>
                        </>
                      ) : (
                        <>
                          <IconPin className="mr-2 size-4" />
                          <span>Pin</span>
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/resource/${r.id}`}>
                        <IconFolder className="mr-2 size-4" />
                        <span>View</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/resource/${r.id}`)
                        toast.success("Link copied!")
                      }}
                    >
                      <IconShare2 className="mr-2 size-4" />
                      <span>Share</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                          <IconTrash className="mr-2 size-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this resource from your hub.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete?.(r.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))
          ) : (
            <div className="px-4 py-8">
              <EmptyState
                title="No resources"
                description="Your shared resources will appear here."
                className="min-h-[150px] border-none bg-transparent p-0"
                icon={IconFolder}
                action={
                  <Link href="/write-blog">
                    <Button variant="outline" size="sm" className="w-full cursor-pointer">
                      <IconPlus className="mr-2 size-4" />
                      Write Blog
                    </Button>
                  </Link>
                }
              />
            </div>
          )}
        </SidebarMenu>
      </ScrollArea>
    </SidebarGroup>
  )
}

function NavYourResourcesSkeleton() {
  return (
    <SidebarMenuItem>
      <div className="flex items-center gap-2 px-3 py-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 flex-1" />
      </div>
    </SidebarMenuItem>
  )
}
