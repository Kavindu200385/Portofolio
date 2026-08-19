import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation, useNavigate } from "react-router";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { label: "About", id: "about" },
  { label: "Journey", id: "timeline" },
  { label: "Skills", id: "skills" },
  { label: "Work", id: "works" },
  { label: "Contact", id: "contact" },
];

export function KaviNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<string>("about");

  // Section ids only exist on "/" — from any other page, navigate home first (via hash),
  // then Layout's hash-scroll effect scrolls to the right section once it's mounted.
  const goToSection = (id: string) => {
    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${id}`);
    }
  };

  const goHome = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

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
      {/* Header: one flat, unified surface — everything (logo, nav, actions) lives directly
          inside it, no nested element gets its own background/border/blur. */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "16px 32px",
          background: "rgba(19,33,77,0.35)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          color: "#fff",
          opacity: scrolled ? 1 : 0,
          transform: scrolled ? "translateY(0)" : "translateY(-16px)",
          pointerEvents: scrolled ? "auto" : "none",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        {/* Left: logo */}
        <button
          onClick={goHome}
          style={{
            justifySelf: "start",
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
            KaviCode
          </span>
        </button>

        {/* Middle: page links */}
        <nav className="nav-links" style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {navLinks.map((link) => (
            <NavLink
              key={link.id}
              label={link.label}
              active={active === link.id}
              onClick={() => goToSection(link.id)}
            />
          ))}
        </nav>

        {/* Right: theme toggle + Say Hi */}
        <div style={{ justifySelf: "end", display: "flex", alignItems: "center", gap: "10px" }}>
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
                onClick={() => goToSection("contact")}
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
        </div>
      </header>

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
              background: "var(--background)",
              color: "var(--foreground)",
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
                color: "rgba(var(--fg-rgb),0.5)",
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
                  goToSection(link.id);
                  setMobileOpen(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "none",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "var(--foreground)",
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
                  goToSection("contact");
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
          .nav-links { display: none !important; }
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
