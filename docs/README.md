# Echoes Web Application

Web application for the Echoes narrative platform, built with Next.js 16 and TypeScript.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Setup & Development](#setup--development)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)

## 🛠 Tech Stack

### Core
- **Framework**: Next.js 16.0.1 (App Router)
- **Runtime**: React 19.2.0
- **Language**: TypeScript 5

### Styling
- **CSS Framework**: Tailwind CSS 4
- **Component Library**: shadcn/ui (Radix UI)
- **Design System**: @echoes-io/brand
- **Utilities**: 
  - `clsx` - conditional classes
  - `tailwind-merge` - merge Tailwind classes
  - `class-variance-authority` - variant management

### Database
- **ORM**: Drizzle ORM 0.44.7
- **Database**: PostgreSQL (via Neon)
- **Client**: postgres.js 3.4.7
- **Migrations**: drizzle-kit 0.31.6

### UI Components
- **Icons**: lucide-react 0.548.0
- **Notifications**: sonner 2.0.7
- **Theme**: next-themes 0.4.6

### Development Tools
- **Linter/Formatter**: Biome 2.2.0
- **Environment**: dotenv 17.2.3

## 🏗 Architecture

### Content Hierarchical Model

Echoes organizes content in a 5-level hierarchical structure:

```
Timeline
  └── Arc (Story arc)
      └── Episode
          └── Part
              └── Chapter
```

#### 1. Timeline
Main story container. Represents a timeline or narrative universe.

**Fields:**
- `name` (PK): Timeline identifier
- `description`: Timeline description

#### 2. Arc
Narrative arc within a timeline. Groups related episodes.

**Fields:**
- `timelineName` (FK → Timeline)
- `name` (Composite PK with timelineName)
- `number`: Arc sequential number
- `description`: Arc description

**Relations:**
- Belongs to one Timeline
- Contains multiple Episodes

#### 3. Episode
Episode that develops the story arc.

**Fields:**
- `timelineName`, `arcName` (FK → Arc)
- `number` (Composite PK)
- `slug`: URL-friendly identifier
- `title`: Episode title
- `description`: Description

**Relations:**
- Belongs to one Arc
- Contains multiple Parts

#### 4. Part
Part of an episode, logical content subdivision.

**Fields:**
- `timelineName`, `arcName`, `episodeNumber` (FK → Episode)
- `number` (Composite PK)
- `slug`: URL-friendly identifier
- `title`: Part title
- `description`: Description

**Relations:**
- Belongs to one Episode
- Contains multiple Chapters

#### 5. Chapter
Atomic content unit with metadata and statistics.

**Fields:**
- `timelineName`, `arcName`, `episodeNumber`, `partNumber` (FK → Part)
- `number` (Composite PK)

**Metadata:**
- `pov`: Point of View (narrative perspective)
- `title`: Chapter title
- `summary`: Summary
- `location`: Action location
- `date`: Narrative date
- `outfit`: Outfit description (optional)
- `kink`: Content tag (optional)

**Text Statistics:**
- `words`: Word count
- `characters`: Character count (with spaces)
- `charactersNoSpaces`: Character count (without spaces)
- `paragraphs`: Paragraph count
- `sentences`: Sentence count
- `readingTimeMinutes`: Estimated reading time

**Relations:**
- Belongs to one Part

### Database Schema

```sql
-- Timeline (root)
timelines (
  name TEXT PRIMARY KEY,
  description TEXT NOT NULL
)

-- Arc (level 1)
arcs (
  timeline_name TEXT REFERENCES timelines(name) ON DELETE CASCADE,
  name TEXT,
  number INTEGER NOT NULL,
  description TEXT NOT NULL,
  PRIMARY KEY (timeline_name, name)
)

-- Episode (level 2)
episodes (
  timeline_name TEXT,
  arc_name TEXT,
  number INTEGER,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  PRIMARY KEY (timeline_name, arc_name, number),
  FOREIGN KEY (timeline_name, arc_name) REFERENCES arcs
)

-- Part (level 3)
parts (
  timeline_name TEXT,
  arc_name TEXT,
  episode_number INTEGER,
  number INTEGER,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  PRIMARY KEY (timeline_name, arc_name, episode_number, number),
  FOREIGN KEY (timeline_name, arc_name, episode_number) REFERENCES episodes
)

-- Chapter (level 4)
chapters (
  timeline_name TEXT,
  arc_name TEXT,
  episode_number INTEGER,
  part_number INTEGER,
  number INTEGER,
  -- metadata fields
  pov TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  location TEXT NOT NULL,
  date TEXT NOT NULL,
  outfit TEXT,
  kink TEXT,
  -- stats fields
  words INTEGER NOT NULL,
  characters INTEGER NOT NULL,
  characters_no_spaces INTEGER NOT NULL,
  paragraphs INTEGER NOT NULL,
  sentences INTEGER NOT NULL,
  reading_time_minutes INTEGER NOT NULL,
  PRIMARY KEY (timeline_name, arc_name, episode_number, part_number, number),
  FOREIGN KEY (timeline_name, arc_name, episode_number, part_number) REFERENCES parts
)
```

## 📁 Project Structure

```
web-app/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   ├── globals.css          # Global styles
│   └── favicon.ico          # Favicon
│
├── components/              # React components
│   └── ui/                  # shadcn/ui components
│
├── lib/                     # Utilities and configurations
│   ├── db/                  # Database layer
│   │   ├── index.ts        # Drizzle client
│   │   └── models/         # Drizzle schema
│   └── utils.ts            # Utility functions
│
├── drizzle/                # Database migrations
│   └── migrations/
│
├── docs/                   # Documentation
│   ├── README.md          # Main documentation
│   ├── DATABASE.md        # Database architecture
│   ├── COMPONENTS.md      # UI components guide
│   └── DEVELOPMENT.md     # Development guide
│
└── public/                # Static assets
```

## 🚀 Setup & Development

### Prerequisites

- Node.js 20+
- npm/pnpm/yarn/bun
- PostgreSQL database (Neon recommended)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd web-app

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your credentials
```

### Environment Variables

Create a `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Database Setup

```bash
# Generate migrations from schema
npm run db:generate

# Apply migrations
npm run db:migrate

# Or direct push (dev only)
npm run db:push

# Open Drizzle Studio (GUI)
npm run db:studio
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

```json
{
  "dev": "next dev",                    // Development server
  "build": "next build",                // Production build
  "start": "next start",                // Production server
  "lint": "biome check",                // Lint code
  "format": "biome format --write",     // Format code
  "db:generate": "drizzle-kit generate", // Generate migrations
  "db:migrate": "drizzle-kit migrate",   // Run migrations
  "db:push": "drizzle-kit push",        // Push schema (dev)
  "db:studio": "drizzle-kit studio"     // Open Drizzle Studio
}
```

## 🎨 Design System

### UI Components

The project uses **shadcn/ui**, a collection of reusable React components built with:
- Radix UI (primitives)
- Tailwind CSS (styling)
- class-variance-authority (variants)

Components are in `components/ui/` and can be customized directly.

### Brand Package

The `@echoes-io/brand` package contains:
- Color palette for timelines
- Typography system
- Spacing scale
- Component variants

### Theme

Dark/light mode support via `next-themes`.

## 🚢 Deployment

### Vercel (Recommended)

The project is configured for automatic deployment on Vercel:

1. Push to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Automatic deployment

### Environment Variables (Production)

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### Local Build

```bash
npm run build
npm run start
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com)

## 🔗 Useful Links

- **Repository**: [GitHub](https://github.com/your-org/echoes-io)
- **Production**: [echoes.io](https://echoes.io)
- **Staging**: [staging.echoes.io](https://staging.echoes.io)
- **Drizzle Studio**: `npm run db:studio`

## 📝 Notes

- The project uses **Next.js 16** with App Router
- **React 19** is in use (stable version)
- **TypeScript strict mode** is enabled
- **Biome** replaces ESLint + Prettier for performance
- Migrations are managed with **Drizzle Kit**
- Database is **PostgreSQL** (Neon recommended for dev/staging)
