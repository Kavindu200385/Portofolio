import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

const experiences = [
  {
    id: 1,
    company: "NovaSphere Labs",
    role: "Staff Software Engineer · Platform",
    duration: "Jan 2023 — Present",
    location: "Remote",
    achievements: [
      "Reduced deployment time by 70% via GitOps migration to ArgoCD across 8 microservices",
      "Architected multi-tenant K8s cluster serving 300K+ daily active users with 99.98% SLA",
      "Led team of 6 engineers through complete infrastructure rewrite cutting cloud spend by $180K/yr",
    ],
  },
  {
    id: 2,
    company: "Hexagon Systems",
    role: "Senior Full Stack Engineer",
    duration: "Mar 2021 — Dec 2022",
    location: "Berlin, DE",
    achievements: [
      "Built real-time collaborative editor (similar to Notion) handling 10K concurrent connections via WebSockets",
      "Designed event-sourcing architecture with CQRS pattern reducing query latency from 800ms to 45ms",
      "Shipped 0→1 mobile app (React Native) adopted by 50K users in first quarter",
    ],
  },
  {
    id: 3,
    company: "CloudAxis",
    role: "DevOps Engineer",
    duration: "Jun 2019 — Feb 2021",
    location: "London, UK",
    achievements: [
      "Established full CI/CD pipeline with GitHub Actions + Terraform replacing manual SSH deploys",
      "Containerized 12 legacy Python services to Docker, enabling horizontal scaling on AWS ECS",
      "Implemented distributed tracing with Jaeger reducing MTTR from 4h to 22min",
    ],
  },
  {
    id: 4,
    company: "Stratum Digital",
    role: "Frontend Engineer",
    duration: "Jan 2018 — May 2019",
    location: "Remote",
    achievements: [
      "Rebuilt flagship SaaS dashboard in React, improving Lighthouse score from 41 to 94",
      "Introduced component-driven development with Storybook, cutting QA time by 35%",
      "Mentored 3 junior engineers on modern frontend patterns and code review culture",
    ],
  },
];

function ExperienceItem({ exp, index }: { exp: (typeof experiences)[0]; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-8"
    >
      {/* Timeline line */}
      <div
        className="absolute left-0 top-0 bottom-0 w-px"
        style={{ background: expanded ? "rgba(0,240,255,0.4)" : "rgba(255,255,255,0.08)" }}
      />
      {/* Timeline dot */}
      <div
        className="absolute left-0 top-6 w-2 h-2 rounded-full"
        style={{
          background: expanded ? "#00F0FF" : "#7A7A8C",
          boxShadow: expanded ? "0 0 10px #00F0FF" : "none",
          transform: "translateX(-50%)",
          transition: "all 0.3s ease",
        }}
      />

      <div
        className="rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
        style={{
          background: expanded ? "#0D0D1E" : "#0A0A16",
          border: expanded
            ? "1px solid rgba(0,240,255,0.25)"
            : "1px solid rgba(255,255,255,0.05)",
          boxShadow: expanded ? "0 0 40px rgba(0,240,255,0.05)" : "none",
        }}
        onClick={() => setExpanded(!expanded)}
        data-cursor-hover
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h3
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                  color: "#EDEAE4",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {exp.company}
              </h3>
              <span
                className="px-2 py-0.5 rounded-md"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.65rem",
                  color: "#7A7A8C",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {exp.duration}
              </span>
            </div>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.78rem",
                color: "#00F0FF",
                margin: 0,
              }}
            >
              {exp.role}
            </p>
          </div>

          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0 ml-4"
            style={{ color: "#7A7A8C" }}
          >
            <ChevronDown size={18} />
          </motion.div>
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div
                className="px-6 pb-6 space-y-2.5"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="pt-4" />
                {exp.achievements.map((ach, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-3"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.78rem",
                      color: "#7A7A8C",
                      lineHeight: 1.6,
                    }}
                  >
                    <span style={{ color: "#A3FF47", flexShrink: 0, marginTop: "2px" }}>✓</span>
                    <span>{ach}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function Experience() {
  return (
    <section id="experience" style={{ background: "#080810", padding: "100px 0" }}>
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14"
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.75rem",
              color: "#00F0FF",
              letterSpacing: "0.15em",
            }}
          >
            04. EXPERIENCE
          </span>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              color: "#EDEAE4",
              marginTop: "0.5rem",
              lineHeight: 1.1,
            }}
          >
            Where I've{" "}
            <span style={{ color: "#00F0FF" }}>shipped.</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-4">
          {experiences.map((exp, i) => (
            <ExperienceItem key={exp.id} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
