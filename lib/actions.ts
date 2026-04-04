"use server"
import { db } from "./db";
import { resource, like, comment, user, savedResource, resourceFile } from "./db/schema";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { uploadImage } from "./imagekit";

export async function createResource(data: {
    title: string;
    description?: string;
    category: "blog" | "file";
    visibility: "public" | "private" | "shared";
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
    
    revalidatePath("/home");
    revalidatePath("/feed");
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
