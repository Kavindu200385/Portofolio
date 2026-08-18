"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { ProjectItem } from "../data/portfolioData";

export function ProjectCard({
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
            color: "rgba(var(--fg-rgb),0.4)",
          }}
        >
          {categoryTags.join(" · ")}
        </div>
        {project.featured ? (
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "12px",
              color: "rgba(var(--fg-rgb),0.3)",
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
          color: "var(--foreground)",
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
          color: "rgba(var(--fg-rgb),0.5)",
          margin: "6px 0 0 0",
        }}
      >
        {project.shortDescription || project.longDescription}
      </p>
    </motion.div>
  );
}
