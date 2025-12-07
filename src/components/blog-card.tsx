import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { BlogArticle } from '@/types/blog';

interface BlogCardProps {
  article: BlogArticle;
}

const categoryLabels: Record<BlogArticle['category'], string> = {
  tutorial: 'Tutorial',
  guide: 'Leitfaden',
  tips: 'Tipps',
  news: 'News',
};

const categoryColors: Record<BlogArticle['category'], string> = {
  tutorial: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  guide: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  tips: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  news: 'bg-[#3C777B]/10 text-[#08292E] dark:bg-[#3C777B]/20 dark:text-[#5A9A9E]',
};

export function BlogCard({ article }: BlogCardProps) {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="group bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <Link href={`/blog/${article.slug}`} className="block p-6">
        {/* Category Badge */}
        <div className="flex items-center gap-3 mb-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[article.category]}`}
          >
            {categoryLabels[article.category]}
          </span>
          {article.featured && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              Empfohlen
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h2>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {article.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.readingTime} Min. Lesezeit</span>
          </div>
        </div>

        {/* Read More Link */}
        <div className="mt-4 flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
          <span>Weiterlesen</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </Link>
    </article>
  );
}
