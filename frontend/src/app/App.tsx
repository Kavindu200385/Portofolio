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
import { Layout } from "./components/Layout";
import { KaviHero } from "./components/KaviHero";
import { KaviAbout } from "./components/KaviAbout";
import { KaviFeaturedWork } from "./components/KaviFeaturedWork";
import { KaviTimeline } from "./components/KaviTimeline";
import { KaviSkills } from "./components/KaviSkills";
import { KaviWorks } from "./components/KaviWorks";
import { KaviContact } from "./components/KaviContact";
import ProjectsPage from "./ProjectsPage";

function PortfolioPage() {
  return (
    <Layout>
      <KaviHero />

      <div style={{ padding: "0 24px" }}>
        <div className="section-divider" />
      </div>

      <KaviAbout />

      <div style={{ padding: "0 24px" }}>
        <div className="section-divider" />
      </div>

      <KaviFeaturedWork />

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
    </Layout>
  );
}

export default function App() {
  return (
    <PortfolioDataProvider>
      <AdminAuthProvider>
        <Toaster />
        <Routes>
          <Route path="/" element={<PortfolioPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
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
