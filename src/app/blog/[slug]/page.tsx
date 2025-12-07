import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Script from 'next/script';
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

  const baseUrl = 'https://wise-lexware-convert.evelan.de';

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
      url: `${baseUrl}/blog/${slug}`,
      siteName: 'WISE zu Lexware Office Konverter',
      locale: 'de_DE',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
    alternates: {
      canonical: `${baseUrl}/blog/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

const categoryLabels: Record<string, string> = {
  tutorial: 'Tutorial',
  guide: 'Leitfaden',
  tips: 'Tipps',
  news: 'News',
};

// Block types for content parsing
type BlockType =
  | { type: 'heading2'; content: string }
  | { type: 'heading3'; content: string }
  | { type: 'paragraph'; content: string }
  | { type: 'blockquote'; content: string }
  | { type: 'hr' }
  | { type: 'unorderedList'; items: string[] }
  | { type: 'orderedList'; items: { number: string; content: string }[] }
  | { type: 'checkList'; items: { checked: boolean; content: string }[] }
  | { type: 'table'; headers: string[]; rows: string[][] };

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const baseUrl = 'https://wise-lexware-convert.evelan.de';
  const articleUrl = `${baseUrl}/blog/${slug}`;

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isoDate = new Date(article.publishedAt).toISOString();
  const isoModifiedDate = article.updatedAt
    ? new Date(article.updatedAt).toISOString()
    : isoDate;

  // Helper function to format inline markdown (bold, italic, code, links)
  const formatInlineText = (text: string): string => {
    return text
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:text-primary/80 underline">$1</a>');
  };

  // Parse content into semantic blocks
  const parseContent = (content: string): BlockType[] => {
    const lines = content.split('\n');
    const blocks: BlockType[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Skip empty lines
      if (line.trim() === '') {
        i++;
        continue;
      }

      // Heading 2
      if (line.startsWith('## ')) {
        blocks.push({ type: 'heading2', content: line.slice(3) });
        i++;
        continue;
      }

      // Heading 3
      if (line.startsWith('### ')) {
        blocks.push({ type: 'heading3', content: line.slice(4) });
        i++;
        continue;
      }

      // Horizontal rule
      if (line.startsWith('---')) {
        blocks.push({ type: 'hr' });
        i++;
        continue;
      }

      // Skip code fence markers
      if (line.startsWith('```')) {
        i++;
        continue;
      }

      // Blockquote
      if (line.startsWith('> ')) {
        blocks.push({ type: 'blockquote', content: line.slice(2) });
        i++;
        continue;
      }

      // Checkbox list (group consecutive items)
      if (line.startsWith('- [ ] ') || line.startsWith('- [x] ') || line.startsWith('- [X] ')) {
        const items: { checked: boolean; content: string }[] = [];
        while (i < lines.length && (lines[i].startsWith('- [ ] ') || lines[i].startsWith('- [x] ') || lines[i].startsWith('- [X] '))) {
          const currentLine = lines[i];
          const checked = currentLine.startsWith('- [x] ') || currentLine.startsWith('- [X] ');
          items.push({ checked, content: currentLine.slice(6) });
          i++;
        }
        blocks.push({ type: 'checkList', items });
        continue;
      }

      // Unordered list (group consecutive items)
      if (line.startsWith('- ')) {
        const items: string[] = [];
        while (i < lines.length && lines[i].startsWith('- ') && !lines[i].startsWith('- [ ]') && !lines[i].startsWith('- [x]') && !lines[i].startsWith('- [X]')) {
          items.push(lines[i].slice(2));
          i++;
        }
        blocks.push({ type: 'unorderedList', items });
        continue;
      }

      // Ordered list (group consecutive items)
      const orderedMatch = line.match(/^(\d+)\.\s(.+)$/);
      if (orderedMatch) {
        const items: { number: string; content: string }[] = [];
        while (i < lines.length) {
          const currentMatch = lines[i].match(/^(\d+)\.\s(.+)$/);
          if (!currentMatch) break;
          items.push({ number: currentMatch[1], content: currentMatch[2] });
          i++;
        }
        blocks.push({ type: 'orderedList', items });
        continue;
      }

      // Table (group consecutive rows)
      if (line.startsWith('|') && line.endsWith('|')) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].startsWith('|') && lines[i].endsWith('|')) {
          tableLines.push(lines[i]);
          i++;
        }

        if (tableLines.length >= 2) {
          const headers = tableLines[0].slice(1, -1).split('|').map(cell => cell.trim());
          const rows: string[][] = [];

          // Skip header and separator row, process data rows
          for (let j = 2; j < tableLines.length; j++) {
            const cells = tableLines[j].slice(1, -1).split('|').map(cell => cell.trim());
            rows.push(cells);
          }

          blocks.push({ type: 'table', headers, rows });
        }
        continue;
      }

      // Regular paragraph
      blocks.push({ type: 'paragraph', content: line });
      i++;
    }

    return blocks;
  };

  // Render blocks to JSX with semantic HTML
  const renderBlocks = (blocks: BlockType[]) => {
    return blocks.map((block, index) => {
      switch (block.type) {
        case 'heading2':
          return (
            <h2
              key={index}
              className="text-2xl font-semibold text-foreground mt-8 mb-4"
              dangerouslySetInnerHTML={{ __html: formatInlineText(block.content) }}
            />
          );

        case 'heading3':
          return (
            <h3
              key={index}
              className="text-xl font-semibold text-foreground mt-6 mb-3"
              dangerouslySetInnerHTML={{ __html: formatInlineText(block.content) }}
            />
          );

        case 'hr':
          return <hr key={index} className="my-8 border-border" />;

        case 'blockquote':
          return (
            <blockquote
              key={index}
              className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4"
              dangerouslySetInnerHTML={{ __html: formatInlineText(block.content) }}
            />
          );

        case 'unorderedList':
          return (
            <ul key={index} className="list-disc list-outside ml-6 my-4 space-y-1">
              {block.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="text-foreground"
                  dangerouslySetInnerHTML={{ __html: formatInlineText(item) }}
                />
              ))}
            </ul>
          );

        case 'orderedList':
          return (
            <ol key={index} className="list-decimal list-outside ml-6 my-4 space-y-1">
              {block.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="text-foreground"
                  value={parseInt(item.number)}
                  dangerouslySetInnerHTML={{ __html: formatInlineText(item.content) }}
                />
              ))}
            </ol>
          );

        case 'checkList':
          return (
            <ul key={index} className="my-4 space-y-2 ml-2">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    disabled
                    className="mt-1 h-4 w-4"
                    aria-label={item.checked ? 'Erledigt' : 'Offen'}
                  />
                  <span
                    className="text-foreground"
                    dangerouslySetInnerHTML={{ __html: formatInlineText(item.content) }}
                  />
                </li>
              ))}
            </ul>
          );

        case 'table':
          return (
            <div key={index} className="my-6 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-border">
                    {block.headers.map((header, headerIndex) => (
                      <th
                        key={headerIndex}
                        className="py-3 px-4 text-left font-semibold text-foreground"
                        dangerouslySetInnerHTML={{ __html: formatInlineText(header) }}
                      />
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-border">
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="py-2 px-4 text-foreground"
                          dangerouslySetInnerHTML={{ __html: formatInlineText(cell) }}
                        />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );

        case 'paragraph':
          return (
            <p
              key={index}
              className="text-foreground my-3 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatInlineText(block.content) }}
            />
          );

        default:
          return null;
      }
    });
  };

  const blocks = parseContent(article.content);

  // Enhanced structured data (JSON-LD) for SEO
  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': articleUrl,
    headline: article.title,
    description: article.description,
    image: `${baseUrl}/icon.svg`,
    datePublished: isoDate,
    dateModified: isoModifiedDate,
    author: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: article.author.name,
      url: article.author.url,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'Evelan GmbH',
      url: 'https://evelan.de',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icon.svg`,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    keywords: article.keywords.join(', '),
    articleSection: categoryLabels[article.category],
    inLanguage: 'de-DE',
    isAccessibleForFree: true,
    wordCount: article.content.split(/\s+/).length,
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
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <>
      {/* Structured Data - Article */}
      <Script
        id="article-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
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
          <li>
            <Link href="/blog" className="hover:text-primary transition-colors">
              Blog
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground font-medium truncate max-w-[200px]" aria-current="page">
            {article.title}
          </li>
        </ol>
      </nav>

      {/* Main Article */}
      <article itemScope itemType="https://schema.org/Article">
        {/* Hidden meta for schema.org */}
        <meta itemProp="datePublished" content={isoDate} />
        <meta itemProp="dateModified" content={isoModifiedDate} />
        <meta itemProp="author" content={article.author.name} />

        {/* Article Header */}
        <header className="mb-8">
          {/* Category Badge */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
              itemProp="articleSection"
            >
              {categoryLabels[article.category]}
            </span>
            {article.featured && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                Empfohlen
              </span>
            )}
          </div>

          {/* Title */}
          <h1
            className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight"
            itemProp="headline"
          >
            {article.title}
          </h1>

          {/* Description */}
          <p
            className="text-lg text-muted-foreground mb-6"
            itemProp="description"
          >
            {article.description}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-6 border-b border-border">
            <address className="flex items-center gap-1.5 not-italic">
              <User className="w-4 h-4" aria-hidden="true" />
              <span itemProp="author" itemScope itemType="https://schema.org/Organization">
                <span itemProp="name">{article.author.name}</span>
              </span>
            </address>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <time dateTime={isoDate} itemProp="datePublished">
                {formattedDate}
              </time>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" aria-hidden="true" />
              <span>{article.readingTime} Min. Lesezeit</span>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div
          className="bg-card rounded-xl p-6 md:p-8 border border-border shadow-sm"
          itemProp="articleBody"
        >
          {renderBlocks(blocks)}
        </div>

        {/* Keywords/Tags */}
        <footer className="mt-8 pt-6 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <span className="text-sm font-medium text-muted-foreground">Schlagworte:</span>
          </div>
          <div className="flex flex-wrap gap-2" itemProp="keywords">
            {article.keywords.slice(0, 6).map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-muted text-muted-foreground"
              >
                {keyword}
              </span>
            ))}
          </div>
        </footer>
      </article>

      {/* CTA Section */}
      <aside className="mt-12 bg-gradient-to-br from-primary/5 to-[#3C777B]/5 rounded-xl p-8 border border-primary/10">
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
            <ArrowLeft className="w-4 h-4 rotate-180" aria-hidden="true" />
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
          >
            Weitere Artikel
          </Link>
        </div>
      </aside>
    </>
  );
}
