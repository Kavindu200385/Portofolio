import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { SectionLabel } from "./KaviAbout";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { usePortfolioData } from "../data/portfolioData";

const BADGE_COLORS: Record<string, string> = {
  Group: "#4F8EF7",
  Individual: "#7C3AED",
  Research: "#06b6d4",
  Personal: "#10b981",
};

function ProjectCard({
  project,
  index,
  inView,
}: {
  project: {
    id: string;
    name: string;
    type: string;
    shortDescription: string;
    longDescription: string;
    thumbnail: string;
    githubLink: string;
    liveDemoLink: string;
    techStack: string[];
  };
  index: number;
  inView: boolean;
}) {
  const [hov, setHov] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * -10;
    setTilt({ x, y });
  };

  const typeKey = project.type as keyof typeof BADGE_COLORS;
  const badgeColor = BADGE_COLORS[typeKey] ?? "#4F8EF7";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: 0.1 + index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => {
        setHov(false);
        setTilt({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
      style={{
        borderRadius: "24px",
        overflow: "hidden",
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${hov ? "rgba(79,142,247,0.25)" : "rgba(255,255,255,0.07)"}`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        cursor: "none",
        transition: "border-color 200ms ease",
        transform: hov
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`
          : "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)",
        boxShadow: hov
          ? "0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(79,142,247,0.1)"
          : "0 4px 16px rgba(0,0,0,0.2)",
        transitionProperty: "transform, box-shadow, border-color",
        transitionDuration: "250ms",
        transitionTimingFunction: "ease-out",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
        <ImageWithFallback
          src={project.thumbnail}
          alt={project.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: hov ? "scale(1.05)" : "scale(1)",
            transition: "transform 400ms ease",
          }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, transparent 40%, rgba(8,8,16,0.85) 100%)",
          }}
        />
        {/* Badge */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            padding: "4px 12px",
            borderRadius: "100px",
            background: `${badgeColor}22`,
            border: `1px solid ${badgeColor}55`,
            fontFamily: "'Inter', sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            color: badgeColor,
            letterSpacing: "0.06em",
            textTransform: "uppercase" as const,
          }}
        >
          {project.type}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 24px 24px" }}>
        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "18px",
            fontWeight: 700,
            color: "#fff",
            marginBottom: "8px",
            letterSpacing: "-0.02em",
          }}
        >
          {project.name}
        </div>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "13px",
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.5)",
            margin: "0 0 16px 0",
          }}
        >
          {project.shortDescription || project.longDescription}
        </p>

        {/* Stack tags */}
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}
        >
          {project.techStack.map((s) => (
            <span
              key={s}
              style={{
                padding: "3px 10px",
                borderRadius: "6px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                fontFamily: "'Inter', sans-serif",
                fontSize: "11px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "0.02em",
              }}
            >
              {s}
            </span>
          ))}
        </div>

        {/* View button — appears on hover */}
        <motion.div
          animate={{ opacity: hov ? 1 : 0, y: hov ? 0 : 6 }}
          transition={{ duration: 0.2 }}
        >
          <a
            href={project.liveDemoLink || project.githubLink || "#"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 20px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #4F8EF7, #7C3AED)",
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              color: "#fff",
              textDecoration: "none",
              letterSpacing: "-0.01em",
            }}
          >
            View Project
            <span style={{ fontSize: "14px" }}>↗</span>
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function KaviWorks() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { data } = usePortfolioData();
  const projects = [
    // Featured projects first, then the rest, while preserving relative order
    ...data.projects.filter((p) => p.featured),
    ...data.projects.filter((p) => !p.featured),
  ];

  return (
    <section
      id="works"
      ref={ref}
      style={{ padding: "120px 24px" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <SectionLabel label="Selected Works" delay={0} inView={inView} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "16px",
            margin: "20px 0 52px 0",
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
            Things I've Built
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              color: "rgba(255,255,255,0.3)",
              margin: 0,
            }}
          >
            {projects.length} projects
          </motion.p>
        </div>

        {/* 3-column masonry-style grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
          }}
          className="works-grid"
        >
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} inView={inView} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .works-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          #works {
            padding: 80px 24px !important;
          }
        }
        @media (max-width: 640px) {
          .works-grid {
            grid-template-columns: 1fr !important;
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