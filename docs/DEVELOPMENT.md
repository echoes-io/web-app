# Development Guide

Complete guide to developing the Echoes application.

## 🚀 Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd web-app
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with DATABASE_URL

# Setup database
npm run db:push

# Start dev server
npm run dev
```

## 📁 Project Conventions

### File Naming

```
PascalCase:
- React Components: TimelineCard.tsx
- Types/Interfaces: Chapter.ts

camelCase:
- Utilities: formatDate.ts
- Hooks: useTimeline.ts
- Actions: createChapter.ts

kebab-case:
- Routes: [timeline]/page.tsx
- CSS modules: timeline-card.module.css
```

### Folder Structure

```
app/
├── (routes)/              # Route groups
│   ├── (timelines)/      # Timeline routes
│   │   └── [timeline]/
│   │       └── page.tsx
│   └── (admin)/          # Admin routes
│       └── dashboard/
│           └── page.tsx
├── api/                  # API routes
│   └── chapters/
│       └── route.ts
├── layout.tsx            # Root layout
└── page.tsx              # Homepage

components/
├── ui/                   # shadcn/ui components
├── timeline/             # Timeline-specific
│   ├── TimelineCard.tsx
│   └── TimelineList.tsx
└── chapter/              # Chapter-specific
    ├── ChapterCard.tsx
    └── ChapterReader.tsx

lib/
├── db/                   # Database
│   ├── index.ts
│   ├── models/
│   └── queries/
├── utils/                # Utilities
│   ├── format.ts
│   └── validation.ts
└── hooks/                # Custom hooks
    └── useTimeline.ts
```

## 🎯 Next.js 16 Patterns

### Server Components (Default)

```tsx
// app/(timelines)/[timeline]/page.tsx
import { db } from '@/lib/db'
import { timelines } from '@/lib/db/models'
import { eq } from 'drizzle-orm'

export default async function TimelinePage({
  params,
}: {
  params: { timeline: string }
}) {
  // Fetch directly in component
  const timeline = await db.query.timelines.findFirst({
    where: eq(timelines.name, params.timeline),
    with: {
      arcs: true,
    },
  })

  if (!timeline) {
    notFound()
  }

  return (
    <div>
      <h1>{timeline.name}</h1>
      <p>{timeline.description}</p>
      {/* ... */}
    </div>
  )
}
```

### Client Components

```tsx
// components/timeline/TimelineSelector.tsx
'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'

interface TimelineSelectorProps {
  timelines: Timeline[]
  onSelect: (timeline: Timeline) => void
}

export function TimelineSelector({ timelines, onSelect }: TimelineSelectorProps) {
  const [selected, setSelected] = useState<string>()

  return (
    <Select
      value={selected}
      onValueChange={(value) => {
        setSelected(value)
        const timeline = timelines.find((t) => t.name === value)
        if (timeline) onSelect(timeline)
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select timeline" />
      </SelectTrigger>
      <SelectContent>
        {timelines.map((timeline) => (
          <SelectItem key={timeline.name} value={timeline.name}>
            {timeline.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

### Server Actions

```tsx
// app/actions/chapter.ts
'use server'

import { db } from '@/lib/db'
import { chapters } from '@/lib/db/models'
import { revalidatePath } from 'next/cache'

export async function createChapter(data: NewChapter) {
  await db.insert(chapters).values(data)
  
  // Revalidate cache
  revalidatePath(`/${data.timelineName}/${data.arcName}/${data.episodeNumber}`)
  
  return { success: true }
}

export async function updateChapter(
  key: ChapterKey,
  data: Partial<Chapter>
) {
  await db
    .update(chapters)
    .set(data)
    .where(
      and(
        eq(chapters.timelineName, key.timelineName),
        eq(chapters.arcName, key.arcName),
        eq(chapters.episodeNumber, key.episodeNumber),
        eq(chapters.partNumber, key.partNumber),
        eq(chapters.number, key.number)
      )
    )
  
  revalidatePath(`/${key.timelineName}/${key.arcName}/${key.episodeNumber}`)
  
  return { success: true }
}
```

**Usage in Client Component:**

```tsx
'use client'

import { createChapter } from '@/app/actions/chapter'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function CreateChapterForm() {
  async function handleSubmit(formData: FormData) {
    const result = await createChapter({
      timelineName: formData.get('timeline') as string,
      // ... other fields
    })
    
    if (result.success) {
      toast.success('Chapter created!')
    }
  }

  return (
    <form action={handleSubmit}>
      {/* form fields */}
      <Button type="submit">Create</Button>
    </form>
  )
}
```

### Streaming with Suspense

```tsx
// app/(timelines)/[timeline]/page.tsx
import { Suspense } from 'react'
import { TimelineHeader } from '@/components/timeline/TimelineHeader'
import { ArcList } from '@/components/timeline/ArcList'
import { ArcListSkeleton } from '@/components/timeline/ArcListSkeleton'

export default function TimelinePage({ params }: { params: { timeline: string } }) {
  return (
    <div>
      <Suspense fallback={<div>Loading header...</div>}>
        <TimelineHeader timeline={params.timeline} />
      </Suspense>
      
      <Suspense fallback={<ArcListSkeleton />}>
        <ArcList timeline={params.timeline} />
      </Suspense>
    </div>
  )
}
```

### Parallel Routes

```
app/
└── (timelines)/
    └── [timeline]/
        ├── @sidebar/
        │   └── page.tsx
        ├── @content/
        │   └── page.tsx
        └── layout.tsx
```

```tsx
// app/(timelines)/[timeline]/layout.tsx
export default function TimelineLayout({
  children,
  sidebar,
  content,
}: {
  children: React.ReactNode
  sidebar: React.ReactNode
  content: React.ReactNode
}) {
  return (
    <div className="flex">
      <aside className="w-64">{sidebar}</aside>
      <main className="flex-1">{content}</main>
    </div>
  )
}
```

## 🗃 Database Patterns

### Query Helpers

```typescript
// lib/db/queries/timeline.ts
import { db } from '@/lib/db'
import { timelines, arcs, episodes } from '@/lib/db/models'
import { eq } from 'drizzle-orm'

export async function getTimelineWithArcs(timelineName: string) {
  return db.query.timelines.findFirst({
    where: eq(timelines.name, timelineName),
    with: {
      arcs: {
        orderBy: (arcs, { asc }) => [asc(arcs.number)],
        with: {
          episodes: {
            orderBy: (episodes, { asc }) => [asc(episodes.number)],
          },
        },
      },
    },
  })
}

export async function getChapterWithPath(key: ChapterKey) {
  return db.query.chapters.findFirst({
    where: and(
      eq(chapters.timelineName, key.timelineName),
      eq(chapters.arcName, key.arcName),
      eq(chapters.episodeNumber, key.episodeNumber),
      eq(chapters.partNumber, key.partNumber),
      eq(chapters.number, key.number)
    ),
    with: {
      part: {
        with: {
          episode: {
            with: {
              arc: {
                with: {
                  timeline: true,
                },
              },
            },
          },
        },
      },
    },
  })
}
```

### Transactions

```typescript
// lib/db/queries/bulk.ts
import { db } from '@/lib/db'
import { timelines, arcs, episodes, parts, chapters } from '@/lib/db/models'

export async function createTimelineWithContent(data: {
  timeline: NewTimeline
  arcs: NewArc[]
  episodes: NewEpisode[]
  parts: NewPart[]
  chapters: NewChapter[]
}) {
  await db.transaction(async (tx) => {
    // Insert timeline
    await tx.insert(timelines).values(data.timeline)
    
    // Insert arcs
    if (data.arcs.length > 0) {
      await tx.insert(arcs).values(data.arcs)
    }
    
    // Insert episodes
    if (data.episodes.length > 0) {
      await tx.insert(episodes).values(data.episodes)
    }
    
    // Insert parts
    if (data.parts.length > 0) {
      await tx.insert(parts).values(data.parts)
    }
    
    // Insert chapters
    if (data.chapters.length > 0) {
      await tx.insert(chapters).values(data.chapters)
    }
  })
}
```

### Prepared Statements

```typescript
// lib/db/queries/prepared.ts
import { db } from '@/lib/db'
import { chapters } from '@/lib/db/models'
import { eq, and, sql } from 'drizzle-orm'

export const getChapterByKey = db.query.chapters
  .findFirst({
    where: and(
      eq(chapters.timelineName, sql.placeholder('timeline')),
      eq(chapters.arcName, sql.placeholder('arc')),
      eq(chapters.episodeNumber, sql.placeholder('episode')),
      eq(chapters.partNumber, sql.placeholder('part')),
      eq(chapters.number, sql.placeholder('number'))
    ),
  })
  .prepare('get_chapter_by_key')

// Usage
const chapter = await getChapterByKey.execute({
  timeline: 'main',
  arc: 'arc-1',
  episode: 1,
  part: 1,
  number: 1,
})
```

## 🎨 Styling Patterns

### Tailwind Utilities

```tsx
import { cn } from '@/lib/utils'

export function TimelineCard({ timeline, className }: TimelineCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card p-6',
        'hover:shadow-lg transition-shadow',
        'dark:border-gray-800',
        className
      )}
    >
      {/* content */}
    </div>
  )
}
```

### CSS Variables

```css
/* app/globals.css */
@layer base {
  :root {
    --timeline-main: 220 70% 50%;
    --timeline-alt: 280 70% 50%;
  }
}

@layer utilities {
  .timeline-gradient {
    @apply bg-gradient-to-r from-[hsl(var(--timeline-main))] to-[hsl(var(--timeline-alt))];
  }
}
```

```tsx
<div className="timeline-gradient p-4">
  Timeline content
</div>
```

## 🔧 Custom Hooks

### useTimeline

```typescript
// lib/hooks/useTimeline.ts
'use client'

import { useState, useEffect } from 'react'
import type { Timeline } from '@/lib/db/models'

export function useTimeline(timelineName: string) {
  const [timeline, setTimeline] = useState<Timeline | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetch(`/api/timelines/${timelineName}`)
      .then((res) => res.json())
      .then((data) => {
        setTimeline(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err)
        setLoading(false)
      })
  }, [timelineName])

  return { timeline, loading, error }
}
```

### useChapterNavigation

```typescript
// lib/hooks/useChapterNavigation.ts
'use client'

import { useRouter } from 'next/navigation'
import type { ChapterKey } from '@/lib/db/models'

export function useChapterNavigation() {
  const router = useRouter()

  function navigateToChapter(key: ChapterKey) {
    router.push(
      `/${key.timelineName}/${key.arcName}/${key.episodeNumber}/${key.partNumber}/${key.number}`
    )
  }

  function navigateToNextChapter(currentKey: ChapterKey) {
    // Logic to find next chapter
    const nextKey = { ...currentKey, number: currentKey.number + 1 }
    navigateToChapter(nextKey)
  }

  function navigateToPreviousChapter(currentKey: ChapterKey) {
    // Logic to find previous chapter
    const prevKey = { ...currentKey, number: currentKey.number - 1 }
    navigateToChapter(prevKey)
  }

  return {
    navigateToChapter,
    navigateToNextChapter,
    navigateToPreviousChapter,
  }
}
```

## 🧪 Testing

### Unit Tests (Vitest)

```typescript
// lib/utils/format.test.ts
import { describe, it, expect } from 'vitest'
import { formatReadingTime } from './format'

describe('formatReadingTime', () => {
  it('formats minutes correctly', () => {
    expect(formatReadingTime(5)).toBe('5 min read')
    expect(formatReadingTime(1)).toBe('1 min read')
  })

  it('formats hours correctly', () => {
    expect(formatReadingTime(60)).toBe('1 hour read')
    expect(formatReadingTime(120)).toBe('2 hours read')
  })
})
```

### Component Tests

```typescript
// components/timeline/TimelineCard.test.tsx
import { render, screen } from '@testing-library/react'
import { TimelineCard } from './TimelineCard'

describe('TimelineCard', () => {
  it('renders timeline name', () => {
    const timeline = {
      name: 'main',
      description: 'Main timeline',
    }

    render(<TimelineCard timeline={timeline} arcCount={3} />)

    expect(screen.getByText('main')).toBeInTheDocument()
    expect(screen.getByText('3 arcs')).toBeInTheDocument()
  })
})
```

### E2E Tests (Playwright)

```typescript
// e2e/timeline.spec.ts
import { test, expect } from '@playwright/test'

test('navigate to timeline', async ({ page }) => {
  await page.goto('/')
  
  await page.click('text=main')
  
  await expect(page).toHaveURL('/main')
  await expect(page.locator('h1')).toContainText('main')
})
```

## 📝 Code Quality

### Biome Configuration

```json
// biome.json
{
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noExplicitAny": "error"
      },
      "style": {
        "useConst": "error"
      }
    }
  }
}
```

### Pre-commit Hook

```bash
# .husky/pre-commit
#!/bin/sh
npm run lint
npm run format
```

## 🚀 Performance

### Image Optimization

```tsx
import Image from 'next/image'

export function ChapterCover({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
      priority // For above-the-fold images
    />
  )
}
```

### Font Optimization

```tsx
// app/layout.tsx
import { Geist, Geist_Mono } from 'next/font/google'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})
```

### Caching

```tsx
// app/(timelines)/[timeline]/page.tsx
export const revalidate = 3600 // ISR: revalidate every hour

export default async function TimelinePage({ params }) {
  // Cached for 1 hour
  const timeline = await getTimeline(params.timeline)
  
  return <div>{/* ... */}</div>
}
```

## 📚 Resources

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Vitest Docs](https://vitest.dev)
- [Playwright Docs](https://playwright.dev)
