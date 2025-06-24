//schema declaration for us 
//Migration in Drizzle

import { varchar, uuid, integer, pgTable, pgEnum, serial, text, timestamp, date } from 'drizzle-orm/pg-core';

//now defining enum the possible answers to the status in users table
//array of three values 
export const STATUS_ENUM = pgEnum("status", [
    'PENDING',
    'APPROVED',
    'REJECTED'
])
export const ROLE_ENUM = pgEnum("role", [
    "USER",
    "ADMIN"
]);
export const BORROW_STATUS_ENUM = pgEnum("borrow_status", [
    "BORROWED",
    "RETURNED"
])


//defining main users table
export const users = pgTable("users", {
    //init uuid for better identifier
    id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    email: text("email").notNull().unique(), 
    universityId: integer("university_id").notNull(),
    password: text("password").notNull(),
    universityCard: text("university_card").notNull(),
    //using the enum and passing status to it 
    status: STATUS_ENUM("status").default("PENDING"),
    role: ROLE_ENUM("role").default("USER"),
    //to tracking the last activity
    lastActivityDate: date("last_activity_date").notNull().defaultNow(),
    createdAt: timestamp("created_at", {
        withTimezone: true,
    }).defaultNow(),
})

export type InsertUser = typeof users.$inferInsert;


export const books = pgTable("books", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  genre: text("genre").notNull(),
  rating: integer("rating").notNull(),
  coverUrl: text("cover_url").notNull(),
  coverColor: varchar("cover_color", { length: 7 }).notNull(),
  description: text("description").notNull(),
  totalCopies: integer("total_copies").notNull().default(1),
  availableCopies: integer("available_copies").notNull().default(0),
  videoUrl: text("video_url").notNull(),
  summary: varchar("summary").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const borrowRecords = pgTable("borrow_records", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  bookId: uuid("book_id")
    .references(() => books.id)
    .notNull(),
  borrowDate: timestamp("borrow_date", { withTimezone: true })
    .defaultNow()
    .notNull(),
  dueDate: date("due_date").notNull(),
  returnDate: date("return_date"),
  status: BORROW_STATUS_ENUM("status").default("BORROWED").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});


//Migrations are scripts to change DB structure safely.

//They enable version control for your database.

//Tools like Drizzle, Prisma, Knex, Flyway automate this.

//Use them to keep schema consistent, trackable, and reversible.

