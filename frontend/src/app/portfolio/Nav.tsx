import { useEffect, useRef, useState } from "react";

const links = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
];

const NAME = "Yunos Nabavi";

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastY.current && y > 80);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "52px",
          zIndex: 100,
          borderBottom: "1px solid #1F1F1F",
          background: "rgba(12,12,12,0.94)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          opacity: hidden ? 0 : 1,
          pointerEvents: hidden ? "none" : "all",
          transition: "opacity 200ms ease",
        }}
      >
        <div
          style={{
            maxWidth: "680px",
            margin: "0 auto",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 var(--page-px)",
          }}
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              font: "500 14px/1 'Geist', system-ui, sans-serif",
              color: "#F2F2F2",
              cursor: "pointer",
              letterSpacing: "-0.01em",
            }}
          >
            {NAME}
          </button>

          {/* Desktop links */}
          <div className="desktop-nav" style={{ display: "flex", gap: "28px", alignItems: "center" }}>
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => handleNavClick(l.href)}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  font: "400 13px/1 'Geist', system-ui, sans-serif",
                  color: "#888",
                  cursor: "pointer",
                  transition: "color 150ms ease",
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#F2F2F2")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#888")}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Mobile menu trigger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(true)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              padding: 0,
              font: "400 13px/1 'Geist', system-ui, sans-serif",
              color: "#888",
              cursor: "pointer",
              transition: "color 150ms ease",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#F2F2F2")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#888")}
          >
            Menu
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "#0C0C0C",
            display: "flex",
            flexDirection: "column",
            padding: "0 var(--page-px)",
            animation: "fade-in 150ms ease",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setMenuOpen(false); }}
        >
          {/* Header row */}
          <div style={{ height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ font: "500 14px/1 'Geist', system-ui, sans-serif", color: "#F2F2F2" }}>{NAME}</span>
            <button
              onClick={() => setMenuOpen(false)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                font: "400 13px/1 'Geist', system-ui, sans-serif",
                color: "#888",
                cursor: "pointer",
                transition: "color 150ms ease",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#F2F2F2")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#888")}
            >
              Close
            </button>
          </div>

          {/* Links */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "40px" }}>
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => handleNavClick(l.href)}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  textAlign: "left",
                  font: "500 18px/1 'Geist', system-ui, sans-serif",
                  color: "#F2F2F2",
                  cursor: "pointer",
                  transition: "color 150ms ease",
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#888")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#F2F2F2")}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        :root {
          --page-px: 64px;
        }
        @media (max-width: 1279px) { :root { --page-px: 48px; } }
        @media (max-width: 767px) { :root { --page-px: 32px; } }
        @media (max-width: 389px) { :root { --page-px: 20px; } }
        @media (max-width: 319px) { :root { --page-px: 16px; } }
      `}</style>
    </>
  );
}
