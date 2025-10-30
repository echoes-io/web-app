# Database Architecture

Complete documentation of the Echoes database schema.

## 📊 Overview

The database uses **PostgreSQL** with **Drizzle ORM** to manage a 5-level hierarchical structure:

```
Timeline → Arc → Episode → Part → Chapter
```

Each level has a composite primary key that includes all parent levels, ensuring:
- Referential integrity
- Efficient queries
- Hierarchical navigation

## 🗂 Complete Schema

### Timelines

**Root table** - Main story containers.

```typescript
// lib/db/models/timeline.ts
export const timelines = pgTable('timelines', {
  name: text('name').primaryKey(),
  description: text('description').notNull(),
})
```

**SQL:**
```sql
CREATE TABLE timelines (
  name TEXT PRIMARY KEY,
  description TEXT NOT NULL
);
```

**Example:**
```typescript
{
  name: "main",
  description: "Main Echoes timeline"
}
```

---

### Arcs

**Level 1** - Narrative arcs within a timeline.

```typescript
// lib/db/models/arc.ts
export const arcs = pgTable('arcs', {
  timelineName: text('timeline_name')
    .notNull()
    .references(() => timelines.name, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  number: integer('number').notNull(),
  description: text('description').notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.timelineName, table.name] }),
}))
```

**SQL:**
```sql
CREATE TABLE arcs (
  timeline_name TEXT NOT NULL,
  name TEXT NOT NULL,
  number INTEGER NOT NULL,
  description TEXT NOT NULL,
  PRIMARY KEY (timeline_name, name),
  FOREIGN KEY (timeline_name) REFERENCES timelines(name) ON DELETE CASCADE
);
```

**Drizzle Relations:**
```typescript
export const arcsRelations = relations(arcs, ({ one, many }) => ({
  timeline: one(timelines, {
    fields: [arcs.timelineName],
    references: [timelines.name],
  }),
  episodes: many(episodes),
}))
```

**Example:**
```typescript
{
  timelineName: "main",
  name: "arc-1",
  number: 1,
  description: "First narrative arc"
}
```

---

### Episodes

**Level 2** - Episodes that develop the arc.

```typescript
// lib/db/models/episode.ts
export const episodes = pgTable('episodes', {
  timelineName: text('timeline_name').notNull(),
  arcName: text('arc_name').notNull(),
  number: integer('number').notNull(),
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
}, (table) => ({
  pk: primaryKey({ 
    columns: [table.timelineName, table.arcName, table.number] 
  }),
}))
```

**SQL:**
```sql
CREATE TABLE episodes (
  timeline_name TEXT NOT NULL,
  arc_name TEXT NOT NULL,
  number INTEGER NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  PRIMARY KEY (timeline_name, arc_name, number),
  FOREIGN KEY (timeline_name, arc_name) REFERENCES arcs(timeline_name, name)
);
```

**Drizzle Relations:**
```typescript
export const episodesRelations = relations(episodes, ({ one, many }) => ({
  arc: one(arcs, {
    fields: [episodes.timelineName, episodes.arcName],
    references: [arcs.timelineName, arcs.name],
  }),
  parts: many(parts),
}))
```

**Example:**
```typescript
{
  timelineName: "main",
  arcName: "arc-1",
  number: 1,
  slug: "pilot",
  title: "Pilot",
  description: "First episode of the arc"
}
```

---

### Parts

**Level 3** - Parts that subdivide an episode.

```typescript
// lib/db/models/part.ts
export const parts = pgTable('parts', {
  timelineName: text('timeline_name').notNull(),
  arcName: text('arc_name').notNull(),
  episodeNumber: integer('episode_number').notNull(),
  number: integer('number').notNull(),
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
}, (table) => ({
  pk: primaryKey({ 
    columns: [
      table.timelineName, 
      table.arcName, 
      table.episodeNumber, 
      table.number
    ] 
  }),
}))
```

**SQL:**
```sql
CREATE TABLE parts (
  timeline_name TEXT NOT NULL,
  arc_name TEXT NOT NULL,
  episode_number INTEGER NOT NULL,
  number INTEGER NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  PRIMARY KEY (timeline_name, arc_name, episode_number, number),
  FOREIGN KEY (timeline_name, arc_name, episode_number) 
    REFERENCES episodes(timeline_name, arc_name, number)
);
```

**Drizzle Relations:**
```typescript
export const partsRelations = relations(parts, ({ one, many }) => ({
  episode: one(episodes, {
    fields: [parts.timelineName, parts.arcName, parts.episodeNumber],
    references: [episodes.timelineName, episodes.arcName, episodes.number],
  }),
  chapters: many(chapters),
}))
```

**Example:**
```typescript
{
  timelineName: "main",
  arcName: "arc-1",
  episodeNumber: 1,
  number: 1,
  slug: "awakening",
  title: "Awakening",
  description: "First part of the episode"
}
```

---

### Chapters

**Level 4** - Chapters with content and metadata.

```typescript
// lib/db/models/chapter.ts
export const chapters = pgTable('chapters', {
  // Composite PK
  timelineName: text('timeline_name').notNull(),
  arcName: text('arc_name').notNull(),
  episodeNumber: integer('episode_number').notNull(),
  partNumber: integer('part_number').notNull(),
  number: integer('number').notNull(),
  
  // Metadata
  pov: text('pov').notNull(),
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  location: text('location').notNull(),
  date: text('date').notNull(),
  outfit: text('outfit'),
  kink: text('kink'),
  
  // Text Statistics
  words: integer('words').notNull(),
  characters: integer('characters').notNull(),
  charactersNoSpaces: integer('characters_no_spaces').notNull(),
  paragraphs: integer('paragraphs').notNull(),
  sentences: integer('sentences').notNull(),
  readingTimeMinutes: integer('reading_time_minutes').notNull(),
}, (table) => ({
  pk: primaryKey({ 
    name: 'chapters_pk',
    columns: [
      table.timelineName,
      table.arcName,
      table.episodeNumber,
      table.partNumber,
      table.number
    ]
  }),
}))
```

**SQL:**
```sql
CREATE TABLE chapters (
  timeline_name TEXT NOT NULL,
  arc_name TEXT NOT NULL,
  episode_number INTEGER NOT NULL,
  part_number INTEGER NOT NULL,
  number INTEGER NOT NULL,
  
  -- Metadata
  pov TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  location TEXT NOT NULL,
  date TEXT NOT NULL,
  outfit TEXT,
  kink TEXT,
  
  -- Statistics
  words INTEGER NOT NULL,
  characters INTEGER NOT NULL,
  characters_no_spaces INTEGER NOT NULL,
  paragraphs INTEGER NOT NULL,
  sentences INTEGER NOT NULL,
  reading_time_minutes INTEGER NOT NULL,
  
  CONSTRAINT chapters_pk PRIMARY KEY (
    timeline_name, arc_name, episode_number, part_number, number
  ),
  FOREIGN KEY (timeline_name, arc_name, episode_number, part_number)
    REFERENCES parts(timeline_name, arc_name, episode_number, number)
);
```

**Drizzle Relations:**
```typescript
export const chaptersRelations = relations(chapters, ({ one }) => ({
  part: one(parts, {
    fields: [
      chapters.timelineName,
      chapters.arcName,
      chapters.episodeNumber,
      chapters.partNumber
    ],
    references: [
      parts.timelineName,
      parts.arcName,
      parts.episodeNumber,
      parts.number
    ],
  }),
}))
```

**Example:**
```typescript
{
  timelineName: "main",
  arcName: "arc-1",
  episodeNumber: 1,
  partNumber: 1,
  number: 1,
  
  // Metadata
  pov: "Nic",
  title: "The Awakening",
  summary: "Nic wakes up in a new world",
  location: "Bedroom",
  date: "2024-01-01",
  outfit: "Pajamas",
  kink: null,
  
  // Statistics
  words: 1500,
  characters: 8500,
  charactersNoSpaces: 7000,
  paragraphs: 25,
  sentences: 80,
  readingTimeMinutes: 6
}
```

## 🔗 Relations

### ER Diagram

```
timelines (1) ──< arcs (N)
                    │
                    └──< episodes (N)
                            │
                            └──< parts (N)
                                    │
                                    └──< chapters (N)
```

### Cascade Delete

Foreign keys use `ON DELETE CASCADE`:

```typescript
// If you delete a timeline
DELETE FROM timelines WHERE name = 'main';
// Automatically deletes:
// - All arcs of the timeline
// - All episodes of the arcs
// - All parts of the episodes
// - All chapters of the parts
```

## 📝 Query Patterns

### Queries with Relations

```typescript
import { db } from '@/lib/db'
import { timelines, arcs, episodes, parts, chapters } from '@/lib/db/models'

// Get timeline with all levels
const timeline = await db.query.timelines.findFirst({
  where: eq(timelines.name, 'main'),
  with: {
    arcs: {
      with: {
        episodes: {
          with: {
            parts: {
              with: {
                chapters: true
              }
            }
          }
        }
      }
    }
  }
})

// Get single chapter with full path
const chapter = await db.query.chapters.findFirst({
  where: and(
    eq(chapters.timelineName, 'main'),
    eq(chapters.arcName, 'arc-1'),
    eq(chapters.episodeNumber, 1),
    eq(chapters.partNumber, 1),
    eq(chapters.number, 1)
  ),
  with: {
    part: {
      with: {
        episode: {
          with: {
            arc: {
              with: {
                timeline: true
              }
            }
          }
        }
      }
    }
  }
})
```

### Insert with Composite Keys

```typescript
// Insert timeline
await db.insert(timelines).values({
  name: 'main',
  description: 'Main timeline'
})

// Insert arc
await db.insert(arcs).values({
  timelineName: 'main',
  name: 'arc-1',
  number: 1,
  description: 'First arc'
})

// Insert episode
await db.insert(episodes).values({
  timelineName: 'main',
  arcName: 'arc-1',
  number: 1,
  slug: 'pilot',
  title: 'Pilot',
  description: 'First episode'
})

// Insert part
await db.insert(parts).values({
  timelineName: 'main',
  arcName: 'arc-1',
  episodeNumber: 1,
  number: 1,
  slug: 'awakening',
  title: 'Awakening',
  description: 'First part'
})

// Insert chapter
await db.insert(chapters).values({
  timelineName: 'main',
  arcName: 'arc-1',
  episodeNumber: 1,
  partNumber: 1,
  number: 1,
  pov: 'Nic',
  title: 'The Awakening',
  summary: 'Nic wakes up',
  location: 'Bedroom',
  date: '2024-01-01',
  words: 1500,
  characters: 8500,
  charactersNoSpaces: 7000,
  paragraphs: 25,
  sentences: 80,
  readingTimeMinutes: 6
})
```

### Update

```typescript
// Update chapter
await db
  .update(chapters)
  .set({ 
    title: 'New Title',
    words: 1600 
  })
  .where(
    and(
      eq(chapters.timelineName, 'main'),
      eq(chapters.arcName, 'arc-1'),
      eq(chapters.episodeNumber, 1),
      eq(chapters.partNumber, 1),
      eq(chapters.number, 1)
    )
  )
```

### Delete

```typescript
// Delete specific chapter
await db
  .delete(chapters)
  .where(
    and(
      eq(chapters.timelineName, 'main'),
      eq(chapters.arcName, 'arc-1'),
      eq(chapters.episodeNumber, 1),
      eq(chapters.partNumber, 1),
      eq(chapters.number, 1)
    )
  )

// Delete timeline (cascade)
await db
  .delete(timelines)
  .where(eq(timelines.name, 'main'))
```

## 🔍 Indexes

### Recommended Indexes

```sql
-- Index for slug lookup
CREATE INDEX idx_episodes_slug ON episodes(slug);
CREATE INDEX idx_parts_slug ON parts(slug);

-- Index for POV filtering
CREATE INDEX idx_chapters_pov ON chapters(pov);

-- Index for date filtering
CREATE INDEX idx_chapters_date ON chapters(date);

-- Index for location filtering
CREATE INDEX idx_chapters_location ON chapters(location);
```

### Drizzle Implementation

```typescript
// Add to schema files
export const episodes = pgTable('episodes', {
  // ... fields
}, (table) => ({
  pk: primaryKey({ columns: [...] }),
  slugIdx: index('idx_episodes_slug').on(table.slug),
}))
```

## 🚀 Migrations

### Generate Migration

```bash
npm run db:generate
```

Creates a SQL file in `drizzle/migrations/`

### Apply Migration

```bash
npm run db:migrate
```

### Direct Push (Dev Only)

```bash
npm run db:push
```

⚠️ **Warning**: Bypasses migrations, use only in development!

## 🛠 Drizzle Studio

GUI to explore and modify the database:

```bash
npm run db:studio
```

Opens [https://local.drizzle.studio](https://local.drizzle.studio)

## 📊 Type Safety

Drizzle automatically generates TypeScript types:

```typescript
// Infer types from schema
type Timeline = typeof timelines.$inferSelect
type NewTimeline = typeof timelines.$inferInsert

type Chapter = typeof chapters.$inferSelect
type NewChapter = typeof chapters.$inferInsert

// Usage
const newChapter: NewChapter = {
  timelineName: 'main',
  arcName: 'arc-1',
  episodeNumber: 1,
  partNumber: 1,
  number: 1,
  // ... other fields
}

const chapter: Chapter = await db.query.chapters.findFirst(...)
```

## 🔐 Best Practices

### 1. Use Transactions for Multiple Inserts

```typescript
await db.transaction(async (tx) => {
  await tx.insert(timelines).values({ name: 'main', ... })
  await tx.insert(arcs).values({ timelineName: 'main', ... })
  await tx.insert(episodes).values({ timelineName: 'main', ... })
})
```

### 2. Validate Composite Keys

```typescript
import { z } from 'zod'

const chapterKeySchema = z.object({
  timelineName: z.string(),
  arcName: z.string(),
  episodeNumber: z.number().int().positive(),
  partNumber: z.number().int().positive(),
  number: z.number().int().positive(),
})

type ChapterKey = z.infer<typeof chapterKeySchema>
```

### 3. Use Prepared Statements

```typescript
const getChapter = db.query.chapters.findFirst({
  where: and(
    eq(chapters.timelineName, sql.placeholder('timeline')),
    eq(chapters.arcName, sql.placeholder('arc')),
    eq(chapters.episodeNumber, sql.placeholder('episode')),
    eq(chapters.partNumber, sql.placeholder('part')),
    eq(chapters.number, sql.placeholder('number'))
  )
}).prepare()

const chapter = await getChapter.execute({
  timeline: 'main',
  arc: 'arc-1',
  episode: 1,
  part: 1,
  number: 1
})
```

## 📚 Resources

- [Drizzle ORM Docs](https://orm.drizzle.team)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Neon Docs](https://neon.tech/docs)
