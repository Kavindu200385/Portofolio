import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { SectionLabel } from "./KaviAbout";
import { usePortfolioData } from "../data/portfolioData";

type TimelineType = "experience" | "education";

type TimelineEntry = {
  id: number;
  type: TimelineType;
  icon: string;
  side: "left" | "right";
  org: string;
  role: string;
  dates?: string;
  startDate?: string;
  isCurrent?: boolean;
  description: string;
};

function TimelineCard({
  entry,
  index,
}: {
  entry: TimelineEntry;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isLeft = entry.side === "left";
  const isExperience = entry.type === "experience";
  const accentColor = isExperience ? "#4F8EF7" : "#7C3AED";
  const accentBg = isExperience ? "rgba(79,142,247,0.1)" : "rgba(124,58,237,0.1)";
  const accentBorder = isExperience ? "rgba(79,142,247,0.2)" : "rgba(124,58,237,0.2)";
  const isCurrent = Boolean(entry.isCurrent);
  const isCurrentExperience = isCurrent && isExperience;

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        justifyContent: isLeft ? "flex-end" : "flex-start",
        paddingLeft: isLeft ? 0 : "calc(50% + 24px)",
        paddingRight: isLeft ? "calc(50% + 24px)" : 0,
        marginBottom: "40px",
        position: "relative",
      }}
      className="timeline-card-wrapper"
    >
      {/* Center-line node (desktop) */}
      <div
        className="timeline-node"
        style={{
          position: "absolute",
          left: "50%",
          top: "28px",
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: accentColor,
          border: "2px solid rgba(15,15,20,0.95)",
          boxShadow: `0 0 14px ${isExperience ? "rgba(79,142,247,0.55)" : "rgba(124,58,237,0.55)"}`,
          transform: "translateX(-50%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50, y: 10 }}
        animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{
          duration: 0.65,
          ease: [0.16, 1, 0.3, 1],
          delay: index * 0.1,
        }}
        style={{
          width: "100%",
          maxWidth: "440px",
          padding: "24px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: isCurrentExperience
            ? "1px solid rgba(34,197,94,0.5)"
            : "1px solid rgba(255,255,255,0.08)",
          boxShadow: isCurrentExperience
            ? "0 0 0 1px rgba(34,197,94,0.2), 0 0 48px rgba(34,197,94,0.22), 0 4px 24px rgba(0,0,0,0.2)"
            : "0 4px 24px rgba(0,0,0,0.2)",
          transition: "background 200ms ease, border-color 200ms ease, box-shadow 200ms ease",
          cursor: "default",
        }}
        whileHover={{
          background: isCurrentExperience
            ? "rgba(34,197,94,0.10)"
            : isExperience
              ? "rgba(79,142,247,0.06)"
              : "rgba(124,58,237,0.06)",
          borderColor: isCurrentExperience ? "rgba(34,197,94,0.55)" : accentBorder,
          boxShadow: isCurrentExperience
            ? "0 0 0 1px rgba(34,197,94,0.25), 0 0 52px rgba(34,197,94,0.28), 0 4px 24px rgba(0,0,0,0.2)"
            : undefined,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "12px",
                background: accentBg,
                border: `1px solid ${accentBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                flexShrink: 0,
              }}
            >
              {entry.icon}
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1.3,
                }}
              >
                {entry.org}
              </div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.5)",
                  marginTop: "2px",
                }}
              >
                {entry.role}
              </div>
            </div>
          </div>
          {/* Date badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {isCurrent ? (
              <>
                <div
                  style={{
                    padding: "4px 10px",
                    borderRadius: "100px",
                    background: accentBg,
                    border: `1px solid ${accentBorder}`,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "11px",
                    fontWeight: 500,
                    color: accentColor,
                    whiteSpace: "nowrap",
                  }}
                >
                  {isCurrentExperience ? entry.startDate : entry.dates}
                </div>
                {isCurrentExperience && (
                  <div
                    style={{
                      padding: "4px 10px",
                      borderRadius: "100px",
                      background: "rgba(34,197,94,0.12)",
                      border: "1px solid rgba(34,197,94,0.35)",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#22C55E",
                      whiteSpace: "nowrap",
                      boxShadow: "0 0 18px rgba(34,197,94,0.25)",
                    }}
                  >
                    Present
                  </div>
                )}
              </>
            ) : (
              <div
                style={{
                  padding: "4px 10px",
                  borderRadius: "100px",
                  background: accentBg,
                  border: `1px solid ${accentBorder}`,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "11px",
                  fontWeight: 500,
                  color: accentColor,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {entry.dates}
              </div>
            )}
          </div>
        </div>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px",
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.5)",
            margin: 0,
          }}
        >
          {entry.description}
        </p>
      </motion.div>
    </div>
  );
}

export function KaviTimeline() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { data } = usePortfolioData();

  const experienceEntries: TimelineEntry[] = data.experiences.map((item) => ({
    id: Number(item.id.replace(/\D/g, "")) || Date.now(),
    type: "experience",
    org: item.companyName,
    role: item.role,
    startDate: item.startDate,
    dates: item.present ? `${item.startDate} - Present` : `${item.startDate} - ${item.endDate}`,
    isCurrent: item.present,
    icon: item.logo || "💼",
    side: item.side,
    description: item.description,
  }));

  const educationEntries: TimelineEntry[] = data.education.map((item) => ({
    id: Number(item.id.replace(/\D/g, "")) || Date.now(),
    type: "education",
    org: item.institutionName,
    role: item.degree,
    startDate: item.startDate,
    dates: item.present ? `${item.startDate} - Present` : `${item.startDate} - ${item.endDate}`,
    isCurrent: item.present,
    icon: item.logo || "🎓",
    side: item.side,
    description: item.description,
  }));

  return (
    <section
      id="timeline"
      ref={ref}
      style={{ padding: "120px 24px", position: "relative" }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <SectionLabel label="Experience & Education" delay={0} inView={inView} />
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
            margin: "20px 0 60px 0",
          }}
        >
          My Journey
        </motion.h2>

        {/* Experience subsection */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
            <span style={{ fontSize: "22px" }}>💼</span>
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(22px, 3vw, 32px)",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                textAlign: "left",
              }}
            >
              Experience
            </div>
          </div>

          <div style={{ position: "relative" }}>
            {/* Center line */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                bottom: 0,
                width: 1,
                background:
                  "linear-gradient(to bottom, transparent, rgba(79,142,247,0.35) 10%, rgba(79,142,247,0.35) 90%, transparent)",
                transformOrigin: "top",
              }}
              className="timeline-line"
            />

            {experienceEntries.map((entry, i) => (
              <TimelineCard key={entry.id} entry={entry} index={i} />
            ))}
          </div>
        </div>

        {/* Thin divider between Experience and Education */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "34px 0" }} />

        {/* Education subsection */}
        <div style={{ marginTop: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
            <span style={{ fontSize: "22px" }}>🎓</span>
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(22px, 3vw, 32px)",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                textAlign: "left",
              }}
            >
              Education
            </div>
          </div>

          <div style={{ position: "relative" }}>
            {/* Center line */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.45, ease: "easeOut" }}
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                bottom: 0,
                width: 1,
                background:
                  "linear-gradient(to bottom, transparent, rgba(124,58,237,0.35) 10%, rgba(124,58,237,0.35) 90%, transparent)",
                transformOrigin: "top",
              }}
              className="timeline-line"
            />

            {educationEntries.map((entry, i) => (
              <TimelineCard key={entry.id} entry={entry} index={experienceEntries.length + i} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .timeline-line { display: none !important; }
          .timeline-node { display: none !important; }
          .timeline-card-wrapper {
            padding-left: 0 !important;
            padding-right: 0 !important;
            justify-content: center !important;
          }
          .timeline-card-wrapper > div {
            max-width: 100% !important;
          }
          #timeline {
            padding: 80px 24px !important;
          }
        }
        @media (max-width: 480px) {
          #timeline {
            padding: 64px 16px !important;
          }
          .timeline-card-wrapper > div > div {
            padding: 18px !important;
          }
        }
      `}</style>
    </section>
  );
}