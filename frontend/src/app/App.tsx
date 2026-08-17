import "../styles/fonts.css";
import { Navigate, Route, Routes } from "react-router";
import { PortfolioDataProvider } from "./data/portfolioData";
import { AdminAuthProvider } from "./admin/AdminAuthContext";
import { AdminRouteGuard } from "./admin/AdminRouteGuard";
import { AdminLoginPage } from "./admin/AdminLoginPage";
import { AdminHeroEditorPage } from "./admin/AdminHeroEditorPage";
import { AdminProjectsPage } from "./admin/AdminProjectsPage";
import { AdminExperiencePage } from "./admin/AdminExperiencePage";
import { AdminAboutPage } from "./admin/AdminAboutPage";
import { Toaster } from "./components/ui/sonner";
import { KaviCursor } from "./components/KaviCursor";
import { KaviNavbar } from "./components/KaviNavbar";
import { KaviHero, HeroResponsiveStyles } from "./components/KaviHero";
import { KaviAbout, AboutResponsiveStyles } from "./components/KaviAbout";
import { KaviTimeline } from "./components/KaviTimeline";
import { KaviSkills } from "./components/KaviSkills";
import { KaviWorks } from "./components/KaviWorks";
import { KaviContact } from "./components/KaviContact";
import { KaviFooter } from "./components/KaviFooter";
import { BackToTop } from "./components/BackToTop";

function PortfolioPage() {
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
            rgba(255, 255, 255, 0.06) 30%,
            rgba(255, 255, 255, 0.06) 70%,
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
      <main>
        <KaviHero />

        <div style={{ padding: "0 24px" }}>
          <div className="section-divider" />
        </div>

        <KaviAbout />

        <div style={{ padding: "0 24px" }}>
          <div className="section-divider" />
        </div>

        <KaviTimeline />

        <div style={{ padding: "0 24px" }}>
          <div className="section-divider" />
        </div>

        <KaviSkills />

        <div style={{ padding: "0 24px" }}>
          <div className="section-divider" />
        </div>

        <KaviWorks />

        <div style={{ padding: "0 24px" }}>
          <div className="section-divider" />
        </div>

        <KaviContact />
      </main>

      <KaviFooter />
      <BackToTop />
    </>
  );
}

export default function App() {
  return (
    <PortfolioDataProvider>
      <AdminAuthProvider>
        <Toaster />
        <Routes>
          <Route path="/" element={<PortfolioPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <AdminRouteGuard>
                <AdminHeroEditorPage />
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <AdminRouteGuard>
                <AdminProjectsPage />
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin/experience"
            element={
              <AdminRouteGuard>
                <AdminExperiencePage />
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin/about"
            element={
              <AdminRouteGuard>
                <AdminAboutPage />
              </AdminRouteGuard>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminAuthProvider>
    </PortfolioDataProvider>
  );
}