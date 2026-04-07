"use server"
import { db } from "./index";
import { resource, user, like, comment, savedResource } from "./schema";
import { desc, eq, sql, and, ilike } from "drizzle-orm";

export async function getPublicResources(limit = 10) {
    return await db.query.resource.findMany({
        where: eq(resource.visibility, "public"),
        with: {
            author: true,
            likes: true,
            comments: true,
            savedResources: true,
            files: true,
        },
        orderBy: [desc(resource.createdAt)],
        limit,
    });
}

export async function getResourceById(id: string) {
    return await db.query.resource.findFirst({
        where: eq(resource.id, id),
        with: {
            author: true,
            likes: true,
            savedResources: true,
            files: true,
            comments: {
                with: {
                    author: true
                },
                orderBy: [desc(comment.createdAt)]
            }
        }
    });
}

export async function getResourcesByUser(username: string) {
    const userData = await db.query.user.findFirst({
        where: eq(user.username, username)
    });
    
    if (!userData) return [];

    return await db.query.resource.findMany({
        where: eq(resource.authorId, userData.id),
        with: {
            author: true,
            likes: true,
            files: true,
            comments: {
                with: {
                    author: true
                }
            }
        },
        orderBy: [desc(resource.createdAt)]
    });
}

export async function searchUsers(query: string) {
    return await db.query.user.findMany({
        where: ilike(user.username, `%${query}%`),
        limit: 10
    });
}

export async function getUserByUsername(username: string) {
    return await db.query.user.findFirst({
        where: eq(user.username, username),
        with: {
            followers: {
                with: {
                    follower: true
                }
            },
            following: {
                with: {
                    following: true
                }
            },
            resources: {
                where: eq(resource.visibility, 'public'),
                with: {
                    likes: true,
                    comments: true,
                    files: true,
                    author: true
                },
                orderBy: [desc(resource.createdAt)]
            }
        }
    });
}

export async function searchResources(query: string) {
    return await db.query.resource.findMany({
        where: and(
            eq(resource.visibility, "public"),
            ilike(resource.title, `%${query}%`)
        ),
        with: {
            author: true,
            likes: true,
            comments: true,
        },
        limit: 10
    });
}

export async function getSavedResources(userId: string) {
    const saved = await db.query.savedResource.findMany({
        where: eq(savedResource.userId, userId),
        with: {
            resource: {
                with: {
                    author: true,
                    likes: true,
                    comments: true,
                    files: true,
                }
            }
        },
        orderBy: [desc(savedResource.createdAt)],
    });
    return saved.map(s => s.resource);
}
