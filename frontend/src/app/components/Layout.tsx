"use client";

import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router";
import { KaviCursor } from "./KaviCursor";
import { KaviNavbar } from "./KaviNavbar";
import { KaviFooter } from "./KaviFooter";
import { BackToTop } from "./BackToTop";
import { HeroResponsiveStyles } from "./KaviHero";
import { AboutResponsiveStyles } from "./KaviAbout";

/** Shared page chrome: global resets, cursor, navbar, footer, back-to-top. */
export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();

  // Nav links elsewhere navigate to "/#<id>" — once we're on "/", scroll to that section.
  useEffect(() => {
    if (location.pathname !== "/" || !location.hash) return;
    const id = location.hash.slice(1);
    const raf = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    });
    return () => cancelAnimationFrame(raf);
  }, [location.pathname, location.hash]);

  return (
    <>
      <style>{`
        /* ─── Reset ─── */
        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          scroll-behavior: smooth;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          overflow-x: hidden;
        }

        body {
          font-family: 'Inter', system-ui, sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
          cursor: none;
          background: var(--background);
          color: var(--foreground);
          transition: background 200ms ease, color 200ms ease;
        }

        /* ─── Selection ─── */
        ::selection {
          background: rgba(79, 142, 247, 0.3);
          color: #fff;
        }

        /* ─── Focus ─── */
        button:focus-visible,
        a:focus-visible {
          outline: 2px solid rgba(79, 142, 247, 0.6);
          outline-offset: 3px;
        }

        /* ─── Scrollbar ─── */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--background); }
        ::-webkit-scrollbar-thumb {
          background: rgba(79, 142, 247, 0.3);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(79, 142, 247, 0.5);
        }

        /* ─── Section divider ─── */
        .section-divider {
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(var(--fg-rgb), 0.06) 30%,
            rgba(var(--fg-rgb), 0.06) 70%,
            transparent
          );
          max-width: 1200px;
          margin: 0 auto;
        }

        /* ─── Global Responsive Overrides ─── */

        /* Navbar: fix pill shrinking on very small screens */
        @media (max-width: 380px) {
          nav {
            padding: 8px 12px !important;
          }
        }

        /* Footer: tighter padding on mobile */
        @media (max-width: 480px) {
          footer {
            padding: 0 16px !important;
          }
        }

        /* Prevent horizontal overflow globally */
        section, main, footer, nav {
          max-width: 100vw;
        }

        /* Touch devices: restore default cursor */
        @media (pointer: coarse) {
          * { cursor: auto !important; }
          a, button { cursor: pointer !important; }
        }
      `}</style>

      {/* Responsive style injection */}
      <HeroResponsiveStyles />
      <AboutResponsiveStyles />

      {/* Custom cursor — desktop only */}
      <KaviCursor />

      {/* Navigation */}
      <KaviNavbar />

      {/* Main content */}
      <main>{children}</main>

      <KaviFooter />
      <BackToTop />
    </>
  );
}
