'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { DarkModeToggle } from '@/components/theme';
import { cn } from '@/lib/utils';

const timelines = [
  { name: 'Anima', href: '/anima', color: 'anima' },
  { name: 'Eros', href: '/eros', color: 'eros' },
  { name: 'Bloom', href: '/bloom', color: 'bloom' },
] as const;

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold hover:opacity-80 transition-opacity">
          Echoes
        </Link>

        {/* Timeline Links */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4">
            {timelines.map((timeline) => (
              <Link
                key={timeline.href}
                href={timeline.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname.startsWith(timeline.href) ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {timeline.name}
              </Link>
            ))}
          </div>

          {/* Dark Mode Toggle */}
          <DarkModeToggle />
        </div>
      </div>
    </nav>
  );
}
