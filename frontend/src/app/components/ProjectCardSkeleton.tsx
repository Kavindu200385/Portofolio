"use client";

export function ProjectCardSkeleton() {
  return (
    <div style={{ animation: "project-skeleton-pulse 1.6s ease-in-out infinite" }}>
      <div
        style={{
          borderRadius: "24px",
          aspectRatio: "16/10",
          background: "rgba(var(--fg-rgb),0.06)",
        }}
      />
      <div
        style={{
          height: "12px",
          width: "40%",
          borderRadius: "4px",
          background: "rgba(var(--fg-rgb),0.06)",
          marginTop: "18px",
        }}
      />
      <div
        style={{
          height: "22px",
          width: "70%",
          borderRadius: "4px",
          background: "rgba(var(--fg-rgb),0.08)",
          marginTop: "10px",
        }}
      />
      <div
        style={{
          height: "14px",
          width: "90%",
          borderRadius: "4px",
          background: "rgba(var(--fg-rgb),0.06)",
          marginTop: "12px",
        }}
      />

      <style>{`
        @keyframes project-skeleton-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
