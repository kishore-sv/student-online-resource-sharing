"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { authClient } from "@/lib/auth-client"
import { getNotifications } from "@/lib/db/queries"
import { deleteNotification, deleteManyNotifications, markNotificationAsRead } from "@/lib/actions"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Trash2, CheckCircle, Clock, ExternalLink, MoreVertical, CheckSquare, Square } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { pusherClient } from "@/lib/pusher-client"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"

export default function NotificationsPage() {
    const { data: session } = authClient.useSession()
    const [notifications, setNotifications] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    useEffect(() => {
        const fetchNotifications = async () => {
            if (session?.user?.id) {
                try {
                    const data = await getNotifications(session.user.id)
                    setNotifications(data)
                } catch (error) {
                    console.error("Failed to fetch notifications:", error)
                } finally {
                    setIsLoading(false)
                }
            }
        }
        fetchNotifications()

        if (session?.user?.id) {
            const channel = pusherClient?.subscribe(`user-${session.user.id}`)
            channel?.bind("notification:new", (newNotification: any) => {
                setNotifications(prev => [newNotification, ...prev])
                toast.info("New notification: " + newNotification.message)
            })
            return () => {
                pusherClient?.unsubscribe(`user-${session.user.id}`)
            }
        }
    }, [session])

    const handleDelete = async (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
        await deleteNotification(id)
        toast.success("Notification deleted")
    }

    const handleDeleteMany = async () => {
        if (selectedIds.length === 0) return
        setNotifications(prev => prev.filter(n => !selectedIds.includes(n.id)))
        await deleteManyNotifications(selectedIds)
        setSelectedIds([])
        toast.success(`${selectedIds.length} notifications deleted`)
    }

    const handleMarkAsRead = async (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
        await markNotificationAsRead(id)
    }

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
    }

    const toggleSelectAll = () => {
        if (selectedIds.length === notifications.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(notifications.map(n => n.id))
        }
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Notifications</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <main className="p-6 max-w-4xl mx-auto w-full space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                            <p className="text-muted-foreground">Keep track of follows and new resources shared with you.</p>
                        </div>
                        {notifications.length > 0 && (
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={toggleSelectAll}
                                    className="rounded-xl h-9"
                                >
                                    {selectedIds.length === notifications.length ? "Deselect All" : "Select All"}
                                </Button>
                                {selectedIds.length > 0 && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={handleDeleteMany}
                                        className="rounded-xl h-9 animate-in fade-in zoom-in"
                                    >
                                        <Trash2 className="size-4 mr-2" /> Delete ({selectedIds.length})
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        {isLoading ? (
                            [...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                            ))
                        ) : notifications.length > 0 ? (
                            notifications.map((n) => (
                                <Card
                                    key={n.id}
                                    className={cn(
                                        "group transition-all duration-300 border-muted/60 overflow-hidden rounded-2xl relative",
                                        !n.isRead ? "bg-primary/5 border-primary/20" : "hover:bg-muted/30"
                                    )}
                                >
                                    <CardContent className="p-4 flex items-start gap-4">
                                        <div className="pt-1">
                                            <Checkbox
                                                checked={selectedIds.includes(n.id)}
                                                onCheckedChange={() => toggleSelect(n.id)}
                                                className="rounded-md"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {!n.isRead && <div className="size-2 bg-primary rounded-full" />}
                                                    <span className="text-sm font-medium">{n.message}</span>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="size-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <MoreVertical className="size-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-xl">
                                                        {!n.isRead && (
                                                            <DropdownMenuItem onClick={() => handleMarkAsRead(n.id)}>
                                                                <CheckCircle className="size-4 mr-2" /> Mark as read
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem onClick={() => handleDelete(n.id)} className="text-destructive focus:bg-destructive focus:text-destructive-foreground">
                                                            <Trash2 className="size-4 mr-2" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="size-3" />
                                                    {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                {n.link && (
                                                    <Link
                                                        href={n.link}
                                                        className="flex items-center gap-1 hover:text-primary transition-colors hover:underline"
                                                        onClick={() => handleMarkAsRead(n.id)}
                                                    >
                                                        <ExternalLink className="size-3" /> View details
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="bg-muted size-16 rounded-3xl flex items-center justify-center mb-4">
                                    <Bell className="size-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold">No notifications</h3>
                                <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                                    You're all caught up! New follows and resources will appear here.
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
