"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { SectionLabel } from "./KaviAbout";
import { usePortfolioData } from "../data/portfolioData";
import { SkillIcon } from "./skillIcons";

function SkillCard({
  skill,
  delay,
  inView,
}: {
  skill: { id: string; name: string; shortDescription: string; icon: string; size: "normal" | "wide"; color: string };
  delay: number;
  inView: boolean;
}) {
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        gridColumn: skill.size === "wide" ? "span 2" : "span 1",
        padding: "24px",
        borderRadius: "20px",
        background: hov ? "rgba(79,142,247,0.07)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${hov ? "rgba(79,142,247,0.25)" : "rgba(255,255,255,0.07)"}`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        cursor: "default",
        transition: "background 200ms ease, border-color 200ms ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Shimmer sweep on hover */}
      {hov && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Icon */}
      <motion.div
        animate={hov ? { scale: 1.15, rotate: 8 } : { scale: 1, rotate: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        style={{
          width: 48,
          height: 48,
          borderRadius: "14px",
          background: `${skill.color}18`,
          border: `1px solid ${skill.color}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "14px",
        }}
      >
        <SkillIcon id={skill.id} name={skill.name} icon={skill.icon} color={skill.color} size={28} />
      </motion.div>

      <div
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "16px",
          fontWeight: 700,
          color: hov ? "#fff" : "rgba(255,255,255,0.9)",
          marginBottom: "6px",
          transition: "color 200ms ease",
        }}
      >
        {skill.name}
      </div>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "13px",
          lineHeight: 1.6,
          color: "rgba(255,255,255,0.4)",
          margin: 0,
        }}
      >
        {skill.shortDescription}
      </p>
    </motion.div>
  );
}

export function KaviSkills() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { data, loading } = usePortfolioData();
  const skills = data.skills;

  if (loading) {
    return (
      <section id="skills" style={{ padding: "120px 24px", background: "rgba(14,14,28,0.5)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", color: "rgba(255,255,255,0.35)" }}>Loading skills…</div>
      </section>
    );
  }

  return (
    <section
      id="skills"
      ref={ref}
      style={{ padding: "120px 24px", background: "rgba(14,14,28,0.5)" }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <SectionLabel label="Capabilities" delay={0} inView={inView} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "16px",
            margin: "20px 0 48px 0",
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
            Tools & Technologies
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              color: "rgba(255,255,255,0.35)",
              margin: 0,
            }}
          >
            {skills.length} skills
          </motion.p>
        </div>

        {/* Bento grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "14px",
          }}
          className="skills-bento-grid"
        >
          {skills.map((skill, i) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              delay={0.1 + i * 0.06}
              inView={inView}
            />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .skills-bento-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          #skills {
            padding: 80px 24px !important;
          }
        }
        @media (max-width: 480px) {
          #skills {
            padding: 64px 16px !important;
          }
          .skills-bento-grid {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
          .skills-bento-grid > div {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </section>
  );
}