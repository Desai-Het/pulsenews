"use client";

import { useState } from "react";
import { NewsArticle } from "@/types";
import TopicBadge from "./TopicBadge";
import AudioButton from "./AudioButton";
import { formatDistanceToNow } from "date-fns";

interface NewsCardProps {
  article: NewsArticle;
  onRead: (id: string) => void;
  isRead: boolean;
  index: number;
}

export default function NewsCard({ article, onRead, isRead, index }: NewsCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleExpand = () => {
    setExpanded(!expanded);
    if (!isRead) onRead(article.id);
  };

  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), {
    addSuffix: true,
  });

  const readableContent = [article.title, article.description, article.content]
    .filter(Boolean)
    .join(". ")
    .replace(/\[\+\d+ chars\]/, "")
    .slice(0, 600);

  return (
    <article
      className="fade-up"
      style={{
        animationDelay: `${index * 0.04}s`,
        background: "var(--surface)",
        border: `1px solid ${isRead ? "var(--border)" : "var(--border)"}`,
        borderLeft: `3px solid ${isRead ? "var(--border)" : "var(--accent)"}`,
        borderRadius: "12px",
        overflow: "hidden",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        cursor: "pointer",
        opacity: isRead ? 0.7 : 1,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 24px rgba(0,0,0,0.35)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
        (e.currentTarget as HTMLElement).style.borderColor = isRead
          ? "var(--border)"
          : "var(--border)";
        (e.currentTarget as HTMLElement).style.borderLeftColor = isRead
          ? "var(--border)"
          : "var(--accent)";
      }}
      onClick={handleExpand}
    >
      {/* Image */}
      {article.urlToImage && !imgError && (
        <div style={{ width: "100%", height: expanded ? 220 : 0, overflow: "hidden", transition: "height 0.3s ease" }}>
          {expanded && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.urlToImage}
              alt={article.title}
              onError={() => setImgError(true)}
              style={{ width: "100%", height: 220, objectFit: "cover" }}
            />
          )}
        </div>
      )}

      <div style={{ padding: "16px 18px" }}>
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 6,
              }}
            >
              <TopicBadge label={article.topicTag} />
              <span
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-space-grotesk)",
                }}
              >
                {article.source.name}
              </span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                ·
              </span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                {timeAgo}
              </span>
            </div>

            <h2
              style={{
                fontSize: "15px",
                fontWeight: 600,
                lineHeight: 1.45,
                color: isRead ? "var(--text-muted)" : "var(--text)",
                fontFamily: "var(--font-space-grotesk)",
              }}
            >
              {article.title}
            </h2>
          </div>

          <div
            style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <AudioButton text={article.title} size="sm" />
          </div>
        </div>

        {/* Expandable body */}
        {expanded && (
          <div
            style={{
              marginTop: 12,
              borderTop: "1px solid var(--border)",
              paddingTop: 12,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {article.description && (
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: 1.65,
                  color: "#b0b8cc",
                  marginBottom: 12,
                }}
              >
                {article.description}
              </p>
            )}

            {/* Full read-aloud audio for expanded view */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <AudioButton text={readableContent} size="md" />
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                Read full article aloud
              </span>
            </div>

            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: "13px",
                color: "var(--accent)",
                textDecoration: "none",
                fontWeight: 500,
                padding: "6px 14px",
                borderRadius: "8px",
                border: "1px solid var(--accent)44",
                background: "var(--accent)11",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "var(--accent)22")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "var(--accent)11")
              }
            >
              Read on {article.source.name}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 10L10 2M5 2h5v5" />
              </svg>
            </a>
          </div>
        )}

        {/* Chevron indicator */}
        {!expanded && article.description && (
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-muted)",
              marginTop: 4,
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {article.description}
          </p>
        )}
      </div>
    </article>
  );
}
