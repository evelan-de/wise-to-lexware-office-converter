import Link from 'next/link';
import Script from 'next/script';
import type { Metadata } from 'next';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { BlogCard } from '@/components/blog-card';
import { getAllArticles } from '@/data/blog-articles';

const baseUrl = 'https://wise-lexware-convert.evelan.de';

export const metadata: Metadata = {
  title: 'Blog: Freelancer-Tipps',
  description:
    'Praktische Tipps und Anleitungen für Freelancer: Wise Kontoauszüge exportieren, Lexware Office CSV Import, internationale Zahlungen und Buchhaltung optimieren.',
  keywords: [
    'Freelancer Blog',
    'Buchhaltung Tipps',
    'Wise Anleitung',
    'Lexware Office Tutorial',
    'CSV Import Anleitung',
    'Internationale Zahlungen',
    'Selbstständige Deutschland',
    'Wise Geschäftskonto',
    'Neobank Buchhaltung',
    'Offshore Konto',
  ],
  openGraph: {
    title: 'Blog - Tipps für Freelancer & Buchhaltung',
    description:
      'Praktische Tipps und Anleitungen für Freelancer: Wise, Lexware Office und mehr.',
    type: 'website',
    url: `${baseUrl}/blog`,
  },
  twitter: {
    card: 'summary',
    title: 'Blog - Wise zu Lexware Office',
    description: 'Tipps für Freelancer: Wise, Lexware Office und Buchhaltung.',
  },
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
};

// Generate structured data dynamically
function generateStructuredData() {
  const articles = getAllArticles();

  // CollectionPage structured data for blog listing
  const collectionPageStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${baseUrl}/blog`,
    name: 'Blog - Tipps für Freelancer & Buchhaltung',
    description:
      'Praktische Tipps und Anleitungen für Freelancer: Wise Kontoauszüge, Lexware Office Import, internationale Zahlungen und Buchhaltung.',
    url: `${baseUrl}/blog`,
    inLanguage: 'de-DE',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      name: 'WISE zu Lexware Office Konverter',
      url: baseUrl,
    },
    about: {
      '@type': 'Thing',
      name: 'Buchhaltung und Finanzen für Freelancer',
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: articles.length,
      itemListElement: articles.map((article, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${baseUrl}/blog/${article.slug}`,
        name: article.title,
      })),
    },
  };

  // BreadcrumbList structured data
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Startseite',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${baseUrl}/blog`,
      },
    ],
  };

  return { collectionPageStructuredData, breadcrumbStructuredData };
}

export default function BlogPage() {
  const articles = getAllArticles();
  const { collectionPageStructuredData, breadcrumbStructuredData } = generateStructuredData();

  return (
    <>
      {/* Structured Data - CollectionPage */}
      <Script
        id="collection-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageStructuredData) }}
      />

      {/* Structured Data - Breadcrumb */}
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />

      {/* Theme Switcher */}
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Startseite
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground font-medium" aria-current="page">
            Blog
          </li>
        </ol>
      </nav>

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
      <section className="mt-12 bg-gradient-to-br from-primary/5 to-[#00ADEF]/5 rounded-xl p-8 border border-primary/10">
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
