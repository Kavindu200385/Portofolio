"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { SectionLabel } from "./KaviAbout";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { usePortfolioData, type ProjectItem } from "../data/portfolioData";

function LabCard({ project, index, inView }: { project: ProjectItem; index: number; inView: boolean }) {
  const href =
    (project.liveDemoLink && project.liveDemoLink !== "#" && project.liveDemoLink) ||
    (project.githubLink && project.githubLink !== "#" && project.githubLink) ||
    "";
  const year = new Date().getFullYear();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      style={{
        borderRadius: "20px",
        overflow: "hidden",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden" }}>
        <ImageWithFallback
          src={project.thumbnail}
          alt={project.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, transparent 50%, rgba(8,8,16,0.85) 100%)",
          }}
        />
      </div>
      <div style={{ padding: "16px 18px 20px" }}>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              color: "#4F8EF7",
              textDecoration: "none",
              letterSpacing: "-0.01em",
            }}
          >
            {project.name}
          </a>
        ) : (
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.01em",
            }}
          >
            {project.name}
          </div>
        )}
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "13px",
            lineHeight: 1.55,
            color: "rgba(255,255,255,0.5)",
            margin: "6px 0 12px 0",
          }}
        >
          {project.shortDescription}
        </p>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          {project.techStack.slice(0, 3).join(", ") || "Web"} · {year}
        </div>
      </div>
    </motion.div>
  );
}

export function KaviLabs() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { data, loading } = usePortfolioData();
  const notFeatured = data.projects.filter((p) => !p.featured);
  const projects = notFeatured.length > 0 ? notFeatured : data.projects;

  return (
    <section
      id="labs"
      ref={ref}
      style={{ padding: "120px 24px", opacity: loading ? 0.92 : 1, transition: "opacity 0.35s ease" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <SectionLabel label="Labs" delay={0} inView={inView} />

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.6 }}
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.03em",
            margin: "20px 0 12px 0",
          }}
        >
          Apps I've built
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px",
            color: "rgba(255,255,255,0.4)",
            margin: "0 0 52px 0",
            maxWidth: "480px",
          }}
        >
          Smaller builds, experiments, and side projects I keep shipping for fun.
        </motion.p>

        <div
          className="labs-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}
        >
          {projects.map((p, i) => (
            <LabCard key={`${p.id}-${i}`} project={p} index={i} inView={inView} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .labs-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .labs-grid {
            grid-template-columns: 1fr !important;
          }
          #labs {
            padding: 80px 24px !important;
          }
        }
        @media (max-width: 480px) {
          #labs {
            padding: 64px 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
