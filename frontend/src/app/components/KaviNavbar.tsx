import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { label: "Work", id: "works" },
  { label: "About", id: "about" },
  { label: "Journey", id: "timeline" },
  { label: "Skills", id: "skills" },
  { label: "Contact", id: "contact" },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function KaviNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<string>("works");
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
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
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 32px",
          gap: "12px",
          background: "rgba(19,33,77,0.78)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(79,142,247,0.15)",
          boxShadow: scrolled ? "0 8px 24px rgba(0,0,0,0.35)" : "none",
          opacity: scrolled ? 1 : 0,
          transform: scrolled ? "translateY(0)" : "translateY(-16px)",
          pointerEvents: scrolled ? "auto" : "none",
          transition: "opacity 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease",
        }}
      >
        {/* Left: mark + name */}
        <motion.button
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            pointerEvents: "all",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            border: "none",
            cursor: "none",
            background: "none",
            padding: "10px 4px",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "15px",
            fontWeight: 700,
            color: "#fff",
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              background: "linear-gradient(135deg, #4F8EF7, #7C3AED)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ✦ Kavi.
          </span>
        </motion.button>

        {/* Center: scrollspy pill nav */}
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="nav-pill-group"
          style={{
            pointerEvents: "all",
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            margin: "auto 0",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "2px",
            height: "fit-content",
          }}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.id}
              label={link.label}
              active={active === link.id}
              onClick={() => scrollTo(link.id)}
            />
          ))}
        </motion.nav>

        {/* Right: theme toggle + Say Hi */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="nav-right"
          style={{ pointerEvents: "all", display: "flex", alignItems: "center", gap: "10px" }}
        >
          <div className="nav-right-desktop" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ThemeToggle />
            <div
              style={{
                padding: "1px",
                borderRadius: "100px",
                background: "linear-gradient(135deg, #4F8EF7, #7C3AED)",
              }}
            >
              <button
                onClick={() => scrollTo("contact")}
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
                Say Hi 👋
              </button>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="nav-mobile-btn"
            onClick={() => setMobileOpen(true)}
            style={{
              display: "none",
              background: "rgba(79,142,247,0.12)",
              border: "1px solid rgba(79,142,247,0.25)",
              borderRadius: "100px",
              cursor: "none",
              padding: "10px 12px",
              color: "rgba(255,255,255,0.7)",
              fontSize: "16px",
              lineHeight: 1,
            }}
          >
            ☰
          </button>
        </motion.div>
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
              gap: "28px",
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
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                onClick={() => {
                  scrollTo(link.id);
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
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "12px" }}>
              <ThemeToggle />
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                onClick={() => {
                  scrollTo("contact");
                  setMobileOpen(false);
                }}
                style={{
                  background: "linear-gradient(135deg, #4F8EF7, #7C3AED)",
                  border: "none",
                  borderRadius: "100px",
                  padding: "12px 24px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#fff",
                  cursor: "none",
                }}
              >
                Say Hi 👋
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 1100px) {
          .nav-pill-group { display: none !important; }
          .nav-right-desktop { display: none !important; }
          .nav-mobile-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}

function NavLink({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        background: active ? "rgba(79,142,247,0.18)" : hov ? "rgba(255,255,255,0.06)" : "none",
        border: active ? "1px solid rgba(79,142,247,0.4)" : "1px solid transparent",
        cursor: "none",
        padding: "7px 18px",
        borderRadius: "100px",
        fontFamily: "'Inter', sans-serif",
        fontSize: "13px",
        fontWeight: active ? 600 : 400,
        color: active ? "#fff" : hov ? "#fff" : "rgba(255,255,255,0.6)",
        transition: "color 150ms ease, background 150ms ease, border-color 150ms ease",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}
