"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Link } from "react-router";
import { SectionLabel } from "./KaviAbout";
import { ProjectCard } from "./ProjectCard";
import { usePortfolioData } from "../data/portfolioData";

export function KaviWorks() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { data, loading } = usePortfolioData();
  // Normally the "next 6" after the featured teaser's first 3 — but if there aren't enough
  // projects for that split (e.g. only 1-3 total), fall back to showing whatever exists so
  // this section (and the "Work" nav link, which points here) isn't silently invisible.
  const rest = data.projects.slice(3, 9);
  const projects = rest.length > 0 ? rest : data.projects;

  if (projects.length === 0) return null;

  return (
    <section
      id="works"
      ref={ref}
      style={{ padding: "120px 24px", opacity: loading ? 0.92 : 1, transition: "opacity 0.35s ease" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <SectionLabel label="Portfolio" delay={0} inView={inView} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "16px",
            margin: "20px 0 56px 0",
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.6 }}
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 800,
              color: "var(--foreground)",
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Projects
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              color: "rgba(var(--fg-rgb),0.4)",
              margin: 0,
              textAlign: "right",
              maxWidth: "360px",
            }}
          >
            More of what I've been building.
          </motion.p>
        </div>

        {/* 3-column grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "40px 28px",
          }}
          className="works-grid"
        >
          {projects.map((p, i) => (
            <ProjectCard key={`${p.id}-${i}`} project={p} index={i} inView={inView} />
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: "56px" }}>
          <Link
            to="/projects"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "13px 28px",
              borderRadius: "100px",
              border: "1px solid rgba(var(--fg-rgb),0.2)",
              fontFamily: "'Inter', sans-serif",
              fontSize: "15px",
              fontWeight: 500,
              color: "var(--foreground)",
              textDecoration: "none",
              transition: "background 200ms ease, border-color 200ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(var(--fg-rgb),0.08)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(var(--fg-rgb),0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(var(--fg-rgb),0.2)";
            }}
          >
            Show more
            <span>→</span>
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .works-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .works-grid {
            grid-template-columns: 1fr !important;
          }
          #works {
            padding: 80px 24px !important;
          }
        }
        @media (max-width: 480px) {
          #works {
            padding: 64px 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
