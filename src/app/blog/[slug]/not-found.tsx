import Link from 'next/link';
import { ArrowLeft, FileQuestion } from 'lucide-react';
import { ThemeSwitcher } from '@/components/theme-switcher';

export default function NotFound() {
  return (
    <>
      {/* Theme Switcher */}
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>

      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="p-4 bg-muted rounded-full mb-6">
          <FileQuestion className="w-12 h-12 text-muted-foreground" />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-3">
          Artikel nicht gefunden
        </h1>

        <p className="text-muted-foreground mb-8 max-w-md">
          Der angeforderte Artikel existiert leider nicht oder wurde entfernt.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zum Blog
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
          >
            Zum Konverter
          </Link>
        </div>
      </div>
    </>
  );
}
