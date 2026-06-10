"use client";

import { useState, useEffect, useCallback } from "react";
import { NewsArticle, Topic } from "@/types";
import {
  getTopics,
  getReadIds,
  markAsRead,
  markAllAsRead,
  getLastFetch,
  setLastFetch,
  addTopic as storageAddTopic,
  removeTopic as storageRemoveTopic,
  getKnownArticleIds,
  saveKnownArticleIds,
} from "@/store/newsStore";
import NewsCard from "@/components/NewsCard";
import SkeletonCard from "@/components/SkeletonCard";
import AddTopicModal from "@/components/AddTopicModal";
import TopicBadge from "@/components/TopicBadge";
import AudioButton from "@/components/AudioButton";
import { formatDistanceToNow } from "date-fns";

export default function HomePage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [lastFetch, setLastFetchState] = useState<string | null>(null);
  const [filterTopic, setFilterTopic] = useState<string>("All");
  const [refreshing, setRefreshing] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    setTopics(getTopics());
    setReadIds(getReadIds());
    setLastFetchState(getLastFetch());
  }, []);

  // Fetch news
  const fetchNews = useCallback(
    async (topicList: Topic[], force = false) => {
      if (!force && !loading) setRefreshing(true);
      setError("");

      try {
        const res = await fetch("/api/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topics: topicList }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to fetch");
        }

        const data = await res.json();
        const fetched: NewsArticle[] = data.articles;

        // Track known IDs to identify "new" articles
        const knownIds = getKnownArticleIds();
        const articlesWithReadState = fetched.map((a) => ({
          ...a,
          isRead: knownIds.has(a.id),
        }));

        saveKnownArticleIds(fetched.map((a) => a.id));
        setArticles(articlesWithReadState);
        setLastFetchState(data.fetchedAt);
        setLastFetch(data.fetchedAt);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [loading]
  );

  // Fetch on mount when topics are loaded
  useEffect(() => {
    if (topics.length > 0 && loading) {
      fetchNews(topics, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topics]);

  const handleMarkRead = useCallback((id: string) => {
    markAsRead(id);
    setReadIds((prev) => new Set([...prev, id]));
  }, []);

  const handleMarkAllRead = () => {
    const ids = unseenArticles.map((a) => a.id);
    markAllAsRead(ids);
    setReadIds((prev) => new Set([...prev, ...ids]));
  };

  const handleAddTopic = (topic: Topic) => {
    const updated = storageAddTopic(topic);
    setTopics(updated);
    fetchNews(updated);
  };

  const handleRemoveTopic = (id: string) => {
    const updated = storageRemoveTopic(id);
    setTopics(updated);
    setArticles((prev) => {
      const removed = topics.find((t) => t.id === id);
      if (!removed) return prev;
      return prev.filter((a) => a.topicTag !== removed.label);
    });
  };

  // Filter articles
  const filteredArticles =
    filterTopic === "All"
      ? articles
      : articles.filter((a) => a.topicTag === filterTopic);

  const unseenArticles = filteredArticles.filter((a) => !readIds.has(a.id));
  const seenArticles = filteredArticles.filter((a) => readIds.has(a.id));

  const displayArticles = showArchive ? seenArticles : unseenArticles;
  const allHeadlines = unseenArticles.map((a) => a.title).join(". Next: ");

  const topicFilters = ["All", ...topics.map((t) => t.label)];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--bg)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            maxWidth: 780,
            margin: "0 auto",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {/* Logo */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  boxShadow: "0 0 8px var(--accent)",
                }}
              />
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  fontFamily: "var(--font-space-grotesk)",
                  letterSpacing: "-0.03em",
                }}
              >
                Pulse
                <span style={{ color: "var(--accent)" }}>News</span>
              </span>
            </div>
            {lastFetch && (
              <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: 1 }}>
                Updated {formatDistanceToNow(new Date(lastFetch), { addSuffix: true })}
              </p>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {!loading && unseenArticles.length > 0 && (
              <AudioButton
                text={`You have ${unseenArticles.length} unread headlines. ${allHeadlines}`}
                size="md"
              />
            )}

            <button
              onClick={() => fetchNews(topics)}
              disabled={refreshing || loading}
              title="Refresh news"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "1px solid var(--border)",
                background: "transparent",
                color: refreshing ? "var(--accent)" : "var(--text-muted)",
                cursor: refreshing ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "color 0.2s ease",
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: refreshing ? "rotate(360deg)" : "none", transition: refreshing ? "transform 1s linear" : "none" }}
              >
                <path d="M1.5 7.5A6 6 0 0 1 13 5M13.5 7.5A6 6 0 0 1 2 10" />
                <polyline points="13,2 13,5 10,5" />
                <polyline points="2,10 2,13 5,13" />
              </svg>
            </button>

            <button
              onClick={() => setShowAddTopic(true)}
              style={{
                padding: "7px 14px",
                borderRadius: "8px",
                border: "1px solid var(--accent)55",
                background: "var(--accent)18",
                color: "var(--accent)",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 5,
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "var(--accent)28")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "var(--accent)18")
              }
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 1v10M1 6h10" />
              </svg>
              Add Topic
            </button>
          </div>
        </div>

        {/* Topic filter pills */}
        <div
          style={{
            maxWidth: 780,
            margin: "0 auto",
            padding: "0 20px 12px",
            display: "flex",
            gap: 6,
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {topicFilters.map((label) => (
            <button
              key={label}
              onClick={() => setFilterTopic(label)}
              style={{
                padding: "4px 12px",
                borderRadius: "100px",
                border: `1px solid ${filterTopic === label ? "var(--accent)" : "var(--border)"}`,
                background:
                  filterTopic === label ? "var(--accent)22" : "transparent",
                color:
                  filterTopic === label ? "var(--accent)" : "var(--text-muted)",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 500,
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
                flexShrink: 0,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 780, margin: "0 auto", padding: "24px 20px 60px" }}>

        {/* Tab switcher */}
        <div
          style={{
            display: "flex",
            gap: 0,
            background: "var(--surface)",
            borderRadius: "10px",
            padding: 4,
            marginBottom: 24,
            border: "1px solid var(--border)",
            width: "fit-content",
          }}
        >
          {[
            { label: "Latest", value: false },
            { label: "Archive", value: true },
          ].map(({ label, value }) => (
            <button
              key={label}
              onClick={() => setShowArchive(value)}
              style={{
                padding: "7px 18px",
                borderRadius: "7px",
                border: "none",
                background: showArchive === value ? "var(--surface2)" : "transparent",
                color: showArchive === value ? "var(--text)" : "var(--text-muted)",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: showArchive === value ? 600 : 400,
                transition: "all 0.15s ease",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {label}
              {!value && !loading && unseenArticles.length > 0 && (
                <span
                  style={{
                    background: "var(--accent)",
                    color: "#fff",
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "1px 6px",
                    borderRadius: "100px",
                    lineHeight: 1.6,
                  }}
                >
                  {unseenArticles.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} index={i} />
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div
            style={{
              background: "#e05b5b18",
              border: "1px solid #e05b5b44",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#e07a7a", fontSize: "15px", marginBottom: 12 }}>
              {error}
            </p>
            <button
              onClick={() => fetchNews(topics, true)}
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                border: "1px solid #e05b5b55",
                background: "#e05b5b18",
                color: "#e07a7a",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* All caught up */}
        {!loading && !error && !showArchive && unseenArticles.length === 0 && (
          <div
            className="fade-up"
            style={{ textAlign: "center", paddingTop: 48, paddingBottom: 24 }}
          >
            <div
              style={{
                fontSize: "42px",
                marginBottom: 12,
                filter: "grayscale(0.3)",
              }}
            >
              ✓
            </div>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 700,
                fontFamily: "var(--font-space-grotesk)",
                marginBottom: 8,
              }}
            >
              You&apos;re all caught up!
            </h2>
            <p
              style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: 24 }}
            >
              No new articles since your last visit.
            </p>
            <button
              onClick={() => setShowArchive(true)}
              style={{
                padding: "10px 22px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--text)",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              See old news
            </button>
          </div>
        )}

        {/* No archive articles */}
        {!loading && !error && showArchive && seenArticles.length === 0 && (
          <div
            className="fade-up"
            style={{ textAlign: "center", paddingTop: 48 }}
          >
            <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
              No archived news yet. Read some articles first.
            </p>
            <button
              onClick={() => setShowArchive(false)}
              style={{
                marginTop: 16,
                padding: "9px 20px",
                borderRadius: "9px",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--text)",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              Back to Latest
            </button>
          </div>
        )}

        {/* Article list */}
        {!loading && !error && displayArticles.length > 0 && (
          <>
            {/* Mark all as read */}
            {!showArchive && unseenArticles.length > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: 14,
                }}
              >
                <button
                  onClick={handleMarkAllRead}
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "underline",
                    textDecorationColor: "var(--border)",
                  }}
                >
                  Mark all as read
                </button>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {displayArticles.map((article, i) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  onRead={handleMarkRead}
                  isRead={readIds.has(article.id)}
                  index={i}
                />
              ))}
            </div>
          </>
        )}

        {/* Manage custom topics */}
        {!loading && topics.some((t) => !t.isDefault) && (
          <div
            style={{
              marginTop: 48,
              borderTop: "1px solid var(--border)",
              paddingTop: 24,
            }}
          >
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--text-muted)",
                marginBottom: 12,
                fontFamily: "var(--font-space-grotesk)",
              }}
            >
              Custom Topics
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {topics
                .filter((t) => !t.isDefault)
                .map((topic) => (
                  <div
                    key={topic.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: "5px 10px",
                    }}
                  >
                    <TopicBadge label={topic.label} />
                    <button
                      onClick={() => handleRemoveTopic(topic.id)}
                      title="Remove topic"
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        fontSize: "16px",
                        lineHeight: 1,
                        padding: "0 2px",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>

      {/* Add Topic Modal */}
      {showAddTopic && (
        <AddTopicModal
          onAdd={handleAddTopic}
          onClose={() => setShowAddTopic(false)}
        />
      )}
    </div>
  );
}
