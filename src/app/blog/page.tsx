import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { BlogCard } from '@/components/blog-card';
import { getAllArticles } from '@/data/blog-articles';

export const metadata: Metadata = {
  title: 'Blog - Tipps für Freelancer & Buchhaltung',
  description:
    'Praktische Tipps und Anleitungen für Freelancer: Wise Kontoauszüge, Lexware Office Import, internationale Zahlungen und Buchhaltung.',
  keywords: [
    'Freelancer Blog',
    'Buchhaltung Tipps',
    'Wise Anleitung',
    'Lexware Office Tutorial',
    'CSV Import',
    'Internationale Zahlungen',
    'Selbstständige Deutschland',
  ],
  openGraph: {
    title: 'Blog - Wise zu Lexware Office Konverter',
    description:
      'Praktische Tipps und Anleitungen für Freelancer: Wise Kontoauszüge, Lexware Office Import und mehr.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://wise-lexware-convert.evelan.de/blog',
  },
};

export default function BlogPage() {
  const articles = getAllArticles();

  return (
    <>
      {/* Theme Switcher */}
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>

      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zum Konverter
      </Link>

      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Blog</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Praktische Tipps und Anleitungen für Freelancer und Selbstständige
        </p>
      </header>

      {/* Articles Grid */}
      <div className="grid gap-6">
        {articles.map((article) => (
          <BlogCard key={article.slug} article={article} />
        ))}
      </div>

      {/* CTA Section */}
      <section className="mt-12 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-xl p-8 border border-primary/10">
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          Bereit, Ihre Wise-Transaktionen zu konvertieren?
        </h2>
        <p className="text-foreground mb-6">
          Unser kostenloser Konverter wandelt Ihre Wise CSV-Exporte in das
          Lexware Office-Format um. Schnell, sicher und ohne Registrierung.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Zum Konverter
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </Link>
      </section>
    </>
  );
}
