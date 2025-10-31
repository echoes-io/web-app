import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-semibold mb-3">Echoes</h3>
            <p className="text-sm text-muted-foreground">
              Multi-POV digital storytelling platform exploring interconnected narratives across
              timelines.
            </p>
          </div>

          {/* Timelines */}
          <div>
            <h3 className="font-semibold mb-3">Timelines</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/anima"
                  className="text-muted-foreground hover:text-anima-600 transition-colors"
                >
                  Anima
                </Link>
              </li>
              <li>
                <Link
                  href="/eros"
                  className="text-muted-foreground hover:text-eros-600 transition-colors"
                >
                  Eros
                </Link>
              </li>
              <li>
                <Link
                  href="/bloom"
                  className="text-muted-foreground hover:text-bloom-600 transition-colors"
                >
                  Bloom
                </Link>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/echoes-io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {currentYear} Echoes. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
