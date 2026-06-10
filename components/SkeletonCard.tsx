"use client";

export default function SkeletonCard({ index }: { index: number }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderLeft: "3px solid var(--border)",
        borderRadius: "12px",
        padding: "16px 18px",
        animationDelay: `${index * 0.07}s`,
      }}
      className="fade-up"
    >
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <div className="skeleton" style={{ width: 100, height: 18 }} />
        <div className="skeleton" style={{ width: 60, height: 18 }} />
        <div className="skeleton" style={{ width: 70, height: 18 }} />
      </div>
      <div className="skeleton" style={{ width: "90%", height: 20, marginBottom: 6 }} />
      <div className="skeleton" style={{ width: "70%", height: 20, marginBottom: 10 }} />
      <div className="skeleton" style={{ width: "95%", height: 14, marginBottom: 4 }} />
      <div className="skeleton" style={{ width: "80%", height: 14 }} />
    </div>
  );
}
