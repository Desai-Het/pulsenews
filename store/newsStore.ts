"use client";

import { Topic } from "@/types";
import { DEFAULT_TOPICS } from "@/lib/defaultTopics";

const TOPICS_KEY = "newsapp_topics";
const READ_IDS_KEY = "newsapp_read_ids";
const LAST_FETCH_KEY = "newsapp_last_fetch";

// -- Topics --
export function getTopics(): Topic[] {
  if (typeof window === "undefined") return DEFAULT_TOPICS;
  try {
    const raw = localStorage.getItem(TOPICS_KEY);
    if (!raw) {
      localStorage.setItem(TOPICS_KEY, JSON.stringify(DEFAULT_TOPICS));
      return DEFAULT_TOPICS;
    }
    return JSON.parse(raw) as Topic[];
  } catch {
    return DEFAULT_TOPICS;
  }
}

export function saveTopics(topics: Topic[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
}

export function addTopic(topic: Topic): Topic[] {
  const existing = getTopics();
  const updated = [...existing, topic];
  saveTopics(updated);
  return updated;
}

export function removeTopic(id: string): Topic[] {
  const existing = getTopics();
  const updated = existing.filter((t) => t.id !== id);
  saveTopics(updated);
  return updated;
}

// -- Read IDs --
export function getReadIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(READ_IDS_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

export function markAsRead(articleId: string): void {
  if (typeof window === "undefined") return;
  const ids = getReadIds();
  ids.add(articleId);
  localStorage.setItem(READ_IDS_KEY, JSON.stringify([...ids]));
}

export function markAllAsRead(articleIds: string[]): void {
  if (typeof window === "undefined") return;
  const ids = getReadIds();
  articleIds.forEach((id) => ids.add(id));
  localStorage.setItem(READ_IDS_KEY, JSON.stringify([...ids]));
}

// -- Last fetch time --
export function getLastFetch(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LAST_FETCH_KEY);
}

export function setLastFetch(ts: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LAST_FETCH_KEY, ts);
}

// Persist article IDs to detect new vs old across sessions
const ARTICLE_IDS_KEY = "newsapp_article_ids";

export function getKnownArticleIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(ARTICLE_IDS_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

export function saveKnownArticleIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  // Keep a rolling window of last 500 article IDs to avoid unbounded growth
  const existing = getKnownArticleIds();
  const merged = [...new Set([...existing, ...ids])];
  const trimmed = merged.slice(-500);
  localStorage.setItem(ARTICLE_IDS_KEY, JSON.stringify(trimmed));
}
