import { SectionLabel } from "./About";

const experiences = [
  {
    id: 1,
    company: "NovaSphere Labs",
    title: "Staff Software Engineer · Platform",
    dates: "2023 — Present",
    scope:
      "Owned the entire developer platform: internal tooling, deployment infrastructure, and the observability stack serving eight production microservices.",
    achievement:
      "Migrated to GitOps with ArgoCD, cutting deployment time by 70% and eliminating manual release toil across six engineering teams.",
  },
  {
    id: 2,
    company: "Hexagon Systems",
    title: "Senior Full Stack Engineer",
    dates: "2021 — 2022",
    scope:
      "Product engineering for a B2B SaaS platform. Responsible for frontend architecture, API design, and real-time features handling 10K concurrent users.",
    achievement:
      "Redesigned the query execution layer with CQRS and event sourcing, reducing average latency from 800ms to 45ms at P95.",
  },
  {
    id: 3,
    company: "CloudAxis",
    title: "DevOps Engineer",
    dates: "2019 — 2021",
    scope:
      "First DevOps hire. Built CI/CD pipelines, containerized twelve legacy services, and established infrastructure-as-code practices across the engineering organization.",
    achievement:
      "Implemented distributed tracing with Jaeger, reducing mean time to resolution from four hours to twenty-two minutes.",
  },
  {
    id: 4,
    company: "Stratum Digital",
    title: "Frontend Engineer",
    dates: "2018 — 2019",
    scope:
      "Rebuilt the primary SaaS dashboard from a jQuery monolith to a React component system, improving Lighthouse performance score from 41 to 94.",
    achievement:
      "Introduced Storybook-driven development, reducing QA cycle time by 35% and establishing the component library still in use today.",
  },
];

export function Experience() {
  return (
    <section id="experience" style={{ paddingTop: "72px" }}>
      <div className="page-inner">
        <SectionLabel>EXPERIENCE</SectionLabel>

        <div style={{ marginTop: "28px" }}>
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="exp-entry"
              style={{
                padding: "24px 0",
                borderBottom: "1px solid #1F1F1F",
                transition: "background 150ms ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#141414";
                (e.currentTarget as HTMLElement).style.marginLeft = "-var(--page-px)";
                (e.currentTarget as HTMLElement).style.paddingLeft = "var(--page-px)";
                (e.currentTarget as HTMLElement).style.paddingRight = "var(--page-px)";
                (e.currentTarget as HTMLElement).style.marginRight = "-var(--page-px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.paddingLeft = "0";
                (e.currentTarget as HTMLElement).style.paddingRight = "0";
              }}
            >
              {/* Top row */}
              <div className="exp-top-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p
                    style={{
                      font: "500 15px/1.3 'Geist', system-ui, sans-serif",
                      color: "#F2F2F2",
                      margin: 0,
                    }}
                  >
                    {exp.company}
                  </p>
                  <p
                    style={{
                      font: "400 13px/1.3 'Geist', system-ui, sans-serif",
                      color: "#888",
                      margin: "2px 0 0 0",
                    }}
                  >
                    {exp.title}
                  </p>
                </div>
                <span
                  className="exp-date"
                  style={{
                    font: "400 12px/1 'Geist Mono', monospace",
                    color: "#444",
                    whiteSpace: "nowrap",
                    marginLeft: "20px",
                    marginTop: "2px",
                    flexShrink: 0,
                  }}
                >
                  {exp.dates}
                </span>
              </div>

              {/* Body */}
              <div style={{ marginTop: "10px" }}>
                <p
                  style={{
                    font: "400 14px/1.6 'Geist', system-ui, sans-serif",
                    color: "#888",
                    margin: 0,
                  }}
                >
                  {exp.scope} {exp.achievement}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 389px) {
          .exp-date {
            display: block !important;
            font-size: 11px !important;
            margin-left: 0 !important;
            margin-top: 4px !important;
          }
          .exp-top-row {
            flex-direction: column !important;
          }
        }
      `}</style>
    </section>
  );
}
