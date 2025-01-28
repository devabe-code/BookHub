import { uuid, varchar, text, boolean, pgTable, timestamp, pgEnum, date, integer } from "drizzle-orm/pg-core";
import { number } from "zod";

export const STATUS_ENUM = pgEnum(
    'status', 
    ['PENDING', 'ACCEPTED', 'REJECTED']
)

export const ROLE_ENUM = pgEnum(
    'role', 
    ['USER', 'ADMIN']
)

export const BORROW_STATUS_ENUM = pgEnum(
    'borrow_status',
    ['BORROWED', 'RETURNED']
)

export const users = pgTable("users", {
    id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    profilePicture: text("profile_picture"),
    status: STATUS_ENUM("status").default("PENDING"),
    role: ROLE_ENUM("role").default("USER"),
    createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
    lastActivityDate: date("last_activity_date").defaultNow(),
});

export const books = pgTable("books", {
    id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    author: varchar("author", { length: 255 }).notNull(),
    genre:  text('genre').notNull(),
    rating: integer("rating").notNull().default(0),
    description: text("description").notNull(),
    coverColor: varchar("cover_color", { length: 7 }).notNull(),
    coverUrl: text("cover_url").notNull(),
    authorPhotoUrl: text("author_photo_url").notNull(),
    videoUrl: text("video_url").notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
});