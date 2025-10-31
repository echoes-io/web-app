import { cookies } from 'next/headers';

import type { Mode } from './ThemeProvider';

/**
 * Get mode preference from cookie (server-side)
 * Used to prevent flash on initial load
 */
export async function getModeFromCookie(): Promise<Mode> {
  const cookieStore = await cookies();
  const modeCookie = cookieStore.get('echoes-mode');

  if (modeCookie?.value === 'dark' || modeCookie?.value === 'light') {
    return modeCookie.value;
  }

  return 'light';
}
