export interface NewsArticle {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: {
    id: string | null;
    name: string;
  };
  topicTag: string;
  isRead: boolean;
}

export interface Topic {
  id: string;
  label: string;
  query: string;
  isDefault: boolean;
  createdAt: string;
}

export interface NewsState {
  articles: NewsArticle[];
  readIds: Set<string>;
  topics: Topic[];
  lastFetched: string | null;
}

export type ViewMode = "unseen" | "archive";
