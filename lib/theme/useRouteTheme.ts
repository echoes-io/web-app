'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { type Theme, useTheme } from './ThemeProvider';

/**
 * Automatically sets theme based on current route
 * - /anima/* → anima theme
 * - /eros/* → eros theme
 * - /bloom/* → bloom theme
 * - /* → neutral theme
 */
export function useRouteTheme() {
  const pathname = usePathname();
  const { setTheme } = useTheme();

  useEffect(() => {
    // Extract first segment after /
    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0];

    let detectedTheme: Theme = 'neutral';

    if (firstSegment === 'anima') {
      detectedTheme = 'anima';
    } else if (firstSegment === 'eros') {
      detectedTheme = 'eros';
    } else if (firstSegment === 'bloom') {
      detectedTheme = 'bloom';
    }

    setTheme(detectedTheme);
  }, [pathname, setTheme]);
}
