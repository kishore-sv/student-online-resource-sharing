"use server"
import { db } from "./db";
import { resource, like, comment, user, savedResource, resourceFile, notification, follow } from "./db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { uploadImage } from "./imagekit";
import { pusherServer } from "./pusher";

export async function createResource(data: {
    title: string;
    description?: string;
    category: "blog" | "file";
    visibility: "public" | "private" | "shared" | "followers";
    url?: string;
    content?: string;
    authorId: string;
    tags?: string[];
    files?: { name: string; url: string; size?: string; type?: string }[];
}) {
    const { files, ...resourceData } = data;
    const [newResource] = await db.insert(resource).values({
        ...resourceData,
        updatedAt: new Date(),
    }).returning();
    
    if (files && files.length > 0) {
        await db.insert(resourceFile).values(
            files.map(file => ({
                resourceId: newResource.id,
                ...file
            }))
        );
    }
    
    
    // Trigger notification for followers
    if (data.visibility === "public" || data.visibility === "followers") {
        const followersData = await db.query.follow.findMany({
            where: eq(follow.followingId, data.authorId),
        });

        const authorData = await db.query.user.findFirst({
            where: eq(user.id, data.authorId)
        });

        for (const f of followersData) {
            const message = `${authorData?.name || authorData?.username} created a new ${data.category}: ${data.title}`;
            const [newNotification] = await db.insert(notification).values({
                userId: f.followerId,
                type: "new_resource",
                message,
                link: `/resource/${newResource.id}`,
            }).returning();

            await pusherServer.trigger(`user-${f.followerId}`, "notification:new", newNotification);
        }
    }

    revalidatePath("/home");
    revalidatePath("/feed");
    const authorData = await db.query.user.findFirst({
        where: eq(user.id, data.authorId)
    });
    if (authorData?.username) {
        revalidatePath(`/${authorData.username}/profile`);
    }
    return newResource;
}

export async function toggleLike(resourceId: string, userId: string) {
    const existing = await db.query.like.findFirst({
        where: and(eq(like.resourceId, resourceId), eq(like.authorId, userId))
    });

    if (existing) {
        await db.delete(like).where(eq(like.id, existing.id));
    } else {
        await db.insert(like).values({ resourceId, authorId: userId });
    }
    
    revalidatePath(`/resource/${resourceId}`);
}

export async function postComment(resourceId: string, authorId: string, content: string) {
    await db.insert(comment).values({
        resourceId,
        authorId,
        content
    });
    revalidatePath(`/resource/${resourceId}`);
}

export async function updateUser(userId: string, data: { name?: string, username?: string, collegeName?: string, image?: string }) {
    await db.update(user).set({ ...data, updatedAt: new Date() }).where(eq(user.id, userId));
    if (data.username) {
        revalidatePath(`/${data.username}/profile`);
        revalidatePath(`/${data.username}/resources`);
    }
    revalidatePath("/home");
}

export async function updateResource(resourceId: string, data: { title?: string, description?: string, visibility?: any, tags?: string[], isPinned?: boolean }) {
    await db.update(resource).set({ ...data, updatedAt: new Date() }).where(eq(resource.id, resourceId));
    revalidatePath("/home");
    revalidatePath(`/resource/${resourceId}`);
}

export async function deleteResource(resourceId: string) {
    await db.delete(resource).where(eq(resource.id, resourceId));
    revalidatePath("/home");
    revalidatePath("/feed");
}

export async function togglePin(resourceId: string, currentState: boolean) {
    await db.update(resource).set({ isPinned: !currentState }).where(eq(resource.id, resourceId));
    revalidatePath("/home");
}

export async function uploadBlogThumbnail(arg1: FormData | string, arg2?: string) {
    let base64Image: string | null = null;
    let fileName: string | null = null;

    if (typeof arg1 === "string") {
        base64Image = arg1;
        fileName = arg2 || "image.png";
    } else {
        base64Image = arg1.get("image") as string;
        fileName = arg1.get("name") as string;
    }

    if (!base64Image) throw new Error("No image data provided");

    // Convert base64 to Buffer
    const buffer = Buffer.from(base64Image.split(",")[1], "base64");
    const url = await uploadImage(buffer, fileName || "image.png", "/blogs/thumbnails");
    return url as string;
}

export async function toggleSave(resourceId: string, userId: string) {
    const existing = await db.query.savedResource.findFirst({
        where: and(eq(savedResource.resourceId, resourceId), eq(savedResource.userId, userId))
    });

    if (existing) {
        await db.delete(savedResource).where(eq(savedResource.id, existing.id));
    } else {
        await db.insert(savedResource).values({ resourceId, userId });
    }

    revalidatePath(`/resource/${resourceId}`);
    revalidatePath("/saved");
}

export async function toggleFollow(followerId: string, followingId: string) {
    const { follow } = await import("./db/schema");
    const existing = await db.query.follow.findFirst({
        where: and(eq(follow.followerId, followerId), eq(follow.followingId, followingId))
    });

    if (existing) {
        await db.delete(follow).where(eq(follow.id, existing.id));
    } else {
        await db.insert(follow).values({ followerId, followingId });
        
        // Trigger notification for following
        const followerData = await db.query.user.findFirst({
            where: eq(user.id, followerId)
        });

        const [newNotification] = await db.insert(notification).values({
            userId: followingId,
            type: "follow",
            message: `${followerData?.name || followerData?.username} started following you`,
            link: `/${followerData?.username}/profile`,
        }).returning();

        await pusherServer.trigger(`user-${followingId}`, "notification:new", newNotification);
    }

    revalidatePath("/profile");
    revalidatePath("/followers");
}

export async function markNotificationAsRead(id: string) {
    await db.update(notification).set({ isRead: true }).where(eq(notification.id, id));
    revalidatePath("/notifications");
}

export async function deleteNotification(id: string) {
    await db.delete(notification).where(eq(notification.id, id));
    revalidatePath("/notifications");
}

export async function deleteManyNotifications(ids: string[]) {
    await db.delete(notification).where(inArray(notification.id, ids));
    revalidatePath("/notifications");
}

export async function getOurResource(id: string) {
    const { seedInitialResources } = await import("./db/seed");
    await seedInitialResources();
    
    const fs = await import("fs/promises");
    const path = await import("path");
    const matter = (await import("gray-matter")).default;

    try {
        const metadata = await db.query.resource.findFirst({
            where: eq(resource.id, id),
            with: {
                author: true,
                likes: true,
                comments: {
                    with: { author: true },
                    orderBy: [desc(comment.createdAt)]
                },
                savedResources: true
            }
        });

        const filePath = path.join(process.cwd(), "our-resources", `${id}.mdx`);
        const fileContent = await fs.readFile(filePath, "utf8");
        const { data, content } = matter(fileContent);
        
        return {
            id,
            ...data,
            content,
            author: metadata?.author || { 
                name: "StudyHub", 
                username: "studyhub",
                image: null 
            },
            createdAt: metadata?.createdAt || new Date(data.date || Date.now()),
            likes: metadata?.likes || [],
            comments: metadata?.comments || [],
            savedResources: metadata?.savedResources || [],
            visibility: "public",
            category: "blog"
        };
    } catch (error) {
        console.error("Error reading MDX resource:", error);
        return null;
    }
}
