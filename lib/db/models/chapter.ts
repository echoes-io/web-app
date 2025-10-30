import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';

import { parts } from './part';

export const chapters = pgTable(
  'chapters',
  {
    timelineName: text('timeline_name').notNull(),
    arcName: text('arc_name').notNull(),
    episodeNumber: integer('episode_number').notNull(),
    partNumber: integer('part_number').notNull(),
    number: integer('number').notNull(),

    // ChapterMetadata
    pov: text('pov').notNull(),
    title: text('title').notNull(),
    summary: text('summary').notNull(),
    location: text('location').notNull(),
    date: text('date').notNull(),
    outfit: text('outfit'),
    kink: text('kink'),

    // TextStats
    words: integer('words').notNull(),
    characters: integer('characters').notNull(),
    charactersNoSpaces: integer('characters_no_spaces').notNull(),
    paragraphs: integer('paragraphs').notNull(),
    sentences: integer('sentences').notNull(),
    readingTimeMinutes: integer('reading_time_minutes').notNull(),
  },
  (table) => [
    {
      pk: primaryKey({
        name: 'chapters_pk',
        columns: [
          table.timelineName,
          table.arcName,
          table.episodeNumber,
          table.partNumber,
          table.number,
        ],
      }),
    },
  ],
);

export const chaptersRelations = relations(chapters, ({ one }) => ({
  part: one(parts, {
    fields: [chapters.timelineName, chapters.arcName, chapters.episodeNumber, chapters.partNumber],
    references: [parts.timelineName, parts.arcName, parts.episodeNumber, parts.number],
  }),
}));

export type Chapter = typeof chapters.$inferSelect;
export type NewChapter = typeof chapters.$inferInsert;
