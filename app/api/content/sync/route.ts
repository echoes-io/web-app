import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from '@/lib/db';
import { chapters } from '@/lib/db/models';

// Validation schema for sync request
const SyncRequestSchema = z.object({
  timeline: z.string().min(1),
  arc: z.string().min(1),
  episode: z.number().int().positive(),
  part: z.number().int().positive().nullable(),
  chapter: z.number().int().positive(),
  pov: z.string().min(1),
  title: z.string().min(1),
  date: z.string().min(1),
  summary: z.string().min(1),
  location: z.string().min(1),
  outfit: z.string().nullable().optional(),
  kink: z.string().nullable().optional(),
  content: z.string().min(1),
});

type SyncRequest = z.infer<typeof SyncRequestSchema>;

/**
 * Calculate text statistics from markdown content
 */
function calculateTextStats(content: string) {
  // Remove markdown syntax for accurate counting
  const plainText = content
    .replace(/^#{1,6}\s+/gm, '') // Remove headers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links
    .trim();

  const words = plainText.split(/\s+/).filter((w) => w.length > 0).length;
  const characters = plainText.length;
  const charactersNoSpaces = plainText.replace(/\s/g, '').length;
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim().length > 0).length;
  const sentences = plainText.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const readingTimeMinutes = Math.ceil(words / 200); // ~200 words per minute

  return {
    words,
    characters,
    charactersNoSpaces,
    paragraphs,
    sentences,
    readingTimeMinutes,
  };
}

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

    // Calculate text statistics
    const stats = calculateTextStats(data.content);

    // Upsert chapter to database
    await db
      .insert(chapters)
      .values({
        timelineName: data.timeline,
        arcName: data.arc,
        episodeNumber: data.episode,
        partNumber: data.part,
        number: data.chapter,
        pov: data.pov,
        title: data.title,
        summary: data.summary,
        location: data.location,
        date: data.date,
        outfit: data.outfit || null,
        kink: data.kink || null,
        ...stats,
      })
      .onConflictDoUpdate({
        target: [chapters.timelineName, chapters.arcName, chapters.episodeNumber, chapters.number],
        set: {
          partNumber: data.part,
          pov: data.pov,
          title: data.title,
          summary: data.summary,
          location: data.location,
          date: data.date,
          outfit: data.outfit || null,
          kink: data.kink || null,
          ...stats,
        },
      });

    return NextResponse.json({
      success: true,
      chapter: {
        timeline: data.timeline,
        arc: data.arc,
        episode: data.episode,
        part: data.part,
        chapter: data.chapter,
      },
      stats,
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
