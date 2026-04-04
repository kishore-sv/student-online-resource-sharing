"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavYourResources } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { IconTerminal2, IconRobot, IconBook, IconSettings, IconLifebuoy, IconSend, IconFrame, IconChartPie, IconMap, IconCommand, IconFolder, IconUpload } from "@tabler/icons-react"
import { authClient } from "@/lib/auth-client"
import { Skeleton } from "@/components/ui/skeleton"
import { Home, Pencil } from "lucide-react"
import { getResourcesByUser } from "@/lib/db/queries"
import { togglePin, deleteResource } from "@/lib/actions"
import { toast } from "sonner"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: (
        <Home
        />
      ),
      isActive: true,
      // items: [
      //   {
      //     title: "History",
      //     url: "#",
      //   },
      //   {
      //     title: "Starred",
      //     url: "#",
      //   },
      //   {
      //     title: "Settings",
      //     url: "#",
      //   },
      // ],
    },
    {
      title: "Write Blog",
      url: "/write-blog",
      icon: (
        <Pencil
        />
      ),
      // items: [
      //   {
      //     title: "Genesis",
      //     url: "#",
      //   },
      //   {
      //     title: "Explorer",
      //     url: "#",
      //   },
      //   {
      //     title: "Quantum",
      //     url: "#",
      //   },
      // ],
    },
    {
      title: "Upload Resources",
      url: "",
      icon: (
        <IconUpload
        />
      ),
    },
    {
      title: "Settings",
      url: "#",
      icon: (
        <IconSettings
        />
      ),
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Feedback",
      url: "#",
      icon: (
        <IconSend
        />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user
  const [resources, setResources] = React.useState<any[]>([])

  React.useEffect(() => {
    if (user?.username) {
      getResourcesByUser(user.username).then(setResources)
    }
  }, [user?.username])

  const handleTogglePin = async (resourceId: string, currentState: boolean) => {
    setResources(prev => prev.map(r => r.id === resourceId ? { ...r, isPinned: !currentState } : r))
    await togglePin(resourceId, currentState)
  }

  const handleDelete = async (resourceId: string) => {
    setResources(prev => prev.filter(r => r.id !== resourceId))
    await deleteResource(resourceId)
    toast.success("Resource deleted successfully")
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <IconBook className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium text-foreground">StudyHub</span>
                  <span className="truncate text-xs text-muted-foreground">Student Resource Platform</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavYourResources
          resources={resources}
          onTogglePin={handleTogglePin}
          onDelete={handleDelete}
        />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {isPending ? (
          <div className="px-2 py-1.5 flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-2 w-24" />
            </div>
          </div>
        ) : user ? (
          <NavUser user={{
            name: user.name,
            username: user.username,
            email: user.email,
            avatar: user.image || "",
          }} />
        ) : null}
      </SidebarFooter>
    </Sidebar>
  )
}
