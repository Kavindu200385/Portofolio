import type { ReactNode } from "react";

const kvRows = [
  { label: "Location", value: "Colombo, Sri Lanka" },
  { label: "Experience", value: "7+ years" },
  { label: "Focused on", value: "Full Stack · DevOps · Cloud" },
  { label: "Currently", value: "Staff Engineer at NovaSphere Labs" },
  { label: "Education", value: "B.Sc. Computer Science · University of Colombo" },
];

export function About() {
  return (
    <section id="about" style={{ paddingTop: "72px" }}>
      <div className="page-inner">
        <SectionLabel>ABOUT</SectionLabel>

        <div style={{ marginTop: "28px" }}>
          <p
            style={{
              font: "400 15px/1.7 'Geist', system-ui, sans-serif",
              color: "#888",
              margin: "0 0 16px 0",
              maxWidth: "600px",
            }}
          >
            I've spent seven years building systems that need to work when it matters. My work spans
            full-stack product engineering and the infrastructure that keeps it running — Kubernetes
            clusters, CI/CD pipelines, distributed systems, and the observability layer that tells you
            when something breaks before the customer does.
          </p>
          <p
            style={{
              font: "400 15px/1.7 'Geist', system-ui, sans-serif",
              color: "#888",
              margin: 0,
              maxWidth: "600px",
            }}
          >
            I care about the craft of engineering: clean abstractions, sensible defaults, systems that
            future engineers can reason about at 2am. I'm direct, I move quickly, and I write documentation.
          </p>
        </div>

        {/* Key-value table */}
        <div style={{ marginTop: "32px" }}>
          {kvRows.map((row, i) => (
            <div
              key={row.label}
              className="kv-row"
              style={{
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid #181818",
              }}
            >
              <span
                className="kv-label"
                style={{
                  font: "400 12px/1 'Geist Mono', monospace",
                  color: "#444",
                  minWidth: "120px",
                  flexShrink: 0,
                  letterSpacing: "0.02em",
                }}
              >
                {row.label}
              </span>
              <span
                className="kv-value"
                style={{
                  font: "400 14px/1 'Geist', system-ui, sans-serif",
                  color: "#888",
                }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .kv-row {
          height: 44px;
          gap: 0;
        }
        @media (max-width: 767px) {
          .kv-row {
            height: auto !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 12px 0 !important;
          }
          .kv-label {
            font-size: 11px !important;
            margin-bottom: 4px !important;
          }
          .kv-value {
            font-size: 14px !important;
          }
        }
      `}</style>
    </section>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        font: "400 11px/1 'Geist Mono', monospace",
        color: "#444",
        letterSpacing: "0.1em",
        margin: 0,
        textTransform: "uppercase" as const,
      }}
    >
      {children}
    </p>
  );
}