import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  pgEnum,
  index,
  boolean,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role_type", [
  "user",
  "admin"
]);

export const subscriptionTierEnum = pgEnum("subscription_tier", [
  "free",
  "pro",
  "team",
]);


export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  fullname: varchar("user_name").notNull(),

  email: varchar("email").notNull().unique(),
  emailVerifiedAt: timestamp("email_verified_at"),

  passwordHash: varchar("password_hash", { length: 255 }),

  googleId: text("google_id").unique(),
  githubId: text("github_id").unique(),

  role: roleEnum("role").default("user").notNull(),

  subscriptionTier: subscriptionTierEnum("subscription_tier").default("free").notNull(),

  isSuspended: boolean("is_suspended").default(false).notNull(),

  isGmailConnected: boolean("is_gmail_connected").default(false).notNull(),
  isCalendarConnected: boolean("is_calendar_connected").default(false).notNull(),

  profileImageUrl: text("profile_image_url"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull(),
});

export const emailVerificationsTable = pgTable(
  "email_verifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    verifiedAt: timestamp("verified_at"),
  },
  (table) => [index("email_verifications_user_id_idx").on(table.userId)]
);

export type SelectUser = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;