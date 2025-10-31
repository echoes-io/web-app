import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { ThemeDebugger } from '@/components/theme';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const timelines = [
  {
    name: 'Anima',
    slug: 'anima',
    description:
      'Growth, support, and tenderness. A journey of organic development and reassuring hope.',
    color: 'anima' as const,
    status: 'Coming Soon',
  },
  {
    name: 'Eros',
    slug: 'eros',
    description:
      'Passion, intensity, and rawness. Mature themes exploring direct and carnal connections.',
    color: 'eros' as const,
    status: 'Coming Soon',
  },
  {
    name: 'Bloom',
    slug: 'bloom',
    description: 'Blossoming, balance, and discovery. Romantic warmth with character and depth.',
    color: 'bloom' as const,
    status: 'Coming Soon',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Theme Debugger (dev only) */}
      <ThemeDebugger />

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Echoes</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Multi-POV digital storytelling platform exploring interconnected narratives across
            parallel timelines.
          </p>
          <p className="text-muted-foreground">
            Experience stories that resonate across different perspectives, where voices echo
            through time and space.
          </p>
        </div>

        {/* Timelines Grid */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Explore Timelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {timelines.map((timeline) => (
              <Link key={timeline.slug} href={`/${timeline.slug}`} className="group">
                <Card variant={timeline.color} className="h-full transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle>{timeline.name}</CardTitle>
                      {/* biome-ignore lint/suspicious/noExplicitAny: Dynamic theme variant */}
                      <Badge variant={`${timeline.color}-outline` as any} className="text-xs">
                        {timeline.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">{timeline.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant={timeline.color}
                      size="sm"
                      className="w-full group-hover:gap-3 transition-all"
                    >
                      Enter Timeline
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="max-w-3xl mx-auto mt-20 text-center">
          <h2 className="text-2xl font-bold mb-4">What is Echoes?</h2>
          <p className="text-muted-foreground mb-6">
            Echoes organizes narratives in a hierarchical structure:{' '}
            <strong>Timeline → Arc → Episode → Chapter</strong>. Each element tells part of the
            story, allowing you to explore different perspectives and temporal lines.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
