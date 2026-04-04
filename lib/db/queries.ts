"use server"
import { db } from "./index";
import { resource, user, like, comment } from "./schema";
import { desc, eq, sql, and, ilike } from "drizzle-orm";

export async function getPublicResources(limit = 10) {
    return await db.query.resource.findMany({
        where: eq(resource.visibility, "public"),
        with: {
            author: true,
            likes: true,
            comments: true,
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
        where: eq(user.username, username)
    });
}
