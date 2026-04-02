import { SectionLabel } from "./About";

const stackRows = [
  { label: "Languages", value: "TypeScript · Python · Go · Bash · SQL" },
  { label: "Frontend", value: "React · Next.js · TailwindCSS" },
  { label: "Backend", value: "Node.js · FastAPI · REST · GraphQL · Redis" },
  { label: "Databases", value: "PostgreSQL · MongoDB · MySQL" },
  { label: "DevOps", value: "Docker · Kubernetes · Terraform · Ansible" },
  { label: "Cloud", value: "AWS · GCP · Vercel · Cloudflare" },
  { label: "CI/CD", value: "GitHub Actions · ArgoCD · Jenkins" },
  { label: "Monitoring", value: "Prometheus · Grafana · Datadog · ELK" },
];

export function Stack() {
  return (
    <section id="stack" style={{ paddingTop: "72px" }}>
      <div className="page-inner">
        <SectionLabel>STACK</SectionLabel>

        <div style={{ marginTop: "28px" }}>
          {stackRows.map((row, i) => (
            <div
              key={row.label}
              className="stack-row"
              style={{
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid #181818",
              }}
            >
              <span
                className="stack-label"
                style={{
                  font: "400 12px/1 'Geist Mono', monospace",
                  color: "#444",
                  minWidth: "110px",
                  flexShrink: 0,
                  letterSpacing: "0.02em",
                }}
              >
                {row.label}
              </span>
              <span
                className="stack-value"
                style={{
                  font: "400 13px/1 'Geist', system-ui, sans-serif",
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
        .stack-row {
          height: 40px;
        }
        @media (max-width: 767px) {
          .stack-row {
            height: auto !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 12px 0 !important;
            gap: 4px !important;
          }
          .stack-label {
            font-size: 11px !important;
          }
          .stack-value {
            font-size: 13px !important;
          }
        }
      `}</style>
    </section>
  );
}
