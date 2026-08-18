"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Layout } from "./components/Layout";
import { SectionLabel } from "./components/KaviAbout";
import { ProjectCard } from "./components/ProjectCard";
import { ProjectCardSkeleton } from "./components/ProjectCardSkeleton";
import { usePortfolioData } from "./data/portfolioData";

export default function ProjectsPage() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { data, loading } = usePortfolioData();

  return (
    <Layout>
      <section
        id="all-projects"
        ref={ref}
        style={{
          padding: "160px 24px 120px",
          opacity: loading ? 0.92 : 1,
          transition: "opacity 0.35s ease",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <SectionLabel label="Portfolio" delay={0} inView={inView} />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.6 }}
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 800,
              color: "var(--foreground)",
              letterSpacing: "-0.03em",
              margin: "20px 0 56px 0",
            }}
          >
            All projects
          </motion.h1>

          {loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "48px 32px",
              }}
              className="all-projects-grid"
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : data.projects.length === 0 ? (
            <p style={{ fontFamily: "'Inter', sans-serif", color: "rgba(var(--fg-rgb),0.5)" }}>
              No projects yet.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "48px 32px",
              }}
              className="all-projects-grid"
            >
              {data.projects.map((p, i) => (
                <ProjectCard key={`${p.id}-${i}`} project={p} index={i} inView={inView} />
              ))}
            </div>
          )}
        </div>

        <style>{`
          @media (max-width: 768px) {
            .all-projects-grid {
              grid-template-columns: 1fr !important;
            }
            #all-projects {
              padding: 120px 24px 80px !important;
            }
          }
          @media (max-width: 480px) {
            #all-projects {
              padding: 100px 16px 64px !important;
            }
          }
        `}</style>
      </section>
    </Layout>
  );
}
