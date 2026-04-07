import { pgTable, text, timestamp, boolean, uuid, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const resourceCategoryEnum = pgEnum("resource_category", ["blog", "file"]);
export const visibilityEnum = pgEnum("visibility", ["public", "private", "shared", "followers"]);
export const permissionTypeEnum = pgEnum("permission_type", ["read", "write", "comment"]);

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	username: text("username").unique(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("emailVerified").notNull(),
	image: text("image"),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
	collegeName: text("college_name"),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expiresAt").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
	ipAddress: text("ipAddress"),
	userAgent: text("userAgent"),
	userId: text("userId").notNull().references(() => user.id),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("accountId").notNull(),
	providerId: text("providerId").notNull(),
	userId: text("userId").notNull().references(() => user.id),
	accessToken: text("accessToken"),
	refreshToken: text("refreshToken"),
	idToken: text("idToken"),
	accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
	refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expiresAt").notNull(),
	createdAt: timestamp("createdAt"),
	updatedAt: timestamp("updatedAt"),
});

export const resource = pgTable("resource", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	title: text("title").notNull(),
	description: text("description"),
	category: resourceCategoryEnum("category").notNull().default("file"),
	visibility: visibilityEnum("visibility").notNull().default("public"),
	url: text("url"),
	content: text("content"),
	tags: text("tags").array(),
	metadata: text("metadata"), 
	authorId: text("author_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	isPinned: boolean("is_pinned").default(false).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const resourceFile = pgTable("resource_file", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	resourceId: text("resource_id").notNull().references(() => resource.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	url: text("url").notNull(),
	size: text("size"),
	type: text("type"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const like = pgTable("like", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	authorId: text("author_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	resourceId: text("resource_id").notNull().references(() => resource.id, { onDelete: "cascade" }),
});

export const comment = pgTable("comment", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	content: text("content").notNull(),
	authorId: text("author_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	resourceId: text("resource_id").notNull().references(() => resource.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const savedResource = pgTable("saved_resource", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	resourceId: text("resource_id").notNull().references(() => resource.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const permission = pgTable("permission", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	resourceId: text("resource_id").references(() => resource.id, { onDelete: "cascade" }),
	sharedWithId: text("shared_with_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	type: permissionTypeEnum("type").notNull().default("read"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const follow = pgTable("follow", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	followerId: text("follower_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	followingId: text("following_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notification = pgTable("notification", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	type: text("type").notNull(), // "follow", "new_resource"
	message: text("message").notNull(),
	link: text("link"),
	isRead: boolean("is_read").default(false).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
	resources: many(resource),
	likes: many(like),
	comments: many(comment),
	savedResources: many(savedResource),
	permissionsRecieved: many(permission, { relationName: "sharedWith" }),
	followers: many(follow, { relationName: "following" }),
	following: many(follow, { relationName: "follower" }),
	notifications: many(notification),
}));

export const followRelations = relations(follow, ({ one }) => ({
	follower: one(user, {
		fields: [follow.followerId],
		references: [user.id],
		relationName: "follower",
	}),
	following: one(user, {
		fields: [follow.followingId],
		references: [user.id],
		relationName: "following",
	}),
}));

export const resourceRelations = relations(resource, ({ one, many }) => ({
	author: one(user, {
		fields: [resource.authorId],
		references: [user.id],
	}),
	likes: many(like),
	comments: many(comment),
	savedResources: many(savedResource),
	files: many(resourceFile),
	permissions: many(permission),
}));

export const resourceFileRelations = relations(resourceFile, ({ one }) => ({
	resource: one(resource, {
		fields: [resourceFile.resourceId],
		references: [resource.id],
	}),
}));

export const likeRelations = relations(like, ({ one }) => ({
	author: one(user, {
		fields: [like.authorId],
		references: [user.id],
	}),
	resource: one(resource, {
		fields: [like.resourceId],
		references: [resource.id],
	}),
}));

export const commentRelations = relations(comment, ({ one }) => ({
	author: one(user, {
		fields: [comment.authorId],
		references: [user.id],
	}),
	resource: one(resource, {
		fields: [comment.resourceId],
		references: [resource.id],
	}),
}));

export const savedResourceRelations = relations(savedResource, ({ one }) => ({
	user: one(user, {
		fields: [savedResource.userId],
		references: [user.id],
	}),
	resource: one(resource, {
		fields: [savedResource.resourceId],
		references: [resource.id],
	}),
}));

export const permissionRelations = relations(permission, ({ one }) => ({
	resource: one(resource, {
		fields: [permission.resourceId],
		references: [resource.id],
	}),
	sharedWith: one(user, {
		fields: [permission.sharedWithId],
		references: [user.id],
		relationName: "sharedWith",
	}),
}));

export const notificationRelations = relations(notification, ({ one }) => ({
	user: one(user, {
		fields: [notification.userId],
		references: [user.id],
	}),
}));
