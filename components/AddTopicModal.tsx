"use client";

import { useState } from "react";
import { Topic } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface AddTopicModalProps {
  onAdd: (topic: Topic) => void;
  onClose: () => void;
}

export default function AddTopicModal({ onAdd, onClose }: AddTopicModalProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");

    try {
      // Convert natural language input to a search query
      // Simple but effective: use the input as-is with some light processing
      const words = trimmed
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(Boolean);

      const query = words.length === 1
        ? trimmed
        : words.slice(0, 5).join(" OR ");

      const topic: Topic = {
        id: uuidv4(),
        label: trimmed
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
          .slice(0, 40),
        query,
        isDefault: false,
        createdAt: new Date().toISOString(),
      };

      onAdd(topic);
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "0 16px",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="fade-up"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "28px",
          width: "100%",
          maxWidth: 440,
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 700,
            fontFamily: "var(--font-space-grotesk)",
            marginBottom: 6,
          }}
        >
          Add a Topic
        </h3>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: 20 }}>
          Describe what you want to follow — in plain language. E.g.{" "}
          <em style={{ color: "var(--text)" }}>"electric vehicles in India"</em> or{" "}
          <em style={{ color: "var(--text)" }}>"quantum computing"</em>
        </p>

        <input
          autoFocus
          type="text"
          placeholder="Type your topic..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={80}
          style={{
            width: "100%",
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "11px 14px",
            fontSize: "15px",
            color: "var(--text)",
            outline: "none",
            marginBottom: error ? 6 : 18,
            transition: "border-color 0.2s ease",
            fontFamily: "var(--font-dm-sans)",
          }}
          onFocus={(e) =>
            ((e.target as HTMLInputElement).style.borderColor = "var(--accent)")
          }
          onBlur={(e) =>
            ((e.target as HTMLInputElement).style.borderColor = "var(--border)")
          }
        />

        {error && (
          <p style={{ fontSize: "12px", color: "#e05b5b", marginBottom: 14 }}>
            {error}
          </p>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              padding: "9px 18px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!input.trim() || loading}
            style={{
              padding: "9px 22px",
              borderRadius: "8px",
              border: "none",
              background: input.trim() ? "var(--accent)" : "var(--surface2)",
              color: input.trim() ? "#fff" : "var(--text-muted)",
              cursor: input.trim() ? "pointer" : "default",
              fontSize: "14px",
              fontWeight: 600,
              transition: "background 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {loading ? "Adding..." : "Add Topic"}
          </button>
        </div>
      </div>
    </div>
  );
}
