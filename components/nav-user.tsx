"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { IconSelector, IconSparkles, IconRosetteDiscountCheck, IconCreditCard, IconBell, IconLogout, IconUser, IconRss, IconSun, IconBrightness, IconFolder, IconBookmark } from "@tabler/icons-react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

export function NavUser({
  user,
}: {
  user: {
    name: string
    username: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/login")
  }

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <IconSelector className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <a href={`/${user.username}/profile`} className="flex items-center gap-1 w-full">
                  <IconUser
                  />
                  View Profile
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href={`/${user.username}/resources`} className="flex items-center gap-1 w-full">
                  <IconFolder
                  />
                  View Resources
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="/saved" className="flex items-center gap-1 w-full">
                  <IconBookmark
                  />
                  Saved Resources
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="/followers" className="flex items-center gap-1 w-full">
                  <IconRosetteDiscountCheck
                  />
                  Followers
                </a>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <a href="/notifications" className="flex items-center gap-1 w-full">
                  <IconBell
                  />
                  Notifications
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => { theme === "dark" ? setTheme("light") : setTheme("dark") }}>
                <IconBrightness />
                Toggle Theme
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground">
              <IconLogout
              />
              Log out
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu >
  )
}
