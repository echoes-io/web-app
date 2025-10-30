import { pgTable, text, integer, primaryKey } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { timelines } from './timeline'

export const arcs = pgTable('arcs', {
  timelineName: text('timeline_name').notNull().references(() => timelines.name, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  number: integer('number').notNull(),
  description: text('description').notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.timelineName, table.name] }),
}))

export const arcsRelations = relations(arcs, ({ one, many }) => ({
  timeline: one(timelines, {
    fields: [arcs.timelineName],
    references: [timelines.name],
  }),
  episodes: many(() => episodes),
}))

export type Arc = typeof arcs.$inferSelect
export type NewArc = typeof arcs.$inferInsert

// Import episodes for relations (will be defined in episode.ts)
import type { episodes } from './episode'
