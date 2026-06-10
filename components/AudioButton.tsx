"use client";

import { useState, useCallback, useEffect } from "react";

interface AudioButtonProps {
  text: string;
  size?: "sm" | "md";
}

export default function AudioButton({ text, size = "sm" }: AudioButtonProps) {
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis?.cancel();
      }
    };
  }, []);

  const toggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!supported) return;

      if (playing) {
        window.speechSynthesis.cancel();
        setPlaying(false);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.lang = "en-US";

      // Pick a good voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) =>
          v.name.includes("Google") ||
          v.name.includes("Samantha") ||
          v.name.includes("Daniel")
      );
      if (preferred) utterance.voice = preferred;

      utterance.onend = () => setPlaying(false);
      utterance.onerror = () => setPlaying(false);

      setPlaying(true);
      window.speechSynthesis.speak(utterance);
    },
    [playing, supported, text]
  );

  if (!supported) return null;

  const dim = size === "md" ? 36 : 28;

  return (
    <button
      onClick={toggle}
      title={playing ? "Stop reading" : "Read aloud"}
      style={{
        width: dim,
        height: dim,
        borderRadius: "50%",
        border: `1px solid ${playing ? "var(--accent)" : "var(--border)"}`,
        background: playing ? "var(--accent)22" : "transparent",
        color: playing ? "var(--accent)" : "var(--text-muted)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s ease",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {playing && (
        <span
          style={{
            position: "absolute",
            inset: -3,
            borderRadius: "50%",
            border: "1px solid var(--accent)",
            animation: "pulse-ring 1s ease-out infinite",
          }}
        />
      )}
      {playing ? (
        // Stop icon
        <svg width={size === "md" ? 14 : 11} height={size === "md" ? 14 : 11} viewBox="0 0 14 14" fill="currentColor">
          <rect x="2" y="2" width="10" height="10" rx="1" />
        </svg>
      ) : (
        // Speaker icon
        <svg width={size === "md" ? 15 : 12} height={size === "md" ? 15 : 12} viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="2,4.5 2,10.5 5,10.5 9,13.5 9,1.5 5,4.5" fill="currentColor" stroke="none" />
          <path d="M11 5a3.5 3.5 0 0 1 0 5" />
        </svg>
      )}
    </button>
  );
}
