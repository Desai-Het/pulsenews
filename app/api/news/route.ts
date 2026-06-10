import { NextRequest, NextResponse } from "next/server";
import { fetchNewsForTopic, deduplicateArticles } from "@/lib/newsFetcher";
import { Topic } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { topics }: { topics: Topic[] } = await req.json();

    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return NextResponse.json(
        { error: "topics array is required" },
        { status: 400 }
      );
    }

    const results = await Promise.allSettled(
      topics.map((topic) => fetchNewsForTopic(topic))
    );

    const allArticles = results.flatMap((r) =>
      r.status === "fulfilled" ? r.value : []
    );

    const deduped = deduplicateArticles(allArticles);

    // Sort newest first
    deduped.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return NextResponse.json({ articles: deduped, fetchedAt: new Date().toISOString() });
  } catch (err) {
    console.error("News API route error:", err);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
