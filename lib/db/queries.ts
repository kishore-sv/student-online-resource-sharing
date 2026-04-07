"use server"
import { db } from "./index";
import { resource, user, like, comment, savedResource, follow, notification } from "./schema";
import { desc, eq, sql, and, ilike, inArray } from "drizzle-orm";

export async function getPublicResources(limit = 10, userId?: string) {
    const { seedInitialResources } = await import("./seed");
    await seedInitialResources();
    
    const publicResources = await db.query.resource.findMany({
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

    if (!userId) return publicResources;

    // Also get resources from followed users with 'followers' visibility
    const following = await db.query.follow.findMany({
        where: eq(follow.followerId, userId),
    });
    const followedIds = following.map(f => f.followingId);

    if (followedIds.length === 0) return publicResources;

    const followerResources = await db.query.resource.findMany({
        where: and(
            eq(resource.visibility, "followers"),
            inArray(resource.authorId, followedIds)
        ),
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

    return [...publicResources, ...followerResources].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit);
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

export async function getResourcesByUser(username: string, viewerId?: string) {
    const { seedInitialResources } = await import("./seed");
    await seedInitialResources();
    
    const userData = await db.query.user.findFirst({
        where: eq(user.username, username)
    });
    
    if (!userData) return [];

    let isFollower = false;
    if (viewerId && viewerId !== userData.id) {
        const check = await db.query.follow.findFirst({
            where: and(eq(follow.followerId, viewerId), eq(follow.followingId, userData.id))
        });
        isFollower = !!check;
    }

    return await db.query.resource.findMany({
        where: and(
            eq(resource.authorId, userData.id),
            viewerId === userData.id 
                ? undefined 
                : isFollower 
                    ? inArray(resource.visibility, ["public", "followers"])
                    : eq(resource.visibility, "public")
        ),
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

export async function searchResources(query: string, viewerId?: string) {
    // This is complex for search, let's keep it simple for now and only search public
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

export async function getFollowers(userId: string) {
    const followers = await db.query.follow.findMany({
        where: eq(follow.followingId, userId),
        with: {
            follower: true
        }
    });
    return followers.map(f => f.follower);
}

export async function getFollowing(userId: string) {
    const following = await db.query.follow.findMany({
        where: eq(follow.followerId, userId),
        with: {
            following: true
        }
    });
    return following.map(f => f.following);
}

export async function getNotifications(userId: string) {
    return await db.query.notification.findMany({
        where: eq(notification.userId, userId),
        orderBy: [desc(notification.createdAt)],
    });
}
