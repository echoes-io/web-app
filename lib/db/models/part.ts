import { pgTable, text, integer, primaryKey } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { episodes } from './episode'

export const parts = pgTable('parts', {
  timelineName: text('timeline_name').notNull(),
  arcName: text('arc_name').notNull(),
  episodeNumber: integer('episode_number').notNull(),
  number: integer('number').notNull(),
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.timelineName, table.arcName, table.episodeNumber, table.number] }),
}))

export const partsRelations = relations(parts, ({ one, many }) => ({
  episode: one(episodes, {
    fields: [parts.timelineName, parts.arcName, parts.episodeNumber],
    references: [episodes.timelineName, episodes.arcName, episodes.number],
  }),
  chapters: many(() => chapters),
}))

export type Part = typeof parts.$inferSelect
export type NewPart = typeof parts.$inferInsert

// Import chapters for relations (will be defined in chapter.ts)
import type { chapters } from './chapter'
