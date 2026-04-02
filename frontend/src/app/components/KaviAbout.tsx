import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { usePortfolioData } from "../data/portfolioData";

export function KaviAbout() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { data } = usePortfolioData();
  const PROFILE_IMG = data.about.profilePhoto;
  const bioLines = data.about.paragraphs;
  const tags = data.about.badges;

  return (
    <section
      id="about"
      ref={ref}
      style={{
        padding: "120px 24px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Section label */}
      <SectionLabel label="About Me" delay={0} inView={inView} />

      <div
        className="about-content"
        style={{
          display: "flex",
          gap: "80px",
          alignItems: "flex-start",
          flexWrap: "wrap",
          marginTop: "56px",
        }}
      >
        {/* Left: layered image */}
        <motion.div
          className="about-image-col"
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{ flex: "0 0 auto", position: "relative", width: 320 }}
        >
          {/* Geometric frames */}
          <div
            style={{
              position: "absolute",
              top: -16,
              left: -16,
              width: "100%",
              height: "100%",
              border: "2px solid rgba(79,142,247,0.2)",
              borderRadius: "20px",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: -8,
              left: -8,
              width: "100%",
              height: "100%",
              border: "1px solid rgba(124,58,237,0.15)",
              borderRadius: "18px",
            }}
          />
          <div
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              position: "relative",
              zIndex: 2,
            }}
          >
            <ImageWithFallback
              src={PROFILE_IMG}
              alt="Kavindu Sandaruwan"
              style={{
                width: "100%",
                aspectRatio: "4/5",
                objectFit: "cover",
                objectPosition: "center 20%",
                display: "block",
              }}
            />
            {/* Gradient overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(8,8,16,0.6) 0%, transparent 50%)",
              }}
            />
          </div>

          {/* Floating experience card */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              bottom: -20,
              right: -20,
              zIndex: 4,
              padding: "12px 20px",
              borderRadius: "14px",
              background: "rgba(14,14,28,0.95)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              BSc Computer Science
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.45)",
                marginTop: "3px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              University of Plymouth · NSBM
            </div>
          </motion.div>
        </motion.div>

        {/* Right: bio + tags */}
        <div className="about-bio-col" style={{ flex: "1 1 380px", minWidth: 0 }}>
          <div style={{ marginBottom: "32px" }}>
            {bioLines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.3 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "16px",
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: "16px",
                }}
              >
                {line}
              </motion.p>
            ))}
          </div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7, duration: 0.5 }}
            style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "40px" }}
          >
            {tags.map((tag, i) => (
              <motion.span
                key={tag.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.75 + i * 0.07, duration: 0.4 }}
                whileHover={{ scale: 1.06, y: -2 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: "100px",
                  background: "rgba(79,142,247,0.08)",
                  border: "1px solid rgba(79,142,247,0.2)",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.7)",
                  cursor: "default",
                }}
              >
                <span>{tag.icon}</span>
                {tag.label}
              </motion.span>
            ))}
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.0, duration: 0.5 }}
            style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2, boxShadow: "0 8px 32px rgba(79,142,247,0.3)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                background: "linear-gradient(135deg, #4F8EF7, #7C3AED)",
                border: "none",
                borderRadius: "12px",
                padding: "12px 26px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: "#fff",
                cursor: "none",
              }}
            >
              Hire Me
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              href="/cv.pdf"
              download
              style={{
                display: "inline-block",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "12px",
                padding: "12px 26px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.7)",
                cursor: "none",
                textDecoration: "none",
              }}
            >
              Download CV
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function SectionLabel({
  label,
  delay,
  inView,
}: {
  label: string;
  delay: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      style={{ display: "flex", alignItems: "center", gap: "12px" }}
    >
      <div
        style={{
          width: 28,
          height: 2,
          background: "linear-gradient(90deg, #4F8EF7, #7C3AED)",
          borderRadius: "2px",
        }}
      />
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          background: "linear-gradient(135deg, #4F8EF7, #7C3AED)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

/* ─── About Responsive Styles ─── */
export function AboutResponsiveStyles() {
  return (
    <style>{`
      @media (max-width: 860px) {
        .about-content {
          flex-direction: column !important;
          align-items: center !important;
          gap: 40px !important;
        }
        .about-image-col {
          width: 260px !important;
          padding-bottom: 32px !important;
        }
        .about-bio-col {
          flex: 1 1 auto !important;
          width: 100% !important;
        }
        #about {
          padding: 80px 24px !important;
        }
      }
      @media (max-width: 480px) {
        .about-image-col {
          width: 220px !important;
        }
        #about {
          padding: 64px 16px !important;
        }
      }
    `}</style>
  );
}