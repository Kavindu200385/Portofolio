"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePortfolioData } from "../data/portfolioData";

function HeroChar({ char, delay }: { char: string; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
    >
      {char === " " ? " " : char}
    </motion.span>
  );
}

function StaggerText({ text, baseDelay = 0.3 }: { text: string; baseDelay?: number }) {
  let charIdx = 0;
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, li) => (
        <span
          key={li}
          style={{
            display: "block",
            color: li === 0 ? "#fff" : "rgba(255,255,255,0.62)",
          }}
        >
          {line.split(" ").map((word, wi, words) => (
            <span key={wi}>
              <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                {word.split("").map((char) => {
                  const delay = baseDelay + charIdx++ * 0.025;
                  return <HeroChar key={`${li}-${charIdx}`} char={char} delay={delay} />;
                })}
              </span>
              {wi < words.length - 1 ? " " : ""}
            </span>
          ))}
        </span>
      ))}
    </>
  );
}

export function KaviHero() {
  const { data, loading } = usePortfolioData();
  const HEADING = data.hero.heading;
  const HERO_VIDEO = data.hero.heroVideo;
  const prefersReducedMotion = useReducedMotion();
  const cta1Link = data.hero.cta1Link || "";
  const cta2Link = data.hero.cta2Link || "";
  const cta1IsAnchor = cta1Link.startsWith("#");
  const cta2IsAnchor = cta2Link.startsWith("#");
  const cta1Click = () => {
    if (!cta1IsAnchor) {
      if (cta1Link) window.location.href = cta1Link;
      return;
    }
    document.getElementById(cta1Link.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
  };
  const cta2Click = () => {
    if (!cta2IsAnchor) {
      if (cta2Link) window.location.href = cta2Link;
      return;
    }
    document.getElementById(cta2Link.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
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
        padding: "110px 24px 0",
        background: "#0a1120",
        opacity: loading ? 0.94 : 1,
        transition: "opacity 0.35s ease",
      }}
    >
      {/* Full-bleed hero photo/video background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        {HERO_VIDEO && !prefersReducedMotion ? (
          <video
            src={HERO_VIDEO}
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 25%",
            }}
          />
        ) : null}
      </div>

      {/* Dark overlay for text legibility, strongest over the text on the left */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "linear-gradient(100deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.15) 75%)",
        }}
      />

      {/* Content */}
      <div
        className="hero-content"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div className="hero-text" style={{ maxWidth: "620px" }}>
          <h1
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(38px, 6vw, 68px)",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              margin: "0 0 24px 0",
            }}
          >
            <StaggerText text={HEADING} baseDelay={0.25} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(15px, 1.8vw, 18px)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.65,
              maxWidth: "440px",
              margin: "0 0 40px 0",
            }}
          >
            {data.hero.subHeading}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="hero-cta-row"
            style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
          >
            <SolidButton onClick={cta1Click}>
              {data.hero.cta1Label}
              <span style={{ marginLeft: "8px" }}>↓</span>
            </SolidButton>
            <OutlineButton onClick={cta2Click}>{data.hero.cta2Label}</OutlineButton>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        style={{
          position: "absolute",
          bottom: "28px",
          left: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "11px",
            color: "rgba(255,255,255,0.6)",
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
            height: 36,
            background: "linear-gradient(to bottom, rgba(255,255,255,0.7), transparent)",
          }}
        />
      </motion.div>
    </section>
  );
}

function SolidButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        background: "#fff",
        border: "none",
        borderRadius: "100px",
        padding: "13px 28px",
        fontFamily: "'Inter', sans-serif",
        fontSize: "15px",
        fontWeight: 600,
        color: "#1d4fd8",
        cursor: "none",
        letterSpacing: "-0.01em",
        boxShadow: "0 8px 24px rgba(10,30,90,0.25)",
      }}
    >
      {children}
    </motion.button>
  );
}

function OutlineButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        display: "inline-block",
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.5)",
        borderRadius: "100px",
        padding: "13px 28px",
        fontFamily: "'Inter', sans-serif",
        fontSize: "15px",
        fontWeight: 500,
        color: "#fff",
        cursor: "none",
        letterSpacing: "-0.01em",
        transition: "background 200ms, border-color 200ms",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.18)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.8)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.5)";
      }}
    >
      {children}
    </motion.button>
  );
}

/* ─── Hero Responsive Styles ─── */
export function HeroResponsiveStyles() {
  return (
    <style>{`
      /* Tablet & below: keep text on top of the full-bleed video */
      @media (max-width: 860px) {
        .hero-text {
          max-width: 100% !important;
        }
        #intro {
          padding-top: 96px !important;
          padding-bottom: 40px !important;
          align-items: flex-start !important;
        }
        #intro .hero-content {
          padding-top: 40px;
        }
      }

      @media (max-width: 480px) {
        #intro {
          padding-top: 84px !important;
          padding-left: 16px !important;
          padding-right: 16px !important;
        }
      }
    `}</style>
  );
}
