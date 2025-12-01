import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, Calendar, Clock, User, Tag } from 'lucide-react';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { getArticleBySlug, getAllArticleSlugs } from '@/data/blog-articles';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all articles
export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for each article
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Artikel nicht gefunden',
    };
  }

  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    authors: [{ name: article.author.name, url: article.author.url }],
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      authors: [article.author.name],
      section: article.category,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
    alternates: {
      canonical: `https://wise-lexware-convert.evelan.de/blog/${slug}`,
    },
  };
}

const categoryLabels: Record<string, string> = {
  tutorial: 'Tutorial',
  guide: 'Leitfaden',
  tips: 'Tipps',
  news: 'News',
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Helper function to format inline markdown (bold, italic, code, links)
  const formatInlineText = (text: string): string => {
    return text
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm text-foreground">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:text-primary/80 underline">$1</a>');
  };

  // Simple markdown-like rendering (basic)
  const renderContent = (content: string) => {
    const lines = content.split('\n');

    // Process the content to add styling
    return lines
      .map((line, index) => {
        // Headers
        if (line.startsWith('## ')) {
          return (
            <h2
              key={index}
              className="text-2xl font-semibold text-foreground mt-8 mb-4"
              dangerouslySetInnerHTML={{ __html: formatInlineText(line.slice(3)) }}
            />
          );
        }
        if (line.startsWith('### ')) {
          return (
            <h3
              key={index}
              className="text-xl font-semibold text-foreground mt-6 mb-3"
              dangerouslySetInnerHTML={{ __html: formatInlineText(line.slice(4)) }}
            />
          );
        }

        // Horizontal rule
        if (line.startsWith('---')) {
          return <hr key={index} className="my-8 border-border" />;
        }

        // Code blocks (simple)
        if (line.startsWith('```')) {
          return null; // Skip code fence markers
        }

        // Blockquotes
        if (line.startsWith('> ')) {
          return (
            <blockquote
              key={index}
              className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4"
              dangerouslySetInnerHTML={{ __html: formatInlineText(line.slice(2)) }}
            />
          );
        }

        // Lists
        if (line.startsWith('- ')) {
          const itemContent = line.slice(2);
          // Check for checkboxes
          if (itemContent.startsWith('[ ] ')) {
            return (
              <li key={index} className="flex items-start gap-2 ml-4">
                <input type="checkbox" disabled className="mt-1" />
                <span dangerouslySetInnerHTML={{ __html: formatInlineText(itemContent.slice(4)) }} />
              </li>
            );
          }
          // Check for checked items
          if (itemContent.startsWith('[x] ') || itemContent.startsWith('[X] ')) {
            return (
              <li key={index} className="flex items-start gap-2 ml-4">
                <input type="checkbox" checked disabled className="mt-1" />
                <span dangerouslySetInnerHTML={{ __html: formatInlineText(itemContent.slice(4)) }} />
              </li>
            );
          }
          return (
            <li
              key={index}
              className="ml-4 my-1 list-disc list-inside"
              dangerouslySetInnerHTML={{ __html: formatInlineText(itemContent) }}
            />
          );
        }

        // Numbered lists - render number explicitly to ensure correct numbering
        const numberedMatch = line.match(/^(\d+)\.\s(.+)$/);
        if (numberedMatch) {
          return (
            <div key={index} className="ml-4 my-1 flex gap-2">
              <span className="font-semibold text-foreground min-w-[1.5rem] flex-shrink-0">{numberedMatch[1]}.</span>
              <span dangerouslySetInnerHTML={{ __html: formatInlineText(numberedMatch[2]) }} />
            </div>
          );
        }

        // Tables (simple detection)
        if (line.startsWith('|') && line.endsWith('|')) {
          const cells = line.slice(1, -1).split('|').map((cell) => cell.trim());
          // Skip separator rows
          if (cells.every((cell) => /^[-:]+$/.test(cell))) {
            return null;
          }
          const prevLine = lines[index - 1];
          const isBodyRow = prevLine && (prevLine.includes('---') || prevLine.includes('-|-'));
          return (
            <tr key={index} className="border-b border-border">
              {cells.map((cell, cellIndex) =>
                isBodyRow ? (
                  <td
                    key={cellIndex}
                    className="py-2 px-3 text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: formatInlineText(cell) }}
                  />
                ) : (
                  <th
                    key={cellIndex}
                    className="py-2 px-3 font-semibold text-foreground text-left"
                    dangerouslySetInnerHTML={{ __html: formatInlineText(cell) }}
                  />
                )
              )}
            </tr>
          );
        }

        // Empty lines
        if (line.trim() === '') {
          return <div key={index} className="h-4" />;
        }

        // Regular paragraphs with inline formatting
        return (
          <p
            key={index}
            className="text-muted-foreground my-2 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatInlineText(line) }}
          />
        );
      })
      .filter(Boolean);
  };

  // Structured data for article
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      '@type': 'Organization',
      name: article.author.name,
      url: article.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Evelan GmbH',
      url: 'https://evelan.de',
      logo: {
        '@type': 'ImageObject',
        url: 'https://wise-lexware-convert.evelan.de/icon.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://wise-lexware-convert.evelan.de/blog/${slug}`,
    },
    keywords: article.keywords.join(', '),
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Theme Switcher */}
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>

      {/* Back Button */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zum Blog
      </Link>

      {/* Article Header */}
      <header className="mb-8">
        {/* Category Badge */}
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
            {categoryLabels[article.category]}
          </span>
          {article.featured && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
              Empfohlen
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
          {article.title}
        </h1>

        {/* Description */}
        <p className="text-lg text-muted-foreground mb-6">{article.description}</p>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-6 border-b border-border">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            <span>{article.author.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{article.readingTime} Min. Lesezeit</span>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-card rounded-xl p-6 md:p-8 border border-border shadow-sm">
          {renderContent(article.content)}
        </div>
      </article>

      {/* Keywords/Tags */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Schlagworte:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {article.keywords.slice(0, 6).map((keyword) => (
            <span
              key={keyword}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-muted text-muted-foreground"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <section className="mt-12 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-xl p-8 border border-primary/10">
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          Bereit, Ihre Wise-Transaktionen zu konvertieren?
        </h2>
        <p className="text-muted-foreground mb-6">
          Unser kostenloser Konverter wandelt Ihre Wise CSV-Exporte in das Lexware
          Office-Format um. Schnell, sicher und ohne Registrierung.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Zum Konverter
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
          >
            Weitere Artikel
          </Link>
        </div>
      </section>
    </>
  );
}
