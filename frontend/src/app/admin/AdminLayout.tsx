import { useState, type ReactNode } from "react";
import { NavLink } from "react-router";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { useAdminAuth } from "./AdminAuthContext";
import { apiUrl } from "../lib/apiBase";

const ADMIN_NAV = [
  { label: "Hero", to: "/admin" },
  { label: "Projects", to: "/admin/projects" },
  { label: "Experience", to: "/admin/experience" },
  { label: "Education", to: "/admin/education" },
  { label: "About", to: "/admin/about" },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { email, logout } = useAdminAuth();
  const [seeding, setSeeding] = useState(false);

  const onSeedDefaults = async () => {
    setSeeding(true);
    try {
      const res = await fetch(apiUrl("/api/admin-seed-defaults"), {
        method: "POST",
        credentials: "include",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Sync failed");
      const s = json.summary || {};
      const inserted = [
        s.projectsInserted ? `${s.projectsInserted} project(s)` : null,
        s.skillsInserted ? `${s.skillsInserted} skill(s)` : null,
        s.experiencesInserted ? `${s.experiencesInserted} experience(s)` : null,
        s.educationInserted ? `${s.educationInserted} education(s)` : null,
        s.aboutSeeded ? "About" : null,
        s.heroSeeded ? "Hero" : null,
        s.contactSeeded ? "Contact" : null,
      ].filter(Boolean);
      toast.success(inserted.length ? `Synced: ${inserted.join(", ")}` : "Already up to date — nothing empty to sync");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", color: "var(--foreground)" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          padding: "16px 24px",
          borderBottom: "1px solid var(--border)",
          background: "var(--background)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "16px", fontWeight: 800 }}>
            ✦ Kavi Admin
          </span>
          <nav style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {ADMIN_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                style={({ isActive }) => ({
                  padding: "7px 14px",
                  borderRadius: "8px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "13px",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "var(--foreground)" : "rgba(128,128,128,0.8)",
                  background: isActive ? "rgba(79,142,247,0.14)" : "transparent",
                  textDecoration: "none",
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Button variant="outline" size="sm" onClick={() => void onSeedDefaults()} disabled={seeding}>
            {seeding ? "Syncing…" : "Sync defaults to database"}
          </Button>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "rgba(128,128,128,0.8)" }}>
            {email}
          </span>
          <Button variant="outline" size="sm" onClick={() => void logout()}>
            Log out
          </Button>
        </div>
      </div>

      <div style={{ padding: "32px 24px 80px" }}>
        <div style={{ maxWidth: "880px", margin: "0 auto" }}>{children}</div>
      </div>
    </div>
  );
}
