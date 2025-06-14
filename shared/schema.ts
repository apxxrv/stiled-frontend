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

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  stylistId: integer("stylist_id").references(() => stylists.id),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // in cents
  duration: integer("duration").notNull(), // in minutes
  category: text("category"),
});

export const timeSlots = pgTable("time_slots", {
  id: serial("id").primaryKey(),
  stylistId: integer("stylist_id").references(() => stylists.id),
  date: text("date").notNull(), // YYYY-MM-DD format
  startTime: text("start_time").notNull(), // HH:MM format
  endTime: text("end_time").notNull(), // HH:MM format
  isAvailable: boolean("is_available").default(true),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  stylistId: integer("stylist_id").references(() => stylists.id),
  serviceIds: text("service_ids").array(), // Array of service IDs
  date: text("date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  totalAmount: integer("total_amount").notNull(), // in cents
  discountCode: text("discount_code"),
  discountAmount: integer("discount_amount").default(0),
  status: text("status").notNull(), // 'pending', 'confirmed', 'completed', 'cancelled'
  paymentMethod: text("payment_method"),
  paymentStatus: text("payment_status").notNull(), // 'pending', 'paid', 'refunded'
  refundAmount: integer("refund_amount").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const discountCodes = pgTable("discount_codes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  discountType: text("discount_type").notNull(), // 'percentage', 'fixed'
  discountValue: integer("discount_value").notNull(),
  minAmount: integer("min_amount").default(0),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").default(0),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true),
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

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
});

export const insertTimeSlotSchema = createInsertSchema(timeSlots).omit({
  id: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDiscountCodeSchema = createInsertSchema(discountCodes).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Stylist = typeof stylists.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Service = typeof services.$inferSelect;
export type TimeSlot = typeof timeSlots.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type DiscountCode = typeof discountCodes.$inferSelect;
export type InsertStylist = z.infer<typeof insertStylistSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type InsertTimeSlot = z.infer<typeof insertTimeSlotSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertDiscountCode = z.infer<typeof insertDiscountCodeSchema>;
