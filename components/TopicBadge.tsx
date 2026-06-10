"use client";

interface TopicBadgeProps {
  label: string;
  isDefault?: boolean;
}

const TAG_STYLES: Record<string, { bg: string; text: string }> = {
  "AI & Generative Tech": { bg: "var(--tag-ai)", text: "var(--tag-ai-text)" },
  "Tech World": { bg: "var(--tag-tech)", text: "var(--tag-tech-text)" },
  "Big Companies": { bg: "var(--tag-companies)", text: "var(--tag-companies-text)" },
  "India & USA Politics": { bg: "var(--tag-politics)", text: "var(--tag-politics-text)" },
  "Must Know": { bg: "var(--tag-mustknow)", text: "var(--tag-mustknow-text)" },
};

export default function TopicBadge({ label }: TopicBadgeProps) {
  const style = TAG_STYLES[label] || {
    bg: "var(--tag-custom)",
    text: "var(--tag-custom-text)",
  };

  return (
    <span
      style={{
        background: style.bg,
        color: style.text,
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.04em",
        padding: "2px 8px",
        borderRadius: "100px",
        fontFamily: "var(--font-space-grotesk), monospace",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
