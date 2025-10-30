import { pgTable, text } from 'drizzle-orm/pg-core'

export const timelines = pgTable('timelines', {
  name: text('name').primaryKey(),
  description: text('description').notNull(),
})

export type Timeline = typeof timelines.$inferSelect
export type NewTimeline = typeof timelines.$inferInsert
