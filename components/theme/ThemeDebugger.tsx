'use client';

import { Info } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type Theme, useTheme } from '@/lib/theme';

const themes: Theme[] = ['neutral', 'anima', 'eros', 'bloom'];

const themeInfo = {
  neutral: { name: 'Neutral', description: 'GitHub-inspired grays' },
  anima: { name: 'Anima', description: 'Sage green - growth, tenderness' },
  eros: { name: 'Eros', description: 'Burgundy - passion, intensity' },
  bloom: {
    name: 'Bloom',
    description: 'Terracotta peach - balance, discovery',
  },
};

export function ThemeDebugger() {
  const { theme, mode, setTheme, setMode } = useTheme();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-[420px] max-h-[90vh] overflow-auto shadow-lg z-50">
      <CardHeader>
        <CardTitle className="text-sm">🐛 Theme Debugger</CardTitle>
        <CardDescription className="text-xs">
          Current: <Badge variant="outline">{theme}</Badge> /{' '}
          <Badge variant="outline">{mode}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="controls" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="controls" className="space-y-4 mt-4">
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
              <div className="grid grid-cols-11 gap-0.5">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
                  <div
                    key={shade}
                    className="h-6 rounded"
                    style={{
                      backgroundColor: `var(--color-${theme}-${shade})`,
                    }}
                    title={`${theme}-${shade}`}
                  />
                ))}
              </div>
            </div>

            {/* Theme Info */}
            <div className="text-xs text-muted-foreground">{themeInfo[theme].description}</div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4 mt-4">
            {/* Buttons Preview */}
            <div>
              <p className="text-xs font-medium mb-2">Buttons:</p>
              <div className="flex flex-wrap gap-2">
                <Button variant={theme} size="sm">
                  Solid
                </Button>
                {/* biome-ignore lint/suspicious/noExplicitAny: Dynamic theme variant */}
                <Button variant={`${theme}-outline` as any} size="sm">
                  Outline
                </Button>
              </div>
            </div>

            {/* Badges Preview */}
            <div>
              <p className="text-xs font-medium mb-2">Badges:</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant={theme}>Solid</Badge>
                {/* biome-ignore lint/suspicious/noExplicitAny: Dynamic theme variant */}
                <Badge variant={`${theme}-outline` as any}>Outline</Badge>
              </div>
            </div>

            {/* Card Preview */}
            <div>
              <p className="text-xs font-medium mb-2">Card:</p>
              <Card variant={theme} className="py-3">
                <CardHeader className="py-0 px-3">
                  <CardTitle className="text-xs">Card Title</CardTitle>
                  <CardDescription className="text-[10px]">Card description</CardDescription>
                </CardHeader>
                <CardContent className="px-3 text-xs">Card content goes here</CardContent>
              </Card>
            </div>

            {/* Alert Preview */}
            <div>
              <p className="text-xs font-medium mb-2">Alert:</p>
              <Alert variant={theme}>
                <Info className="h-4 w-4" />
                <AlertTitle className="text-xs">Info</AlertTitle>
                <AlertDescription className="text-[10px]">
                  This is a themed alert component
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
