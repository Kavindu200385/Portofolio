import { useState } from "react";
import { SectionLabel } from "./About";

const projects = [
  {
    id: 1,
    name: "KubeFlow Ops",
    year: "2024",
    description: "Internal GitOps platform for Kubernetes — cluster health monitoring, auto-scaling policies, and self-service deploy pipelines.",
    stack: "Go · Kubernetes · ArgoCD · Prometheus",
    github: "https://github.com",
    live: null,
  },
  {
    id: 2,
    name: "Axiom Analytics",
    year: "2024",
    description: "Real-time SaaS analytics engine processing 50M+ events per day with sub-100ms query latency on ClickHouse.",
    stack: "TypeScript · React · ClickHouse · Redis",
    github: "https://github.com",
    live: "https://example.com",
  },
  {
    id: 3,
    name: "NightWatch",
    year: "2023",
    description: "Distributed incident detection and alerting system. Self-hosted PagerDuty alternative built on Kafka event streams.",
    stack: "Python · FastAPI · Kafka · PostgreSQL",
    github: "https://github.com",
    live: null,
  },
  {
    id: 4,
    name: "DevShell",
    year: "2023",
    description: "Cloud dev environment provisioner. Spins up reproducible Nix-based shells in under 10 seconds from a config file.",
    stack: "Go · Nix · Terraform · AWS",
    github: "https://github.com",
    live: "https://example.com",
  },
  {
    id: 5,
    name: "Cipher API Gateway",
    year: "2022",
    description: "Zero-trust API gateway with mTLS, distributed rate limiting, and Jaeger tracing at 1M requests per minute.",
    stack: "Go · Nginx · Vault · Jaeger",
    github: "https://github.com",
    live: null,
  },
  {
    id: 6,
    name: "NeonGrid UI",
    year: "2022",
    description: "Open-source component library for developer tooling. 80+ accessible components built on Radix primitives.",
    stack: "TypeScript · React · Radix UI · Storybook",
    github: "https://github.com",
    live: "https://example.com",
  },
];

function ProjectListItem({ project }: { project: (typeof projects)[0] }) {
  return (
    <div
      style={{
        padding: "20px 0",
        borderBottom: "1px solid #1F1F1F",
        transition: "background 150ms ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#141414")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
    >
      {/* Name + year */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "16px" }}>
        <span
          style={{
            font: "500 15px/1 'Geist', system-ui, sans-serif",
            color: "#F2F2F2",
          }}
        >
          {project.name}
          <span
            className="project-year-inline"
            style={{ display: "none", font: "400 12px/1 'Geist Mono', monospace", color: "#444", marginLeft: "10px" }}
          >
            · {project.year}
          </span>
        </span>
        <span
          className="project-year-desktop"
          style={{ font: "400 12px/1 'Geist Mono', monospace", color: "#444", flexShrink: 0 }}
        >
          {project.year}
        </span>
      </div>

      {/* Description */}
      <p
        style={{
          font: "400 14px/1.5 'Geist', system-ui, sans-serif",
          color: "#888",
          margin: "4px 0 0 0",
        }}
      >
        {project.description}
      </p>

      {/* Stack + links */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "8px",
          gap: "16px",
        }}
      >
        <span
          style={{
            font: "400 12px/1 'Geist Mono', monospace",
            color: "#444",
          }}
        >
          {project.stack}
        </span>
        <div style={{ display: "flex", gap: "16px", flexShrink: 0 }}>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              font: "400 12px/1 'Geist', system-ui, sans-serif",
              color: "#444",
              textDecoration: "none",
              transition: "color 150ms ease",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#F2F2F2")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#444")}
          >
            GitHub ↗
          </a>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                font: "400 12px/1 'Geist', system-ui, sans-serif",
                color: "#444",
                textDecoration: "none",
                transition: "color 150ms ease",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#F2F2F2")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#444")}
            >
              Live ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectGridItem({ project }: { project: (typeof projects)[0] }) {
  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #1F1F1F",
        borderRadius: "4px",
        transition: "background 150ms ease",
        cursor: "default",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#141414")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ font: "500 15px/1 'Geist', system-ui, sans-serif", color: "#F2F2F2" }}>
          {project.name}
        </span>
        <span style={{ font: "400 12px/1 'Geist Mono', monospace", color: "#444" }}>
          {project.year}
        </span>
      </div>
      <p style={{ font: "400 14px/1.5 'Geist', system-ui, sans-serif", color: "#888", margin: 0, flex: 1 }}>
        {project.description}
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
        <span style={{ font: "400 12px/1 'Geist Mono', monospace", color: "#444" }}>{project.stack}</span>
        <div style={{ display: "flex", gap: "12px" }}>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{ font: "400 12px/1 'Geist', system-ui, sans-serif", color: "#444", textDecoration: "none", transition: "color 150ms ease" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#F2F2F2")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#444")}
          >
            GitHub ↗
          </a>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              style={{ font: "400 12px/1 'Geist', system-ui, sans-serif", color: "#444", textDecoration: "none", transition: "color 150ms ease" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#F2F2F2")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#444")}
            >
              Live ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  const [view, setView] = useState<"list" | "grid">("list");

  return (
    <section id="work" style={{ paddingTop: "72px" }}>
      <div className="page-inner">
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <SectionLabel>PROJECTS</SectionLabel>
          {/* Toggle — desktop only */}
          <div
            className="view-toggle"
            style={{ display: "flex", gap: "12px", alignItems: "center" }}
          >
            {(["list", "grid"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  font: "400 12px/1 'Geist Mono', monospace",
                  color: view === v ? "#F2F2F2" : "#444",
                  cursor: "pointer",
                  transition: "color 150ms ease",
                  textTransform: "capitalize",
                }}
                onMouseEnter={(e) => {
                  if (view !== v) (e.target as HTMLElement).style.color = "#888";
                }}
                onMouseLeave={(e) => {
                  if (view !== v) (e.target as HTMLElement).style.color = "#444";
                }}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* List view */}
        {view === "list" && (
          <div style={{ marginTop: "28px" }}>
            {projects.map((p) => (
              <ProjectListItem key={p.id} project={p} />
            ))}
          </div>
        )}

        {/* Grid view */}
        {view === "grid" && (
          <div
            style={{
              marginTop: "28px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            {projects.map((p) => (
              <ProjectGridItem key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .view-toggle {
          display: flex;
        }
        @media (max-width: 1279px) {
          .view-toggle { display: none !important; }
        }
        .project-year-desktop {
          display: block;
        }
        @media (max-width: 389px) {
          .project-year-desktop { display: none !important; }
          .project-year-inline { display: inline !important; }
        }
      `}</style>
    </section>
  );
}
