import { pgTable, text, jsonb, timestamp, uuid } from 'drizzle-orm/pg-core';
import { usersTable } from './user';

export const corsairIntegrations = pgTable('corsair_integrations', {
    id: text('id').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    name: text('name').notNull(),
    config: jsonb('config').notNull().default({}),
    dek: text('dek'),
});

export const corsairAccounts = pgTable('corsair_accounts', {
    id: text('id').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    tenantId: text('tenant_id').notNull(),
    integrationId: text('integration_id').notNull().references(() => corsairIntegrations.id),
    config: jsonb('config').notNull().default({}),
    dek: text('dek'),
});

export const corsairEntities = pgTable('corsair_entities', {
    id: text('id').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    accountId: text('account_id').notNull().references(() => corsairAccounts.id),
    entityId: text('entity_id').notNull(),
    entityType: text('entity_type').notNull(),
    version: text('version').notNull(),
    data: jsonb('data').notNull().default({}),
});

export const corsairEvents = pgTable('corsair_events', {
    id: text('id').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    accountId: text('account_id').notNull().references(() => corsairAccounts.id),
    eventType: text('event_type').notNull(),
    payload: jsonb('payload').notNull().default({}),
    status: text('status'),
});

// Platform Tables

export const chatsTable = pgTable('chats', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const chatMessagesTable = pgTable('chat_messages', {
    id: uuid('id').primaryKey().defaultRandom(),
    chatId: uuid('chat_id').notNull().references(() => chatsTable.id, { onDelete: 'cascade' }),
    role: text('role').notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const userMemoryTable = pgTable('user_memory', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
    key: text('key').notNull(),
    value: jsonb('value').notNull().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const activityLogsTable = pgTable('activity_logs', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
    action: text('action').notNull(),
    details: jsonb('details').notNull().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const syncedEmailsTable = pgTable('synced_emails', {
    id: text('id').primaryKey(),
    userId: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
    threadId: text('thread_id'),
    subject: text('subject'),
    sender: text('sender'),
    preview: text('preview'),
    isRead: text('is_read').notNull().default('false'),
    time: timestamp('time', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const syncedEventsTable = pgTable('synced_events', {
    id: text('id').primaryKey(),
    userId: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    startTime: timestamp('start_time', { withTimezone: true }).notNull(),
    endTime: timestamp('end_time', { withTimezone: true }).notNull(),
    attendees: jsonb('attendees').notNull().default([]),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const analyticsTable = pgTable('analytics', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
    date: timestamp('date', { withTimezone: true }).notNull().defaultNow(),
    emailsRead: text('emails_read').notNull().default('0'),
    emailsSent: text('emails_sent').notNull().default('0'),
    eventsCreated: text('events_created').notNull().default('0'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});