import { NewsArticle, Topic } from "@/types";

const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
const GNEWS_KEY = process.env.GNEWS_API_KEY;

async function fetchFromNewsAPI(topic: Topic): Promise<NewsArticle[]> {
  if (!NEWSAPI_KEY) throw new Error("NEWSAPI_KEY not set");

  const url = new URL("https://newsapi.org/v2/everything");
  url.searchParams.set("q", topic.query);
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("language", "en");
  url.searchParams.set("pageSize", "10");
  url.searchParams.set("apiKey", NEWSAPI_KEY);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`NewsAPI error: ${res.status}`);

  const data = await res.json();
  if (data.status !== "ok") throw new Error(data.message || "NewsAPI failed");

  return (data.articles || [])
    .filter(
      (a: Record<string, unknown>) =>
        a.title &&
        a.title !== "[Removed]" &&
        a.url
    )
    .map(
      (a: {
        title: string;
        description: string | null;
        content: string | null;
        url: string;
        urlToImage: string | null;
        publishedAt: string;
        source: { id: string | null; name: string };
      }) => ({
        id: a.url,
        title: a.title,
        description: a.description,
        content: a.content,
        url: a.url,
        urlToImage: a.urlToImage,
        publishedAt: a.publishedAt,
        source: a.source,
        topicTag: topic.label,
        isRead: false,
      })
    );
}

async function fetchFromGNews(topic: Topic): Promise<NewsArticle[]> {
  if (!GNEWS_KEY) throw new Error("GNEWS_API_KEY not set");

  const url = new URL("https://gnews.io/api/v4/search");
  url.searchParams.set("q", topic.query);
  url.searchParams.set("lang", "en");
  url.searchParams.set("max", "10");
  url.searchParams.set("sortby", "publishedAt");
  url.searchParams.set("apikey", GNEWS_KEY);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`GNews error: ${res.status}`);

  const data = await res.json();

  return (data.articles || [])
    .filter((a: Record<string, unknown>) => a.title && a.url)
    .map(
      (a: {
        title: string;
        description: string | null;
        content: string | null;
        url: string;
        image: string | null;
        publishedAt: string;
        source: { name: string; url: string };
      }) => ({
        id: a.url,
        title: a.title,
        description: a.description,
        content: a.content,
        url: a.url,
        urlToImage: a.image,
        publishedAt: a.publishedAt,
        source: { id: null, name: a.source?.name || "Unknown" },
        topicTag: topic.label,
        isRead: false,
      })
    );
}

export async function fetchNewsForTopic(topic: Topic): Promise<NewsArticle[]> {
  try {
    const articles = await fetchFromGNews(topic);
    if (articles.length > 0) return articles;
    throw new Error("GNews returned 0 articles");
  } catch (err) {
    console.warn(`GNews failed for "${topic.label}", trying NewsAPI:`, err);
    try {
      return await fetchFromNewsAPI(topic);
    } catch (err2) {
      console.error(`Both APIs failed for "${topic.label}":`, err2);
      return [];
    }
  }
}

export function deduplicateArticles(articles: NewsArticle[]): NewsArticle[] {
  const seen = new Set<string>();
  return articles.filter((a) => {
    const key = a.title.toLowerCase().slice(0, 80);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}