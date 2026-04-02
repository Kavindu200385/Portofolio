import { motion } from "motion/react";
import type { CSSProperties } from "react";

const socials = [
  { label: "GitHub", href: "https://github.com/Kavindu200385" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/kavindu-sandaruwan-54354128a/" },
  { label: "X / Twitter", href: "https://x.com" },
];

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function KaviFooter() {
  return (
    <footer
      style={{
        padding: "0 24px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Fade divider */}
      <div
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(79,142,247,0.3) 30%, rgba(124,58,237,0.3) 70%, transparent)",
          marginBottom: "0",
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "28px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
        className="footer-inner"
      >
        {/* Left: copyright */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          <button
            onClick={scrollToTop}
            style={{
              border: "none",
              padding: 0,
              cursor: "none",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "15px",
              fontWeight: 700,
              background: "linear-gradient(135deg, #4F8EF7, #7C3AED)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            } as CSSProperties}
          >
            KaviCode
          </button>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            © 2025 Kavindu Sandaruwan. All rights reserved.
          </span>
        </div>

        {/* Right: socials */}
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          {socials.map((s) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                fontWeight: 400,
                color: "rgba(255,255,255,0.35)",
                textDecoration: "none",
                transition: "color 150ms ease",
                cursor: "none",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.8)")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.35)")
              }
            >
              {s.label}
            </motion.a>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .footer-inner {
            justify-content: center !important;
            text-align: center !important;
          }
        }
      `}</style>
    </footer>
  );
}