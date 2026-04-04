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
import { IconTerminal2, IconRobot, IconBook, IconSettings, IconLifebuoy, IconSend, IconFrame, IconChartPie, IconMap, IconCommand } from "@tabler/icons-react"
import { authClient } from "@/lib/auth-client"
import { Skeleton } from "@/components/ui/skeleton"
import { Home, Pencil } from "lucide-react"

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
      title: "Documentation",
      url: "#",
      icon: (
        <IconBook
        />
      ),
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
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
  yourResources: [
    {
      name: "Java Notes",
      url: "#",
      pinned: true
    },
    {
      name: "DBMS pptx",
      url: "#",
    },
    {
      name: "CP Programs",
      url: "#",
    },
    {
      name: "Advanced java",
      url: "#",
    },
    {
      name: "Java Full stack notes with programs",
      url: "#",
    },
    {
      name: "React notes",
      url: "#",
    },
    {
      name: "OS notes",
      url: "#",
    },
    {
      name: "Phy3001 annonucemt",
      url: "#",
    },
    {
      name: "Python notes",
      url: "#",
    },
    {
      name: "Express notes",
      url: "#",
    },
    {
      name: "Phy3001 pdf",
      url: "#",
    },
    {
      name: "Cryptography",
      url: "#",
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user
  const [resources, setResources] = React.useState(data.yourResources)

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
          onTogglePin={(name) => {
            setResources(prev => prev.map(r => r.name === name ? { ...r, pinned: !r.pinned } : r))
          }}
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
            email: user.email,
            avatar: user.image || "",
          }} />
        ) : null}
      </SidebarFooter>
    </Sidebar>
  )
}
