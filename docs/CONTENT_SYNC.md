# Content Sync

Automatic content synchronization from timeline repositories to the web app database.

## Overview

When content is pushed to a timeline repository (e.g., `timeline-anima`), a GitHub Action parses the markdown files and syncs them to the web app via the `/api/content/sync` endpoint.

## API Endpoint

**POST** `/api/content/sync`

### Authentication

```
Authorization: Bearer <CONTENT_SYNC_TOKEN>
```

The token must be set in the web app's environment variables and as a GitHub secret in the timeline repository.

### Request Body

```json
{
  "timeline": "anima",
  "arc": "anima",
  "episode": 1,
  "part": 1,
  "chapter": 1,
  "pov": "nic",
  "title": "Login IRL",
  "date": "2024-04-19, Friday",
  "summary": "Chapter summary...",
  "location": "Londra",
  "outfit": null,
  "kink": null,
  "content": "# Chapter content in markdown..."
}
```

### Response

**Success (200)**
```json
{
  "success": true,
  "chapter": {
    "timeline": "anima",
    "arc": "anima",
    "episode": 1,
    "part": 1,
    "chapter": 1
  },
  "stats": {
    "words": 1234,
    "characters": 5678,
    "charactersNoSpaces": 4567,
    "paragraphs": 45,
    "sentences": 89,
    "readingTimeMinutes": 7
  }
}
```

**Error (400)** - Validation failed
```json
{
  "error": "Validation failed",
  "details": [...]
}
```

**Error (401)** - Unauthorized
```json
{
  "error": "Unauthorized"
}
```

## GitHub Action Example

Create `.github/workflows/sync-content.yml` in your timeline repository:

```yaml
name: Sync Content

on:
  push:
    branches: [main]
    paths:
      - 'content/**/*.md'

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install gray-matter glob

      - name: Sync chapters
        env:
          SYNC_TOKEN: ${{ secrets.CONTENT_SYNC_TOKEN }}
          API_URL: ${{ secrets.API_URL }}
        run: |
          node scripts/sync-content.js
```

## Sync Script Example

Create `scripts/sync-content.js` in your timeline repository:

```javascript
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { glob } = require('glob');

const API_URL = process.env.API_URL || 'https://echoes.io';
const SYNC_TOKEN = process.env.SYNC_TOKEN;

if (!SYNC_TOKEN) {
  console.error('SYNC_TOKEN not set');
  process.exit(1);
}

async function syncChapter(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: markdown } = matter(content);

  const payload = {
    timeline: frontmatter.timeline,
    arc: frontmatter.arc,
    episode: frontmatter.episode,
    part: frontmatter.part || null,
    chapter: frontmatter.chapter,
    pov: frontmatter.pov,
    title: frontmatter.title,
    date: frontmatter.date,
    summary: frontmatter.summary,
    location: frontmatter.location,
    outfit: frontmatter.outfit || null,
    kink: frontmatter.kink || null,
    content: markdown,
  };

  const response = await fetch(`${API_URL}/api/content/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SYNC_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to sync ${filePath}: ${JSON.stringify(error)}`);
  }

  const result = await response.json();
  console.log(`✓ Synced: ${filePath} (${result.stats.words} words)`);
}

async function main() {
  const files = await glob('content/**/*.md');
  console.log(`Found ${files.length} chapters to sync`);

  for (const file of files) {
    try {
      await syncChapter(file);
    } catch (error) {
      console.error(`✗ Error syncing ${file}:`, error.message);
      process.exit(1);
    }
  }

  console.log('✓ All chapters synced successfully');
}

main();
```

## Setup

### Web App

1. Add `CONTENT_SYNC_TOKEN` to `.env`:
   ```
   CONTENT_SYNC_TOKEN="your-secret-token-here"
   ```

2. Deploy the web app with the environment variable set.

### Timeline Repository

1. Add GitHub secrets:
   - `CONTENT_SYNC_TOKEN` - Same token as web app
   - `API_URL` - Web app URL (e.g., `https://echoes.io`)

2. Create the workflow file and sync script as shown above.

3. Push changes to trigger the sync.

## Text Statistics

The API automatically calculates:
- **words** - Word count (excluding markdown syntax)
- **characters** - Total character count
- **charactersNoSpaces** - Characters without spaces
- **paragraphs** - Number of paragraphs
- **sentences** - Number of sentences
- **readingTimeMinutes** - Estimated reading time (~200 words/min)

## Upsert Logic

The API uses an upsert strategy:
- If a chapter with the same `(timeline, arc, episode, chapter)` exists, it's updated
- Otherwise, a new chapter is created
- This allows re-syncing content without duplicates
