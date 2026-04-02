import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

const links = ["Work", "Stack", "Experience", "Contact"];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setVisible(y < lastY || y < 80);
      setLastY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-4 left-1/2 z-50 w-[92%] max-w-5xl"
        style={{ transform: "translateX(-50%)" }}
      >
        <div
          className="flex items-center justify-between px-6 py-3 rounded-2xl"
          style={{
            background: scrolled
              ? "rgba(8,8,16,0.85)"
              : "rgba(8,8,16,0.6)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.4)" : "none",
          }}
        >
          {/* Logo */}
          <a
            href="#"
            className="text-[#00F0FF] hover:opacity-80 transition-opacity cursor-pointer"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem" }}
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            data-cursor-hover
          >
            [&nbsp;YN&nbsp;]
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                className="transition-colors cursor-pointer"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.8rem",
                  color: "#7A7A8C",
                  letterSpacing: "0.05em",
                  background: "none",
                  border: "none",
                  padding: 0,
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#EDEAE4")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#7A7A8C")}
                data-cursor-hover
              >
                {link}
              </button>
            ))}
          </div>

          {/* Availability + Mobile */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: "#A3FF47",
                  boxShadow: "0 0 6px #A3FF47, 0 0 12px rgba(163,255,71,0.5)",
                  animation: "pulse-green 2s infinite",
                }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.7rem",
                  color: "#A3FF47",
                  letterSpacing: "0.04em",
                }}
              >
                Available for work
              </span>
            </div>
            <button
              className="md:hidden p-1 cursor-pointer"
              style={{ color: "#EDEAE4", background: "none", border: "none" }}
              onClick={() => setMobileOpen(!mobileOpen)}
              data-cursor-hover
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center"
            style={{ background: "rgba(8,8,16,0.97)", backdropFilter: "blur(20px)" }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="flex flex-col items-center gap-8"
            >
              {links.map((link, i) => (
                <motion.button
                  key={link}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => scrollTo(link)}
                  className="cursor-pointer"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "2.5rem",
                    fontWeight: 700,
                    color: "#EDEAE4",
                    background: "none",
                    border: "none",
                  }}
                  data-cursor-hover
                >
                  {link}
                </motion.button>
              ))}
              <div className="flex items-center gap-2 mt-4">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "#A3FF47", boxShadow: "0 0 6px #A3FF47" }}
                />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", color: "#A3FF47" }}>
                  Available for work
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulse-green {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px #A3FF47, 0 0 12px rgba(163,255,71,0.5); }
          50% { opacity: 0.6; box-shadow: 0 0 2px #A3FF47; }
        }
      `}</style>
    </>
  );
}
