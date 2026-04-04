import { pgTable, text, timestamp, boolean, uuid, pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["student", "teacher", "admin"]);
export const resourceTypeEnum = pgEnum("resource_type", ["file", "folder"]);
export const permissionTypeEnum = pgEnum("permission_type", ["read", "write", "comment"]);

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("emailVerified").notNull(),
	image: text("image"),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
    
    // Custom Student Fields
    collegeName: text("college_name"),
    role: roleEnum("role").default("student"),
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
    name: text("name").notNull(),
    type: resourceTypeEnum("type").notNull(),
    parentId: uuid("parent_id"), // Self-reference for folders
    url: text("url"), // Null for folders
    ownerId: text("owner_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const blog = pgTable("blog", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    content: text("content").notNull(), // Markdown text
    authorId: text("author_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    isPublic: boolean("is_public").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const comment = pgTable("comment", {
    id: uuid("id").primaryKey().defaultRandom(),
    content: text("content").notNull(),
    authorId: text("author_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    blogId: uuid("blog_id").notNull().references(() => blog.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const permission = pgTable("permission", {
    id: uuid("id").primaryKey().defaultRandom(),
    resourceId: uuid("resource_id").references(() => resource.id, { onDelete: "cascade" }),
    blogId: uuid("blog_id").references(() => blog.id, { onDelete: "cascade" }),
    sharedWithId: text("shared_with_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    type: permissionTypeEnum("type").notNull().default("read"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
