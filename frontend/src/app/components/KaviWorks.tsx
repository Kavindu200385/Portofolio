"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { SectionLabel } from "./KaviAbout";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { usePortfolioData, type ProjectItem } from "../data/portfolioData";

function ProjectCard({
  project,
  index,
  inView,
}: {
  project: ProjectItem;
  index: number;
  inView: boolean;
}) {
  const [hov, setHov] = useState(false);
  const caseStudyHref =
    (project.liveDemoLink && project.liveDemoLink !== "#" && project.liveDemoLink) ||
    (project.githubLink && project.githubLink !== "#" && project.githubLink) ||
    "";
  const categoryTags = [project.type, ...project.techStack.slice(0, 2)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Preview image with gradient-tinted background + hover overlay */}
      <div
        style={{
          position: "relative",
          borderRadius: "24px",
          overflow: "hidden",
          aspectRatio: "16/10",
          background: "linear-gradient(135deg, rgba(79,142,247,0.18), rgba(124,58,237,0.18))",
          cursor: caseStudyHref ? "pointer" : "default",
        }}
        onClick={() => {
          if (caseStudyHref) window.open(caseStudyHref, "_blank", "noreferrer");
        }}
      >
        <ImageWithFallback
          src={project.thumbnail}
          alt={project.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: hov ? "scale(1.04)" : "scale(1)",
            transition: "transform 400ms ease",
          }}
        />
        {/* Dark overlay + case-study pill on hover */}
        <motion.div
          animate={{ opacity: hov ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(8,8,16,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {caseStudyHref ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 26px",
                borderRadius: "100px",
                background: "#fff",
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "#080810",
                letterSpacing: "-0.01em",
              }}
            >
              View case study →
            </span>
          ) : null}
        </motion.div>
      </div>

      {/* Meta row: category tags left, (date range TBD) right */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "18px",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          {categoryTags.join(" · ")}
        </div>
        {project.featured ? (
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "12px",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.04em",
            }}
          >
            Featured
          </div>
        ) : null}
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "22px",
          fontWeight: 700,
          color: "#fff",
          marginTop: "10px",
          letterSpacing: "-0.02em",
        }}
      >
        {project.name}
      </div>

      {/* One-line result/impact */}
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "14px",
          lineHeight: 1.6,
          color: "rgba(255,255,255,0.5)",
          margin: "6px 0 0 0",
        }}
      >
        {project.shortDescription || project.longDescription}
      </p>
    </motion.div>
  );
}

export function KaviWorks() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { data, loading } = usePortfolioData();
  const featured = data.projects.filter((p) => p.featured);
  const projects = featured.length > 0 ? featured : data.projects;

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
              color: "#fff",
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
              color: "rgba(255,255,255,0.4)",
              margin: 0,
              textAlign: "right",
              maxWidth: "360px",
            }}
          >
            Work I'm most proud of — projects I led that shipped.
          </motion.p>
        </div>

        {/* 2-column grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "48px 32px",
          }}
          className="works-grid"
        >
          {projects.map((p, i) => (
            <ProjectCard key={`${p.id}-${i}`} project={p} index={i} inView={inView} />
          ))}
        </div>
      </div>

      <style>{`
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
