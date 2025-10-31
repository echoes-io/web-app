'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type Theme, useTheme } from '@/lib/theme';

const themes: Theme[] = ['neutral', 'anima', 'eros', 'bloom'];

const themeInfo = {
  neutral: { name: 'Neutral', description: 'GitHub-inspired grays' },
  anima: { name: 'Anima', description: 'Sage green - growth, tenderness' },
  eros: { name: 'Eros', description: 'Burgundy - passion, intensity' },
  bloom: { name: 'Bloom', description: 'Terracotta peach - balance, discovery' },
};

export function ThemeDebugger() {
  const { theme, mode, setTheme, setMode } = useTheme();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-lg z-50">
      <CardHeader>
        <CardTitle className="text-sm">🐛 Theme Debugger</CardTitle>
        <CardDescription className="text-xs">
          Current: <Badge variant="outline">{theme}</Badge> /{' '}
          <Badge variant="outline">{mode}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Theme Selector */}
        <div>
          <p className="text-xs font-medium mb-2">Timeline Theme:</p>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((t) => (
              <Button
                key={t}
                variant={theme === t ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme(t)}
                className="text-xs"
              >
                {themeInfo[t].name}
              </Button>
            ))}
          </div>
        </div>

        {/* Mode Toggle */}
        <div>
          <p className="text-xs font-medium mb-2">Mode:</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={mode === 'light' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('light')}
              className="text-xs"
            >
              Light
            </Button>
            <Button
              variant={mode === 'dark' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('dark')}
              className="text-xs"
            >
              Dark
            </Button>
          </div>
        </div>

        {/* Color Preview */}
        <div>
          <p className="text-xs font-medium mb-2">Theme Colors:</p>
          <div className="grid grid-cols-5 gap-1">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
              <div
                key={shade}
                className="h-6 rounded"
                style={{ backgroundColor: `var(--color-${theme}-${shade})` }}
                title={`${theme}-${shade}`}
              />
            ))}
          </div>
        </div>

        {/* Theme Info */}
        <div className="text-xs text-muted-foreground">{themeInfo[theme].description}</div>
      </CardContent>
    </Card>
  );
}
