import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  { label: "Intro", href: "#intro" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Works", href: "#works" },
  { label: "Contact", href: "#contact" },
];

function scrollTo(href: string) {
  const id = href.replace("#", "");
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function KaviNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          padding: "18px 20px 0",
          pointerEvents: "none",
        }}
      >
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            pointerEvents: "all",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            borderRadius: "100px",
            background: scrolled
              ? "rgba(8,8,16,0.9)"
              : "rgba(14,14,28,0.7)",
            backdropFilter: `blur(${scrolled ? 28 : 16}px)`,
            WebkitBackdropFilter: `blur(${scrolled ? 28 : 16}px)`,
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: scrolled
              ? "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(79,142,247,0.06)"
              : "0 4px 16px rgba(0,0,0,0.2)",
            transition: "background 300ms ease, backdrop-filter 300ms ease, box-shadow 300ms ease",
          }}
        >
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              border: "none",
              cursor: "none",
              padding: "6px 10px",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "15px",
              fontWeight: 700,
              background: "linear-gradient(135deg, #4F8EF7, #7C3AED)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginRight: "8px",
              whiteSpace: "nowrap",
            } as React.CSSProperties}
          >
            KaviCode
          </button>

          {/* Desktop links */}
          <div
            className="nav-desktop-links"
            style={{ display: "flex", alignItems: "center", gap: "2px" }}
          >
            {navLinks.map((link) => (
              <NavLink key={link.label} label={link.label} href={link.href} />
            ))}
          </div>

          {/* Hire Me CTA */}
          <div
            className="nav-cta"
            style={{
              marginLeft: "8px",
              padding: "1px",
              borderRadius: "100px",
              background: "linear-gradient(135deg, #4F8EF7, #7C3AED)",
            }}
          >
            <button
              onClick={() => scrollTo("#contact")}
              style={{
                background: "#080810",
                border: "none",
                cursor: "none",
                padding: "7px 18px",
                borderRadius: "100px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                color: "#fff",
                whiteSpace: "nowrap",
                transition: "background 200ms ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "linear-gradient(135deg, rgba(79,142,247,0.2), rgba(124,58,237,0.2))")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#080810")
              }
            >
              Hire Me
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="nav-mobile-btn"
            onClick={() => setMobileOpen(true)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "none",
              padding: "6px",
              color: "rgba(255,255,255,0.7)",
              fontSize: "18px",
              lineHeight: 1,
            }}
          >
            ☰
          </button>
        </motion.nav>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 2000,
              background: "rgba(8,8,16,0.97)",
              backdropFilter: "blur(24px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "32px",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setMobileOpen(false);
            }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                position: "absolute",
                top: "24px",
                right: "24px",
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.5)",
                fontSize: "24px",
                cursor: "none",
              }}
            >
              ✕
            </button>
            {navLinks.map((link, i) => (
              <motion.button
                key={link.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                onClick={() => {
                  scrollTo(link.href);
                  setMobileOpen(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "none",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 640px) {
          .nav-desktop-links { display: none !important; }
          .nav-cta { display: none !important; }
          .nav-mobile-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}

function NavLink({ label, href }: { label: string; href: string }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => scrollTo(href)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "rgba(255,255,255,0.06)" : "none",
        border: "none",
        cursor: "none",
        padding: "7px 14px",
        borderRadius: "100px",
        fontFamily: "'Inter', sans-serif",
        fontSize: "13px",
        fontWeight: 400,
        color: hov ? "#fff" : "rgba(255,255,255,0.6)",
        transition: "color 150ms ease, background 150ms ease",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}
