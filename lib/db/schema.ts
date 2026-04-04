import { pgTable, text, timestamp, boolean, uuid, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const resourceCategoryEnum = pgEnum("resource_category", ["blog", "file"]);
export const visibilityEnum = pgEnum("visibility", ["public", "private", "shared"]);
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

	// Custom Student Fields
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
	id: uuid("id").primaryKey().defaultRandom(),
	title: text("title").notNull(),
	description: text("description"),
	category: resourceCategoryEnum("category").notNull().default("file"),
	visibility: visibilityEnum("visibility").notNull().default("public"),
	url: text("url"), // Null for blogs, used for file location
	content: text("content"), // Markdown/Text for blogs
	tags: text("tags").array(),
	metadata: text("metadata"), // Stringified JSON or separate fields? Let's use simple fields for now or text for flexibility
	authorId: text("author_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	isPinned: boolean("is_pinned").default(false).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const like = pgTable("like", {
	id: uuid("id").primaryKey().defaultRandom(),
	authorId: text("author_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	resourceId: uuid("resource_id").notNull().references(() => resource.id, { onDelete: "cascade" }),
});

export const comment = pgTable("comment", {
	id: uuid("id").primaryKey().defaultRandom(),
	content: text("content").notNull(),
	authorId: text("author_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	resourceId: uuid("resource_id").notNull().references(() => resource.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const permission = pgTable("permission", {
	id: uuid("id").primaryKey().defaultRandom(),
	resourceId: uuid("resource_id").references(() => resource.id, { onDelete: "cascade" }),
	sharedWithId: text("shared_with_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	type: permissionTypeEnum("type").notNull().default("read"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relationships
export const userRelations = relations(user, ({ many }) => ({
	resources: many(resource),
	likes: many(like),
	comments: many(comment),
	permissionsRecieved: many(permission, { relationName: "sharedWith" }),
}));

export const resourceRelations = relations(resource, ({ one, many }) => ({
	author: one(user, {
		fields: [resource.authorId],
		references: [user.id],
	}),
	likes: many(like),
	comments: many(comment),
	permissions: many(permission),
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
