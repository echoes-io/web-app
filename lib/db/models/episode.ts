import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';

import { arcs } from './arc';
import { parts } from './part';

export const episodes = pgTable(
  'episodes',
  {
    timelineName: text('timeline_name').notNull(),
    arcName: text('arc_name').notNull(),
    number: integer('number').notNull(),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
  },
  (table) => [
    {
      pk: primaryKey({
        columns: [table.timelineName, table.arcName, table.number],
      }),
      fk: {
        arc: [table.timelineName, table.arcName],
      },
    },
  ],
);

export const episodesRelations = relations(episodes, ({ one, many }) => ({
  arc: one(arcs, {
    fields: [episodes.timelineName, episodes.arcName],
    references: [arcs.timelineName, arcs.name],
  }),
  parts: many(parts),
}));

export type Episode = typeof episodes.$inferSelect;
export type NewEpisode = typeof episodes.$inferInsert;
