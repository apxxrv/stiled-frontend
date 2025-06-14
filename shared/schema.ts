import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isStyler: boolean("is_styler").default(false),
  avatar: text("avatar"),
  bio: text("bio"),
  location: text("location"),
});

export const stylists = pgTable("stylists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  followers: integer("followers").default(0),
  rating: integer("rating").default(5),
  reviewCount: integer("review_count").default(0),
  avatar: text("avatar"),
  specialties: text("specialties").array(),
  services: text("services").array(),
  location: text("location"),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  stylistId: integer("stylist_id").references(() => stylists.id),
  content: text("content").notNull(),
  image: text("image"),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => posts.id),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertStylistSchema = createInsertSchema(stylists).omit({
  id: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Stylist = typeof stylists.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type InsertStylist = z.infer<typeof insertStylistSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;
