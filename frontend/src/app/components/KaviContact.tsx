"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { SectionLabel } from "./KaviAbout";
import { usePortfolioData } from "../data/portfolioData";

function OrbBlob({
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
        filter: `blur(${size * 0.5}px)`,
        left: x,
        top: y,
        opacity: 0.12,
        pointerEvents: "none",
      }}
      animate={{ x: [0, 20, -15, 8, 0], y: [0, -18, 25, -8, 0], scale: [1, 1.06, 0.97, 1.03, 1] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] }}
    />
  );
}

interface SocialBtnProps {
  label: string;
  icon: string;
  href: string;
  color: string;
}

function SocialBtn({ label, icon, href, color }: SocialBtnProps) {
  const [hov, setHov] = useState(false);
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      whileHover={{ scale: 1.08, y: -3 }}
      whileTap={{ scale: 0.95 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        padding: "20px 24px",
        borderRadius: "18px",
        background: hov ? `${color}14` : "rgba(255,255,255,0.04)",
        border: `1px solid ${hov ? `${color}40` : "rgba(255,255,255,0.08)"}`,
        backdropFilter: "blur(20px)",
        textDecoration: "none",
        cursor: "none",
        transition: "background 200ms ease, border-color 200ms ease",
        boxShadow: hov ? `0 8px 32px ${color}20` : "none",
        minWidth: "100px",
      }}
    >
      <span style={{ fontSize: "24px", lineHeight: 1 }}>{icon}</span>
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "12px",
          fontWeight: 500,
          color: hov ? "#fff" : "rgba(255,255,255,0.5)",
          transition: "color 200ms ease",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </span>
    </motion.a>
  );
}

export function KaviContact() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [emailCopied, setEmailCopied] = useState(false);
  const { data, loading } = usePortfolioData();
  const EMAIL = data.contact.email;
  const PHONE = data.contact.phone;

  if (loading) {
    return (
      <section id="contact" style={{ padding: "120px 24px", position: "relative", color: "rgba(255,255,255,0.35)" }}>
        Loading contact…
      </section>
    );
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = EMAIL;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  return (
    <section
      id="contact"
      ref={ref}
      style={{
        padding: "120px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background orbs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <OrbBlob
          color="radial-gradient(circle, #4F8EF7, transparent)"
          size={600}
          x="10%"
          y="20%"
          duration={16}
        />
        <OrbBlob
          color="radial-gradient(circle, #7C3AED, transparent)"
          size={500}
          x="60%"
          y="30%"
          duration={20}
        />
      </div>

      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}
        >
          <SectionLabel label="Contact" delay={0} inView={inView} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(36px, 6vw, 72px)",
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            margin: "0 0 24px 0",
          }}
        >
          {data.contact.heading}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.28, duration: 0.6 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(15px, 1.8vw, 17px)",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.5)",
            maxWidth: "520px",
            margin: "0 auto 52px",
          }}
        >
          {data.contact.description}
        </motion.p>

        {/* Email link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.38, duration: 0.6 }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          <a
            href={`mailto:${EMAIL}`}
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(18px, 3vw, 28px)",
              fontWeight: 700,
              background: "linear-gradient(135deg, #4F8EF7, #7C3AED)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textDecoration: "none",
              letterSpacing: "-0.02em",
              cursor: "none",
              transition: "opacity 150ms ease",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "0.75")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "1")}
          >
            {EMAIL}
          </a>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={copyEmail}
            title={emailCopied ? "Copied!" : "Copy email"}
            style={{
              background: emailCopied
                ? "rgba(16,185,129,0.15)"
                : "rgba(255,255,255,0.06)",
              border: `1px solid ${emailCopied ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.1)"}`,
              borderRadius: "10px",
              padding: "8px 14px",
              cursor: "none",
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              color: emailCopied ? "#10b981" : "rgba(255,255,255,0.6)",
              transition: "all 200ms ease",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {emailCopied ? (
              <>
                <span>✓</span>
                Copied
              </>
            ) : (
              <>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
                Copy
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Phone */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.45, duration: 0.5 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px",
            color: "rgba(255,255,255,0.3)",
            marginBottom: "56px",
            letterSpacing: "0.06em",
          }}
        >
          {PHONE}
        </motion.p>

        {/* Social icon buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.52, duration: 0.6 }}
          className="contact-socials"
          style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}
        >
          <SocialBtn
            label="Email"
            icon="✉️"
            href={`mailto:${EMAIL}`}
            color="#4F8EF7"
          />
          <SocialBtn
            label="WhatsApp"
            icon="💬"
            href={data.contact.whatsapp}
            color="#25d366"
          />
          <SocialBtn
            label="LinkedIn"
            icon="🔗"
            href={data.contact.linkedin}
            color="#0077b5"
          />
          <SocialBtn
            label="GitHub"
            icon="🐙"
            href={data.contact.github}
            color="#7C3AED"
          />
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #contact {
            padding: 80px 24px !important;
          }
        }
        @media (max-width: 480px) {
          #contact {
            padding: 64px 16px !important;
          }
          .contact-socials {
            gap: 10px !important;
          }
          .contact-socials a {
            min-width: 76px !important;
            padding: 14px 12px !important;
          }
        }
      `}</style>
    </section>
  );
}