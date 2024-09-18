import { integer, pgTable, serial, text, timestamp, pgEnum} from 'drizzle-orm/pg-core';


export const users = pgTable('roomie_users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    // other user-related fields
  });
  

const intervalUnitEnum = pgEnum('interval_unit', ['days', 'weeks', 'months']);

export const routines = pgTable('roomie_routines', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  
  // New fields for flexible frequency
  intervalValue: integer('interval_value').notNull(), // e.g., 3, 8, 1
  intervalUnit: intervalUnitEnum('interval_unit').notNull(), // e.g., 'days', 'weeks', 'months'
  
  createdAt: timestamp('created_at').defaultNow().notNull(),

  // Foreign keys with references
  lastToDoIt: integer('last_to_do_it')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  assignedTo: integer('assigned_to')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
});


export type InsertUser = typeof users.$inferInsert;
export type InsertRoutine = typeof routines.$inferInsert;
export type SelectRoutine = typeof routines.$inferSelect;