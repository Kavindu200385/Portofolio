"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { SectionLabel } from "./KaviAbout";
import { ProjectCard } from "./ProjectCard";
import { ProjectCardSkeleton } from "./ProjectCardSkeleton";
import { usePortfolioData } from "../data/portfolioData";

export function KaviFeaturedWork() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { data, loading } = usePortfolioData();
  // While the first fetch is still in flight, `data.projects` holds bundled placeholder
  // content (so the page isn't blank) — never render that as if it were real, show a
  // skeleton instead so visitors only ever see actual database projects.
  const projects = data.projects.slice(0, 3);

  if (!loading && projects.length === 0) return null;

  return (
    <section
      id="featured-work"
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
            Selected work
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
            Work I'm most proud of — projects I led that shipped.
          </motion.p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "40px 28px",
          }}
          className="featured-work-grid"
        >
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <ProjectCardSkeleton key={i} />)
            : projects.map((p, i) => <ProjectCard key={`${p.id}-${i}`} project={p} index={i} inView={inView} />)}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .featured-work-grid {
            grid-template-columns: 1fr !important;
          }
          #featured-work {
            padding: 80px 24px !important;
          }
        }
        @media (max-width: 480px) {
          #featured-work {
            padding: 64px 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
