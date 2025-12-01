export interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  content: string;
  publishedAt: string;
  updatedAt?: string;
  author: {
    name: string;
    url?: string;
  };
  keywords: string[];
  category: 'tutorial' | 'guide' | 'tips' | 'news';
  readingTime: number; // in minutes
  featured?: boolean;
}

export interface BlogMetadata {
  title: string;
  description: string;
  keywords: string[];
  openGraph: {
    title: string;
    description: string;
    type: 'article';
    publishedTime: string;
    modifiedTime?: string;
    authors: string[];
    section: string;
  };
}
