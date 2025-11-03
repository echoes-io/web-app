import { ChapterSchema } from '@echoes-io/models';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from '@/lib/db';
import { chapters } from '@/lib/db/models';

// Extend ChapterSchema with content field for sync
const SyncRequestSchema = ChapterSchema.extend({
  content: z.string().min(1, 'Content is required'),
});

type SyncRequest = z.infer<typeof SyncRequestSchema>;

/**
 * Verify sync token
 */
function verifyToken(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  const expectedToken = process.env.CONTENT_SYNC_TOKEN;

  if (!expectedToken) {
    console.error('CONTENT_SYNC_TOKEN not configured');
    return false;
  }

  return token === expectedToken;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    if (!verifyToken(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const data: SyncRequest = SyncRequestSchema.parse(body);

    // Upsert chapter to database
    await db
      .insert(chapters)
      .values({
        timelineName: data.timelineName,
        arcName: data.arcName,
        episodeNumber: data.episodeNumber,
        partNumber: data.partNumber,
        number: data.number,
        pov: data.pov,
        title: data.title,
        summary: data.summary,
        location: data.location,
        date: data.date,
        outfit: data.outfit || null,
        kink: data.kink || null,
        words: data.words,
        characters: data.characters,
        charactersNoSpaces: data.charactersNoSpaces,
        paragraphs: data.paragraphs,
        sentences: data.sentences,
        readingTimeMinutes: data.readingTimeMinutes,
      })
      .onConflictDoUpdate({
        target: [chapters.timelineName, chapters.arcName, chapters.episodeNumber, chapters.number],
        set: {
          partNumber: data.partNumber,
          pov: data.pov,
          title: data.title,
          summary: data.summary,
          location: data.location,
          date: data.date,
          outfit: data.outfit || null,
          kink: data.kink || null,
          words: data.words,
          characters: data.characters,
          charactersNoSpaces: data.charactersNoSpaces,
          paragraphs: data.paragraphs,
          sentences: data.sentences,
          readingTimeMinutes: data.readingTimeMinutes,
        },
      });

    return NextResponse.json({
      success: true,
      chapter: {
        timelineName: data.timelineName,
        arcName: data.arcName,
        episodeNumber: data.episodeNumber,
        partNumber: data.partNumber,
        number: data.number,
      },
      stats: {
        words: data.words,
        characters: data.characters,
        charactersNoSpaces: data.charactersNoSpaces,
        paragraphs: data.paragraphs,
        sentences: data.sentences,
        readingTimeMinutes: data.readingTimeMinutes,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 },
      );
    }

    console.error('Content sync error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
