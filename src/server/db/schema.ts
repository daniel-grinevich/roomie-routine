import { integer, pgTable, serial, text, timestamp, pgEnum, varchar, pgTableCreator, index, primaryKey, foreignKey } from 'drizzle-orm/pg-core';  
import { relations, sql } from "drizzle-orm";
import { type AdapterAccount } from "next-auth/adapters";



const intervalUnitEnum = pgEnum('interval_unit', ['days', 'weeks', 'months']);
const requestStatusEnum = pgEnum('request_status', ['pending', 'rejected', 'timeout', 'accepted']);
const friendshipStatusEnum = pgEnum('friendship_status', ['active', 'blocked', 'inactive']);


export const createTable = pgTableCreator((name) => `roomie_${name}`);



export const routines = createTable('routine', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),

  // New fields for flexible frequency
  intervalValue: integer('interval_value').notNull(), // e.g., 3, 8, 1
  intervalUnit: intervalUnitEnum('interval_unit').notNull(), // e.g., 'days', 'weeks', 'months'
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  resetAt: timestamp('reset_at').defaultNow().notNull(),

  // Foreign keys with references
  lastToDoIt: varchar('last_to_do_it')
    .references(() => users.id, { onDelete: 'cascade' }),
  assignedTo: varchar('assigned_to')
    .references(() => users.id, { onDelete: 'cascade' }),
  createdBy: varchar('created_by')
    .references(() => users.id, {onDelete: 'cascade'} ).notNull(),
});

export const routineGroups = createTable('routine_groups', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  createdBy: varchar('created_by')
  .references(() => users.id, {onDelete: 'cascade'} ).notNull(),
});

// Junction table for many-to-many relationship between routines and groups
export const groupsToRoutines = createTable(
  'groups_to_routines', 
  {
    groupId: integer('group_id')
      .references(() => routineGroups.id, { onDelete: 'cascade' }),
    routineId: integer('routine_id')
      .references(() => routines.id, { onDelete: 'cascade' }),
  }, (groupsToRoutines) => ({
    compoundKey: primaryKey({ columns: [groupsToRoutines.groupId, groupsToRoutines.routineId]}),
  })
);

export const groupUsers = createTable('group_users', {
  id: serial('id').primaryKey(),
  groupId: integer('group_id')
    .notNull()
    .references(() => routineGroups.id, { onDelete: 'cascade' }),
  userId: varchar('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

export const invitations = createTable('invitation', {
  id: serial('id').primaryKey(),
  groupId: integer('group_id')
    .notNull()
    .references(() => routineGroups.id, { onDelete: 'cascade' }),
  senderId: varchar('sender_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  recipientId: varchar('recipient_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  status: requestStatusEnum('status').notNull(), // Utilizing previously defined enum for consistency
});

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const friendRequests = createTable(
  "friend_request",
  {
    id: serial('id').primaryKey(),
    sender: varchar("sender", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    recipient: varchar("recipient", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    status: requestStatusEnum('status').notNull(),
  }
);

export const friendships = createTable(
  "friendship",
  {
    userOne: varchar("user_one", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    userTwo: varchar("user_two", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    status: friendshipStatusEnum('friendshipStatus').notNull(),
  }, (friend) => ({
    compoundKey: primaryKey({ columns: [friend.userOne, friend.userTwo] }),
  })
);


// Types for selecting records from tables
export type SelectUser = typeof users.$inferSelect;
export type SelectRoutine = typeof routines.$inferSelect;
export type SelectGroup = typeof routineGroups.$inferSelect; // Corrected the name to match the table
export type SelectInvitation = typeof invitations.$inferSelect;
export type SelectFriendRequest = typeof friendRequests.$inferSelect;
export type SelectFriendship = typeof friendships.$inferSelect;
export type SelectAccount = typeof accounts.$inferSelect;
export type SelectSession = typeof sessions.$inferSelect;
export type SelectVerificationToken = typeof verificationTokens.$inferSelect;

// Types for inserting new records into tables
export type InsertUser = typeof users.$inferInsert;
export type InsertRoutine = typeof routines.$inferInsert;
export type InsertGroup = typeof routineGroups.$inferInsert;
export type InsertInvitation = typeof invitations.$inferInsert;
export type InsertFriendRequest = typeof friendRequests.$inferInsert;
export type InsertFriendship = typeof friendships.$inferInsert;
export type InsertAccount = typeof accounts.$inferInsert;
export type InsertSession = typeof sessions.$inferInsert;
export type InsertVerificationToken = typeof verificationTokens.$inferInsert;

// Types for updating records in tables
export type UpdateUser = Partial<InsertUser>;
export type UpdateRoutine = Partial<InsertRoutine>;
export type UpdateGroup = Partial<InsertGroup>;
export type UpdateInvitation = Partial<InsertInvitation>;
export type UpdateFriendRequest = Partial<InsertFriendRequest>;
export type UpdateFriendship = Partial<InsertFriendship>;
export type UpdateAccount = Partial<InsertAccount>;
export type UpdateSession = Partial<InsertSession>;
export type UpdateVerificationToken = Partial<InsertVerificationToken>;