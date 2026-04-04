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
import { IconDots, IconFolder, IconPin, IconPinFilled, IconShare2, IconTrash } from "@tabler/icons-react"

export function NavYourResources({
  resources,
  onTogglePin,
}: {
  resources: {
    name: string
    url: string
    pinned?: boolean
  }[]
  onTogglePin?: (name: string) => void
}) {
  const { isMobile } = useSidebar()

  const sortedResources = [...resources].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return 0
  })

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Your Resources</SidebarGroupLabel>
      <div className="relative">
        <ScrollArea className="h-[45vh] pr-4 translate-x-1">
          <SidebarMenu>
            {sortedResources.map((r) => (
              <SidebarMenuItem key={r.name}>
                <SidebarMenuButton asChild>
                  <a href={r.url}>
                    {/* {r.icon} */}
                    <span className="truncate w-42 flex items-center justify-between">{r.name} {r.pinned && <IconPinFilled className="size-4 text-muted-foreground" />} </span>
                  </a>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction
                      showOnHover
                      className="aria-expanded:bg-muted"
                    >
                      <IconDots
                      />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-48"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem onClick={() => onTogglePin?.(r.name)}>
                      {r.pinned ? (
                        <>
                          <IconPinFilled className="text-muted-foreground" />
                          <span>Unpin Resource</span>
                        </>
                      ) : (
                        <>
                          <IconPin className="text-muted-foreground" />
                          <span>Pin Resource</span>
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconFolder className="text-muted-foreground" />
                      <span>View Resource</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconShare2 className="text-muted-foreground" />
                      <span>Share Resource</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <IconTrash className="text-muted-foreground" />
                      <span>Delete Resource</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </ScrollArea>
        {/* Subtle Bottom Mask to indicate scroll */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-sidebar to-transparent pointer-events-none z-10 opacity-70" />
      </div>
    </SidebarGroup>
  )
}
