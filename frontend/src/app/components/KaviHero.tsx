import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { usePortfolioData } from "../data/portfolioData";

function HeroChar({ char, delay }: { char: string; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
}

function StaggerText({ text, baseDelay = 0.3 }: { text: string; baseDelay?: number }) {
  const chars = text.split("");
  let charIdx = 0;
  return (
    <>
      {text.split("\n").map((line, li) => (
        <span key={li} style={{ display: "block" }}>
          {line.split("").map((char) => {
            const delay = baseDelay + charIdx++ * 0.025;
            return <HeroChar key={`${li}-${charIdx}`} char={char} delay={delay} />;
          })}
        </span>
      ))}
    </>
  );
}

function AuroraBlob({
  color,
  size,
  x,
  y,
  duration,
}: {
  color: string;
  size: number;
  x: string;
  y: string;
  duration: number;
}) {
  return (
    <motion.div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        filter: `blur(${size * 0.45}px)`,
        left: x,
        top: y,
        opacity: 0.18,
        pointerEvents: "none",
      }}
      animate={{
        x: [0, 30, -20, 10, 0],
        y: [0, -20, 30, -10, 0],
        scale: [1, 1.08, 0.96, 1.04, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.25, 0.5, 0.75, 1],
      }}
    />
  );
}

export function KaviHero() {
  const { data } = usePortfolioData();
  const HEADING = data.hero.heading;
  const PROFILE_IMG = data.hero.heroPhoto;
  const cta1IsAnchor = data.hero.cta1Link.startsWith("#");
  const cta1Click = () => {
    if (!cta1IsAnchor) {
      window.location.href = data.hero.cta1Link;
      return;
    }
    document.getElementById(data.hero.cta1Link.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <section
      id="intro"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        padding: "100px 24px 60px",
      }}
    >
      {/* Aurora background */}
      <div
        style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}
      >
        <AuroraBlob
          color="radial-gradient(circle, #4F8EF7, transparent)"
          size={700}
          x="-10%"
          y="-5%"
          duration={14}
        />
        <AuroraBlob
          color="radial-gradient(circle, #7C3AED, transparent)"
          size={600}
          x="60%"
          y="20%"
          duration={18}
        />
        <AuroraBlob
          color="radial-gradient(circle, #06b6d4, transparent)"
          size={400}
          x="30%"
          y="60%"
          duration={12}
        />
      </div>

      {/* Noise overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: 0.025,
          backgroundSize: "256px 256px",
        }}
      />

      {/* Grid dot overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div
        className="hero-content"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "60px",
          flexWrap: "wrap",
        }}
      >
        {/* Left: text */}
        <div className="hero-text" style={{ flex: "1 1 480px", minWidth: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "100px",
              background: "rgba(79,142,247,0.1)",
              border: "1px solid rgba(79,142,247,0.25)",
              marginBottom: "28px",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#4ade80",
                boxShadow: "0 0 6px #4ade80",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "12px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.04em",
              }}
            >
              Available for opportunities
            </span>
          </motion.div>

          <h1
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(38px, 6vw, 72px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "#fff",
              margin: "0 0 24px 0",
            }}
          >
            <StaggerText text={HEADING} baseDelay={0.25} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(15px, 1.8vw, 18px)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.65,
              maxWidth: "460px",
              margin: "0 0 40px 0",
            }}
          >
            {data.hero.subHeading}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="hero-cta-row"
            style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
          >
            <GradientButton
              onClick={cta1Click}
              filled
            >
              {data.hero.cta1Label}
            </GradientButton>
            <OutlineButton href={data.hero.cta2Link}>{data.hero.cta2Label}</OutlineButton>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="hero-stats-row"
            style={{
              display: "flex",
              gap: "32px",
              marginTop: "56px",
              paddingTop: "40px",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              flexWrap: "wrap",
            }}
          >
            {[
              { num: "5+", label: "Projects" },
              { num: "3+", label: "Years Learning" },
              { num: "10+", label: "Technologies" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "28px",
                    fontWeight: 800,
                    background: "linear-gradient(135deg,#4F8EF7,#7C3AED)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {s.num}
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.4)",
                    marginTop: "2px",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: profile photo */}
        <motion.div
          className="hero-photo-wrapper"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ flex: "0 0 auto", display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}
        >
          {/* Outer glow ring */}
          <motion.div
            className="hero-glow-ring"
            animate={{ scale: [1, 1.04, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              width: 340,
              height: 340,
              borderRadius: "50%",
              background:
                "conic-gradient(from 180deg, #4F8EF7, #7C3AED, #06b6d4, #4F8EF7)",
              filter: "blur(24px)",
              opacity: 0.45,
            }}
          />
          {/* Medium ring */}
          <div
            className="hero-mid-ring"
            style={{
              position: "absolute",
              width: 310,
              height: 310,
              borderRadius: "50%",
              border: "1px solid rgba(79,142,247,0.25)",
            }}
          />
          {/* Inner ring */}
          <div
            className="hero-inner-ring"
            style={{
              position: "absolute",
              width: 280,
              height: 280,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
          {/* Photo */}
          <div
            className="hero-photo-circle"
            style={{
              width: 256,
              height: 256,
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid rgba(79,142,247,0.4)",
              position: "relative",
              zIndex: 2,
            }}
          >
            <ImageWithFallback
              src={PROFILE_IMG}
              alt="Kavindu Sandaruwan"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                // Adjust vertical anchoring so the face sits better inside the circle.
                objectPosition: "center 20%",
              }}
            />
          </div>

          {/* Floating badge */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              bottom: -16,
              right: -8,
              padding: "10px 16px",
              borderRadius: "14px",
              background: "rgba(14,14,28,0.9)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              zIndex: 4,
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
              Cloud & DevOps
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
              Sri Lanka 🇱🇰
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        style={{
          position: "absolute",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "11px",
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 1,
            height: 40,
            background:
              "linear-gradient(to bottom, rgba(79,142,247,0.6), transparent)",
          }}
        />
      </motion.div>
    </section>
  );
}

function GradientButton({
  children,
  onClick,
  filled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  filled?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        background: filled
          ? "linear-gradient(135deg, #4F8EF7, #7C3AED)"
          : "rgba(255,255,255,0.06)",
        border: filled ? "none" : "1px solid rgba(255,255,255,0.12)",
        borderRadius: "12px",
        padding: "13px 28px",
        fontFamily: "'Inter', sans-serif",
        fontSize: "15px",
        fontWeight: 500,
        color: "#fff",
        cursor: "none",
        letterSpacing: "-0.01em",
        boxShadow: filled ? "0 0 32px rgba(79,142,247,0.25)" : "none",
        transition: "box-shadow 200ms ease",
      }}
    >
      {children}
    </motion.button>
  );
}

function OutlineButton({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) {
  return (
    <motion.a
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      href={href}
      download
      style={{
        display: "inline-block",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "12px",
        padding: "13px 28px",
        fontFamily: "'Inter', sans-serif",
        fontSize: "15px",
        fontWeight: 500,
        color: "rgba(255,255,255,0.75)",
        cursor: "none",
        textDecoration: "none",
        letterSpacing: "-0.01em",
        transition: "color 200ms, border-color 200ms",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.color = "#fff";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(79,142,247,0.4)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
      }}
    >
      {children}
    </motion.a>
  );
}

/* ─── Hero Responsive Styles ─── */
export function HeroResponsiveStyles() {
  return (
    <style>{`
      /* Tablet & below: stack photo above text, center everything */
      @media (max-width: 860px) {
        .hero-content {
          flex-direction: column-reverse !important;
          align-items: center !important;
          gap: 36px !important;
          padding-bottom: 20px;
        }
        .hero-text {
          flex: 1 1 auto !important;
          width: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          text-align: center !important;
        }
        .hero-text p {
          max-width: 100% !important;
          text-align: center;
        }
        .hero-cta-row {
          justify-content: center !important;
        }
        .hero-stats-row {
          justify-content: center !important;
        }
        /* Scale down rings */
        .hero-glow-ring {
          width: 260px !important;
          height: 260px !important;
        }
        .hero-mid-ring {
          width: 238px !important;
          height: 238px !important;
        }
        .hero-inner-ring {
          width: 214px !important;
          height: 214px !important;
        }
        .hero-photo-circle {
          width: 196px !important;
          height: 196px !important;
        }
        #intro {
          padding-top: 96px !important;
          padding-bottom: 72px !important;
        }
      }

      /* Mobile: further scale down */
      @media (max-width: 480px) {
        .hero-glow-ring {
          width: 210px !important;
          height: 210px !important;
        }
        .hero-mid-ring {
          width: 192px !important;
          height: 192px !important;
        }
        .hero-inner-ring {
          width: 172px !important;
          height: 172px !important;
        }
        .hero-photo-circle {
          width: 156px !important;
          height: 156px !important;
        }
        #intro {
          padding-top: 80px !important;
          padding-left: 16px !important;
          padding-right: 16px !important;
        }
      }
    `}</style>
  );
}