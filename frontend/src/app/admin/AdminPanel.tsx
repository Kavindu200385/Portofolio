import { FormEvent, useEffect, useState } from "react";
import { Link, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router";
import {
  clearAdminToken,
  defaultPortfolioData,
  getAdminToken,
  pushAdminToast,
  setAdminToken,
  TOAST_EVENT,
  usePortfolioData,
  type EducationItem,
  type ExperienceItem,
  type ProjectItem,
  type SkillItem,
} from "../data/portfolioData";
import { adminDelete, adminPost, adminPut, isAdminSecretConfigured } from "../lib/portfolioApi";
import { fileToCompressedDataUrl, uploadImageDataUrl } from "../lib/uploadPortfolioImage";
import { SkillIcon } from "../components/skillIcons";

/** Images are stored in MongoDB as URL strings only (https://… or /path), not base64. */
function imageRefError(label: string, value: string, required: boolean): string | undefined {
  const t = value.trim();
  if (required && !t) return `${label} is required.`;
  if (!t) return undefined;
  if (t.startsWith("data:")) {
    return `${label}: use Upload to store the image — only a public link is saved in the database.`;
  }
  if (!(t.startsWith("https://") || t.startsWith("http://") || t.startsWith("/"))) {
    return `${label} must be a valid image URL (https://, http://, or a path on this site).`;
  }
  return undefined;
}

function ImageUploadField({
  label,
  required,
  value,
  onChange,
  error,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const [busy, setBusy] = useState(false);
  const pick = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      const url = await uploadImageDataUrl(dataUrl);
      onChange(url);
    } catch (e) {
      pushAdminToast("error", e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ marginBottom: 4, fontSize: 12, fontWeight: 600 }}>
        {label}
        {required ? <span style={{ color: "#f97373", marginLeft: 4 }}>*</span> : null}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 14px",
            borderRadius: 12,
            border: `1px solid ${error ? "rgba(248,113,113,0.8)" : "rgba(148,163,184,0.45)"}`,
            background: busy ? "rgba(15,23,42,0.5)" : "rgba(59,130,246,0.15)",
            color: "#e5e7eb",
            fontSize: 13,
            cursor: busy ? "wait" : "pointer",
            opacity: busy ? 0.7 : 1,
          }}
        >
          <input
            type="file"
            accept="image/*"
            disabled={busy}
            style={{ display: "none" }}
            onChange={(e) => {
              void pick(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          {busy ? "Uploading…" : "Choose image"}
        </label>
        {value.trim() ? (
          <button
            type="button"
            onClick={() => onChange("")}
            style={{
              padding: "8px 12px",
              borderRadius: 12,
              border: "1px solid rgba(148,163,184,0.4)",
              background: "transparent",
              color: "rgba(248,113,113,0.95)",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Remove
          </button>
        ) : null}
      </div>
      <div style={{ marginTop: 2, fontSize: 11, color: "rgba(148,163,184,0.95)", lineHeight: 1.45 }}>
        The file is uploaded to blob storage; MongoDB stores the public image URL only (not base64).
      </div>
      {value.trim() && !value.trim().startsWith("data:") ? (
        <div style={{ marginTop: 10 }}>
          <img
            src={value.trim()}
            alt=""
            style={{ maxWidth: "100%", maxHeight: 180, borderRadius: 12, objectFit: "cover" }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.opacity = "0.3";
            }}
          />
        </div>
      ) : null}
      {error ? (
        <div style={{ marginTop: 4, fontSize: 11, color: "#f87171" }}>{error}</div>
      ) : null}
    </div>
  );
}

function AdminGuard() {
  if (!getAdminToken()) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}

function sectionCardStyle() {
  return {
    borderRadius: "18px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
  } as const;
}

function Sidebar() {
  const location = useLocation();
  const links = [
    ["Dashboard", "/admin"],
    ["Projects", "/admin/projects"],
    ["Skills & Tools", "/admin/skills"],
    ["Experience", "/admin/experience"],
    ["Education", "/admin/education"],
    ["About Me", "/admin/about"],
    ["Hero Section", "/admin/hero"],
    ["Contact Info", "/admin/contact"],
  ] as const;
  return (
    <aside style={{ width: 260, padding: 16, ...sectionCardStyle(), position: "sticky", top: 20, height: "fit-content" }}>
      <div style={{ fontWeight: 800, marginBottom: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Admin Panel</div>
      <div style={{ display: "grid", gap: 8 }}>
        {links.map(([label, to]) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              style={{
                textDecoration: "none",
                color: active ? "#4F8EF7" : "rgba(255,255,255,0.72)",
                background: active ? "rgba(79,142,247,0.12)" : "transparent",
                border: `1px solid ${active ? "rgba(79,142,247,0.35)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 12,
                padding: "10px 12px",
                fontSize: 13,
              }}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [toast, setToast] = useState<string>("");
  const [toastKind, setToastKind] = useState<"success" | "error">("success");
  const secretOk = isAdminSecretConfigured();

  useEffect(() => {
    const handler = (ev: Event) => {
      const ce = ev as CustomEvent<{ type?: string; message: string }>;
      if (ce.detail?.message) {
        setToast(ce.detail.message);
        setToastKind(ce.detail.type === "error" ? "error" : "success");
        setTimeout(() => setToast(""), 2800);
      }
    };
    window.addEventListener(TOAST_EVENT, handler);
    return () => window.removeEventListener(TOAST_EVENT, handler);
  }, []);
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080810",
        color: "#fff",
        padding: 20,
        cursor: "auto",
      }}
      className="admin-root"
    >
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        {!secretOk ? (
          <div
            style={{
              ...sectionCardStyle(),
              padding: "12px 14px",
              marginBottom: 12,
              borderColor: "rgba(251,191,36,0.45)",
              color: "#fcd34d",
              fontSize: 12,
              lineHeight: 1.45,
            }}
          >
            <strong style={{ display: "block", marginBottom: 4 }}>Admin API secret missing</strong>
            Set <code style={{ color: "#e5e7eb" }}>NEXT_PUBLIC_ADMIN_SECRET</code> in{" "}
            <code style={{ color: "#e5e7eb" }}>.env</code> / Vercel (same value as server{" "}
            <code style={{ color: "#e5e7eb" }}>ADMIN_SECRET</code>) or saves will return 401.
          </div>
        ) : null}
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div className="admin-sidebar"><Sidebar /></div>
          <main style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...sectionCardStyle(), padding: "14px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 20 }}>
                {location.pathname === "/admin" ? "Dashboard" : location.pathname.replace("/admin/", "").replace("-", " ").toUpperCase()}
              </div>
              <button
                onClick={() => {
                  clearAdminToken();
                  navigate("/admin/login");
                }}
                style={{ borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", padding: "8px 12px" }}
              >
                Logout
              </button>
            </div>
            <Outlet />
          </main>
        </div>
      </div>
      <div className="admin-mobile-nav" style={{ position: "fixed", left: 12, right: 12, bottom: 12, ...sectionCardStyle(), padding: 8, zIndex: 1500 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6 }}>
          {[
            ["Dash", "/admin"],
            ["Projects", "/admin/projects"],
            ["Skills", "/admin/skills"],
            ["Exp", "/admin/experience"],
            ["More", "/admin/about"],
          ].map(([label, to]) => (
            <Link key={to} to={to} style={{ textDecoration: "none", color: "#cbd5e1", fontSize: 11, textAlign: "center", padding: "8px 4px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
              {label}
            </Link>
          ))}
        </div>
      </div>
      {toast ? (
        <div
          style={{
            position: "fixed",
            right: 16,
            bottom: 16,
            zIndex: 2000,
            ...sectionCardStyle(),
            padding: "10px 14px",
            borderColor: toastKind === "error" ? "rgba(248,113,113,0.45)" : "rgba(16,185,129,0.35)",
            color: toastKind === "error" ? "#fecaca" : "#bbf7d0",
            fontSize: 12,
          }}
        >
          {toast}
        </div>
      ) : null}
      <style>{`
        .admin-root * {
          cursor: auto !important;
        }
        .admin-root a,
        .admin-root button {
          cursor: pointer !important;
        }
        @media (max-width: 980px) {
          .admin-sidebar { display: none; }
        }
        @media (min-width: 981px) {
          .admin-mobile-nav { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const env = import.meta.env as Record<string, string | undefined>;
    const expectedUsername =
      String(env.NEXT_PUBLIC_ADMIN_USERNAME || env.VITE_ADMIN_USERNAME || "kavindu2003sandaruwan@gmail.com");
    const expectedPassword =
      String(env.NEXT_PUBLIC_ADMIN_PASSWORD || env.VITE_ADMIN_PASSWORD || "200385");
    if (username !== expectedUsername || password !== expectedPassword) {
      setError("Invalid username or password");
      return;
    }
    setAdminToken(`ok_${Date.now()}`);
    navigate("/admin");
  };

  if (getAdminToken()) return <Navigate to="/admin" replace />;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#080810",
        color: "#fff",
        cursor: "auto",
      }}
      className="admin-login-root"
    >
      <style>{`
        .admin-login-root * {
          cursor: auto !important;
        }
        .admin-login-root a,
        .admin-login-root button,
        .admin-login-root input,
        .admin-login-root textarea {
          cursor: text;
        }
        .admin-login-root button {
          cursor: pointer;
        }
      `}</style>
      <form onSubmit={submit} style={{ width: 360, padding: 24, ...sectionCardStyle() }}>
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 28, marginBottom: 16 }}>Admin Login</div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "#fff", marginBottom: 10 }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "#fff" }}
        />
        {error ? <div style={{ marginTop: 10, color: "#f87171", fontSize: 12 }}>{error}</div> : null}
        <button type="submit" style={{ marginTop: 14, width: "100%", padding: "10px 14px", borderRadius: 12, border: "1px solid rgba(79,142,247,0.35)", background: "rgba(79,142,247,0.15)", color: "#fff", fontWeight: 700 }}>
          Login
        </button>
      </form>
    </div>
  );
}

function DashboardPage() {
  const { data, loading, error, refetch } = usePortfolioData();
  const [seeding, setSeeding] = useState(false);
  const secretOk = isAdminSecretConfigured();
  if (loading) return <Skeleton />;
  if (error) return <ErrorRetry message={error} onRetry={() => void refetch()} />;
  const stats = [
    ["Total Projects", data.projects.length],
    ["Total Skills", data.skills.length],
    ["Total Experience", data.experiences.length],
    ["Total Education", data.education.length],
  ];

  const seedEmptyCollections = async () => {
    if (!secretOk) {
      pushAdminToast("error", "Set NEXT_PUBLIC_ADMIN_SECRET (or VITE_ADMIN_SECRET) to match ADMIN_SECRET on the server.");
      return;
    }
    if (
      !window.confirm(
        "Insert the built-in portfolio content into MongoDB only where a collection is empty. Existing saved data is not removed or overwritten.",
      )
    )
      return;
    setSeeding(true);
    try {
      await adminPost("/api/admin/seed-defaults", {});
      await refetch();
      pushAdminToast("success", "Empty collections were filled from the built-in content.");
    } catch (e) {
      pushAdminToast("error", e instanceof Error ? e.message : "Seed failed");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
        {stats.map(([name, val]) => (
          <div key={name} style={{ ...sectionCardStyle(), padding: 16 }}>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>{name}</div>
            <div style={{ fontSize: 30, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{val}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, ...sectionCardStyle(), padding: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Database</div>
        <p style={{ margin: "0 0 12px", fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
          If the site shows your built-in content but MongoDB is empty, use this once to copy that same content into the database. Only empty collections are filled; nothing is deleted.
        </p>
        <button
          type="button"
          disabled={seeding || !secretOk}
          onClick={() => void seedEmptyCollections()}
          style={{
            borderRadius: 10,
            border: "1px solid rgba(79,142,247,0.45)",
            background: secretOk ? "rgba(79,142,247,0.15)" : "rgba(255,255,255,0.06)",
            color: secretOk ? "#fff" : "rgba(255,255,255,0.35)",
            padding: "10px 14px",
            fontSize: 13,
            cursor: secretOk && !seeding ? "pointer" : "not-allowed",
          }}
        >
          {seeding ? "Saving…" : "Copy built-in content to database (empty collections only)"}
        </button>
      </div>
      <div style={{ marginTop: 12, ...sectionCardStyle(), padding: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Recent changes</div>
        <div style={{ display: "grid", gap: 6 }}>
          {(data.changesLog.length ? data.changesLog : ["No changes yet"]).slice(0, 8).map((l) => (
            <div key={l} style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Skeleton() {
  return <div style={{ ...sectionCardStyle(), padding: 20, color: "rgba(255,255,255,0.5)" }}>Loading...</div>;
}

function ErrorRetry({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div style={{ ...sectionCardStyle(), padding: 20, color: "#fecaca" }}>
      <div style={{ marginBottom: 12, fontSize: 14 }}>{message}</div>
      <button
        type="button"
        onClick={onRetry}
        style={{
          borderRadius: 10,
          border: "1px solid rgba(248,113,113,0.4)",
          background: "rgba(248,113,113,0.12)",
          color: "#fecaca",
          padding: "8px 12px",
        }}
      >
        Retry
      </button>
    </div>
  );
}

function isMongoId(id: string) {
  return /^[0-9a-f]{24}$/i.test(id);
}

function resetButton(onClick: () => void) {
  return (
    <button onClick={onClick} style={{ borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#fff", padding: "8px 10px", fontSize: 12 }}>
      Reset to Default
    </button>
  );
}

function ProjectsPage() {
  const { data, loading, error, refetch } = usePortfolioData();
  const [editing, setEditing] = useState<ProjectItem | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  if (loading) return <Skeleton />;
  if (error) return <ErrorRetry message={error} onRetry={() => void refetch()} />;

  const handleReorder = async (from: number, to: number) => {
    if (from === to || from < 0 || to < 0 || from >= data.projects.length || to >= data.projects.length) return;
    const next = [...data.projects];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    const items = next.map((p, i) => ({ id: p.id, order: i }));
    setBusy(true);
    try {
      await adminPut("/api/projects/reorder", { items });
      await refetch();
      pushAdminToast("success", `Reordered project ${moved.name}`);
    } catch (e) {
      pushAdminToast("error", e instanceof Error ? e.message : "Failed to reorder");
    } finally {
      setBusy(false);
    }
  };

  const resetProjects = async () => {
    if (!window.confirm("Reset all projects to built-in defaults? This replaces database content for this section.")) return;
    setBusy(true);
    try {
      for (const p of data.projects) {
        if (isMongoId(p.id)) await adminDelete(`/api/projects/${p.id}`);
      }
      for (const p of defaultPortfolioData.projects) {
        await adminPost("/api/projects", { ...p, id: undefined });
      }
      await refetch();
      pushAdminToast("success", "Reset projects to default");
    } catch (e) {
      pushAdminToast("error", e instanceof Error ? e.message : "Reset failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <button
          disabled={busy}
          onClick={() =>
            setEditing({
              id: `p_${Date.now()}`,
              name: "",
              type: "Individual",
              shortDescription: "",
              longDescription: "",
              thumbnail: "",
              githubLink: "",
              liveDemoLink: "",
              techStack: [],
              featured: false,
            })
          }
          style={{ borderRadius: 10, border: "1px solid rgba(79,142,247,0.35)", background: "rgba(79,142,247,0.15)", color: "#fff", padding: "8px 12px" }}
        >
          Add Project
        </button>
        {resetButton(() => void resetProjects())}
      </div>
      {!data.projects.length ? (
        <div style={{ ...sectionCardStyle(), padding: 16, color: "rgba(255,255,255,0.55)" }}>No projects yet. Add one to get started.</div>
      ) : null}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12 }}>
        {data.projects.map((p, index) => (
          <div
            key={p.id}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIndex !== null) {
                handleReorder(dragIndex, index);
                setDragIndex(null);
              }
            }}
            style={{ ...sectionCardStyle(), overflow: "hidden", cursor: "grab" }}
          >
            <img src={p.thumbnail} style={{ width: "100%", height: 120, objectFit: "cover" }} />
            <div style={{ padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ fontWeight: 700 }}>{p.name}</div>
                {p.featured ? (
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 999,
                      fontSize: 10,
                      fontFamily: "'Inter', sans-serif",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      background: "rgba(251,191,36,0.16)",
                      border: "1px solid rgba(251,191,36,0.55)",
                      color: "#fbbf24",
                    }}
                  >
                    Featured
                  </span>
                ) : null}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>{p.type}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                {p.techStack.map((t) => (
                  <span
                    key={t}
                    style={{
                      padding: "2px 8px",
                      borderRadius: 999,
                      border: "1px solid rgba(255,255,255,0.14)",
                      fontSize: 10,
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <button onClick={() => setEditing(p)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "#fff" }}>Edit</button>
                <button
                  disabled={busy}
                  onClick={() => {
                    if (!window.confirm("Delete project?")) return;
                    void (async () => {
                      setBusy(true);
                      try {
                        await adminDelete(`/api/projects/${p.id}`);
                        await refetch();
                        pushAdminToast("success", `Deleted project ${p.name}`);
                      } catch (e) {
                        pushAdminToast("error", e instanceof Error ? e.message : "Delete failed");
                      } finally {
                        setBusy(false);
                      }
                    })();
                  }}
                  style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(248,113,113,0.4)", background: "rgba(248,113,113,0.12)", color: "#fecaca" }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {editing ? (
        <ProjectModal
          item={editing}
          onClose={() => setEditing(null)}
          onSave={async (item) => {
            const exists = data.projects.some((p) => p.id === item.id);
            const isCreate = !exists || !isMongoId(item.id);
            try {
              if (isCreate) {
                await adminPost("/api/projects", item);
                pushAdminToast("success", `Added project ${item.name}`);
              } else {
                await adminPut(`/api/projects/${item.id}`, item);
                pushAdminToast("success", `Updated project ${item.name}`);
              }
              await refetch();
              setEditing(null);
            } catch (e) {
              pushAdminToast("error", e instanceof Error ? e.message : "Save failed");
            }
          }}
        />
      ) : null}
    </div>
  );
}

function SkillsPage() {
  const { data, loading, error, refetch } = usePortfolioData();
  const [editing, setEditing] = useState<SkillItem | null>(null);
  const [busy, setBusy] = useState(false);
  if (loading) return <Skeleton />;
  if (error) return <ErrorRetry message={error} onRetry={() => void refetch()} />;

  const reorderSkills = async (next: SkillItem[]) => {
    const items = next.map((s, i) => ({ id: s.id, order: i }));
    setBusy(true);
    try {
      await adminPut("/api/skills/reorder", { items });
      await refetch();
    } catch (e) {
      pushAdminToast("error", e instanceof Error ? e.message : "Reorder failed");
    } finally {
      setBusy(false);
    }
  };

  const resetSkills = async () => {
    if (!window.confirm("Reset all skills to built-in defaults?")) return;
    setBusy(true);
    try {
      for (const s of data.skills) {
        if (isMongoId(s.id)) await adminDelete(`/api/skills/${s.id}`);
      }
      for (const s of defaultPortfolioData.skills) {
        await adminPost("/api/skills", { ...s, id: undefined });
      }
      await refetch();
      pushAdminToast("success", "Reset skills to default");
    } catch (e) {
      pushAdminToast("error", e instanceof Error ? e.message : "Reset failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <button
          disabled={busy}
          onClick={() =>
            setEditing({
              id: `s_${Date.now()}`,
              name: "",
              icon: "",
              category: "Tools",
              shortDescription: "",
              proficiency: "Intermediate",
              color: "#4F8EF7",
              size: "normal",
            })
          }
          style={{ borderRadius: 10, border: "1px solid rgba(79,142,247,0.35)", background: "rgba(79,142,247,0.15)", color: "#fff", padding: "8px 12px" }}
        >
          Add Skill
        </button>
        {resetButton(() => void resetSkills())}
      </div>
      {!data.skills.length ? (
        <div style={{ ...sectionCardStyle(), padding: 16, color: "rgba(255,255,255,0.55)" }}>No skills yet.</div>
      ) : null}
      <div style={{ display: "grid", gap: 10 }}>
        {data.skills.map((s, idx) => (
          <div key={s.id} style={{ ...sectionCardStyle(), padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: `${s.color}22`,
                  border: `1px solid ${s.color}44`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <SkillIcon id={s.id} name={s.name} icon={s.icon} color={s.color} size={20} />
              </span>
              <span>
                {s.name} · <span style={{ color: "rgba(255,255,255,0.5)" }}>{s.category}</span>
              </span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                disabled={busy || idx <= 0}
                onClick={() => {
                  if (idx <= 0) return;
                  const next = data.skills.map((x, i, arr) => (i === idx - 1 ? arr[idx] : i === idx ? arr[idx - 1] : x));
                  void reorderSkills(next);
                }}
              >
                ↑
              </button>
              <button
                disabled={busy || idx >= data.skills.length - 1}
                onClick={() => {
                  if (idx >= data.skills.length - 1) return;
                  const next = data.skills.map((x, i, arr) => (i === idx + 1 ? arr[idx] : i === idx ? arr[idx + 1] : x));
                  void reorderSkills(next);
                }}
              >
                ↓
              </button>
              <button onClick={() => setEditing(s)}>Edit</button>
              <button
                disabled={busy}
                onClick={() => {
                  if (!window.confirm("Delete skill?")) return;
                  void (async () => {
                    setBusy(true);
                    try {
                      await adminDelete(`/api/skills/${s.id}`);
                      await refetch();
                      pushAdminToast("success", `Deleted skill ${s.name}`);
                    } catch (e) {
                      pushAdminToast("error", e instanceof Error ? e.message : "Delete failed");
                    } finally {
                      setBusy(false);
                    }
                  })();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {editing ? (
        <SkillModal
          item={editing}
          onClose={() => setEditing(null)}
          onSave={async (item) => {
            const exists = data.skills.some((sk) => sk.id === item.id);
            const isCreate = !exists || !isMongoId(item.id);
            try {
              if (isCreate) {
                await adminPost("/api/skills", item);
                pushAdminToast("success", `Added skill ${item.name}`);
              } else {
                await adminPut(`/api/skills/${item.id}`, item);
                pushAdminToast("success", `Updated skill ${item.name}`);
              }
              await refetch();
              setEditing(null);
            } catch (e) {
              pushAdminToast("error", e instanceof Error ? e.message : "Save failed");
            }
          }}
        />
      ) : null}
    </div>
  );
}

function ExperiencePage() {
  const { data, loading, error, refetch } = usePortfolioData();
  const [editing, setEditing] = useState<ExperienceItem | null>(null);
  const [busy, setBusy] = useState(false);
  if (loading) return <Skeleton />;
  if (error) return <ErrorRetry message={error} onRetry={() => void refetch()} />;

  const reorderExp = async (next: ExperienceItem[]) => {
    const items = next.map((x, i) => ({ id: x.id, order: i }));
    setBusy(true);
    try {
      await adminPut("/api/experience/reorder", { items });
      await refetch();
    } catch (e) {
      pushAdminToast("error", e instanceof Error ? e.message : "Reorder failed");
    } finally {
      setBusy(false);
    }
  };

  const resetExp = async () => {
    if (!window.confirm("Reset experience entries to built-in defaults?")) return;
    setBusy(true);
    try {
      for (const x of data.experiences) {
        if (isMongoId(x.id)) await adminDelete(`/api/experience/${x.id}`);
      }
      for (const x of defaultPortfolioData.experiences) {
        await adminPost("/api/experience", { ...x, id: undefined });
      }
      await refetch();
      pushAdminToast("success", "Reset experience to default");
    } catch (e) {
      pushAdminToast("error", e instanceof Error ? e.message : "Reset failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <button
          disabled={busy}
          onClick={() =>
            setEditing({ id: `e_${Date.now()}`, companyName: "", role: "", startDate: "", endDate: "", present: false, description: "", logo: "💼", side: "left" })
          }
          style={{ borderRadius: 10, border: "1px solid rgba(79,142,247,0.35)", background: "rgba(79,142,247,0.15)", color: "#fff", padding: "8px 12px" }}
        >
          Add Experience
        </button>
        {resetButton(() => void resetExp())}
      </div>
      {!data.experiences.length ? (
        <div style={{ ...sectionCardStyle(), padding: 16, color: "rgba(255,255,255,0.55)" }}>No experience entries yet.</div>
      ) : null}
      {data.experiences.map((e, idx) => (
        <div key={e.id} style={{ ...sectionCardStyle(), padding: 12, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            {e.logo} {e.companyName} — {e.role}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              disabled={busy || idx <= 0}
              onClick={() => {
                if (idx <= 0) return;
                const next = data.experiences.map((x, i, arr) => (i === idx - 1 ? arr[idx] : i === idx ? arr[idx - 1] : x));
                void reorderExp(next);
              }}
            >
              ↑
            </button>
            <button
              disabled={busy || idx >= data.experiences.length - 1}
              onClick={() => {
                if (idx >= data.experiences.length - 1) return;
                const next = data.experiences.map((x, i, arr) => (i === idx + 1 ? arr[idx] : i === idx ? arr[idx + 1] : x));
                void reorderExp(next);
              }}
            >
              ↓
            </button>
            <button onClick={() => setEditing(e)}>Edit</button>
            <button
              disabled={busy}
              onClick={() => {
                if (!window.confirm("Delete experience?")) return;
                void (async () => {
                  setBusy(true);
                  try {
                    await adminDelete(`/api/experience/${e.id}`);
                    await refetch();
                    pushAdminToast("success", `Deleted experience ${e.companyName}`);
                  } catch (err) {
                    pushAdminToast("error", err instanceof Error ? err.message : "Delete failed");
                  } finally {
                    setBusy(false);
                  }
                })();
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      {editing ? (
        <ExperienceModal
          item={editing}
          onClose={() => setEditing(null)}
          onSave={async (item) => {
            const exists = data.experiences.some((x) => x.id === item.id);
            const isCreate = !exists || !isMongoId(item.id);
            try {
              if (isCreate) {
                await adminPost("/api/experience", item);
                pushAdminToast("success", `Added experience ${item.companyName}`);
              } else {
                await adminPut(`/api/experience/${item.id}`, item);
                pushAdminToast("success", `Updated experience ${item.companyName}`);
              }
              await refetch();
              setEditing(null);
            } catch (err) {
              pushAdminToast("error", err instanceof Error ? err.message : "Save failed");
            }
          }}
        />
      ) : null}
    </div>
  );
}

function EducationPage() {
  const { data, loading, error, refetch } = usePortfolioData();
  const [editing, setEditing] = useState<EducationItem | null>(null);
  const [busy, setBusy] = useState(false);
  if (loading) return <Skeleton />;
  if (error) return <ErrorRetry message={error} onRetry={() => void refetch()} />;

  const reorderEdu = async (next: EducationItem[]) => {
    const items = next.map((x, i) => ({ id: x.id, order: i }));
    setBusy(true);
    try {
      await adminPut("/api/education/reorder", { items });
      await refetch();
    } catch (e) {
      pushAdminToast("error", e instanceof Error ? e.message : "Reorder failed");
    } finally {
      setBusy(false);
    }
  };

  const resetEdu = async () => {
    if (!window.confirm("Reset education entries to built-in defaults?")) return;
    setBusy(true);
    try {
      for (const x of data.education) {
        if (isMongoId(x.id)) await adminDelete(`/api/education/${x.id}`);
      }
      for (const x of defaultPortfolioData.education) {
        await adminPost("/api/education", { ...x, id: undefined });
      }
      await refetch();
      pushAdminToast("success", "Reset education to default");
    } catch (e) {
      pushAdminToast("error", e instanceof Error ? e.message : "Reset failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <button
          disabled={busy}
          onClick={() =>
            setEditing({ id: `ed_${Date.now()}`, institutionName: "", degree: "", startDate: "", endDate: "", present: false, description: "", logo: "🎓", side: "right" })
          }
          style={{ borderRadius: 10, border: "1px solid rgba(79,142,247,0.35)", background: "rgba(79,142,247,0.15)", color: "#fff", padding: "8px 12px" }}
        >
          Add Education
        </button>
        {resetButton(() => void resetEdu())}
      </div>
      {!data.education.length ? (
        <div style={{ ...sectionCardStyle(), padding: 16, color: "rgba(255,255,255,0.55)" }}>No education entries yet.</div>
      ) : null}
      {data.education.map((e, idx) => (
        <div key={e.id} style={{ ...sectionCardStyle(), padding: 12, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            {e.logo} {e.institutionName}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              disabled={busy || idx <= 0}
              onClick={() => {
                if (idx <= 0) return;
                const next = data.education.map((x, i, arr) => (i === idx - 1 ? arr[idx] : i === idx ? arr[idx - 1] : x));
                void reorderEdu(next);
              }}
            >
              ↑
            </button>
            <button
              disabled={busy || idx >= data.education.length - 1}
              onClick={() => {
                if (idx >= data.education.length - 1) return;
                const next = data.education.map((x, i, arr) => (i === idx + 1 ? arr[idx] : i === idx ? arr[idx + 1] : x));
                void reorderEdu(next);
              }}
            >
              ↓
            </button>
            <button onClick={() => setEditing(e)}>Edit</button>
            <button
              disabled={busy}
              onClick={() => {
                if (!window.confirm("Delete education?")) return;
                void (async () => {
                  setBusy(true);
                  try {
                    await adminDelete(`/api/education/${e.id}`);
                    await refetch();
                    pushAdminToast("success", `Deleted education ${e.institutionName}`);
                  } catch (err) {
                    pushAdminToast("error", err instanceof Error ? err.message : "Delete failed");
                  } finally {
                    setBusy(false);
                  }
                })();
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      {editing ? (
        <EducationModal
          item={editing}
          onClose={() => setEditing(null)}
          onSave={async (item) => {
            const exists = data.education.some((x) => x.id === item.id);
            const isCreate = !exists || !isMongoId(item.id);
            try {
              if (isCreate) {
                await adminPost("/api/education", item);
                pushAdminToast("success", `Added education ${item.institutionName}`);
              } else {
                await adminPut(`/api/education/${item.id}`, item);
                pushAdminToast("success", `Updated education ${item.institutionName}`);
              }
              await refetch();
              setEditing(null);
            } catch (err) {
              pushAdminToast("error", err instanceof Error ? err.message : "Save failed");
            }
          }}
        />
      ) : null}
    </div>
  );
}

function AboutPage() {
  const { data, loading, error, refetch } = usePortfolioData();
  const [local, setLocal] = useState(data.about);
  const [saving, setSaving] = useState(false);
  useEffect(() => setLocal(data.about), [data.about]);
  if (loading) return <Skeleton />;
  if (error) return <ErrorRetry message={error} onRetry={() => void refetch()} />;

  const saveAbout = async () => {
    const pe = imageRefError("Profile photo", local.profilePhoto, false);
    if (pe) {
      pushAdminToast("error", pe);
      return;
    }
    setSaving(true);
    try {
      await adminPut("/api/about", {
        paragraphs: local.paragraphs,
        badges: local.badges,
        profilePhoto: local.profilePhoto,
      });
      await refetch();
      pushAdminToast("success", "Updated About Me");
    } catch (e) {
      pushAdminToast("error", e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const resetAbout = async () => {
    if (!window.confirm("Reset About section to built-in defaults?")) return;
    setSaving(true);
    try {
      await adminPut("/api/about", {
        paragraphs: defaultPortfolioData.about.paragraphs,
        badges: defaultPortfolioData.about.badges,
        profilePhoto: defaultPortfolioData.about.profilePhoto,
      });
      await refetch();
      pushAdminToast("success", "Reset About to default");
    } catch (e) {
      pushAdminToast("error", e instanceof Error ? e.message : "Reset failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ ...sectionCardStyle(), padding: 16 }}>
      <textarea value={local.paragraphs[0] ?? ""} onChange={(e) => setLocal({ ...local, paragraphs: [e.target.value, local.paragraphs[1] ?? "", local.paragraphs[2] ?? ""] })} style={{ width: "100%", minHeight: 90, marginBottom: 8 }} />
      <textarea value={local.paragraphs[1] ?? ""} onChange={(e) => setLocal({ ...local, paragraphs: [local.paragraphs[0] ?? "", e.target.value, local.paragraphs[2] ?? ""] })} style={{ width: "100%", minHeight: 90, marginBottom: 8 }} />
      <textarea value={local.paragraphs[2] ?? ""} onChange={(e) => setLocal({ ...local, paragraphs: [local.paragraphs[0] ?? "", local.paragraphs[1] ?? "", e.target.value] })} style={{ width: "100%", minHeight: 90, marginBottom: 8 }} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
        {local.badges.map((b, idx) => (
          <div key={b.id} style={{ ...sectionCardStyle(), padding: "6px 10px", display: "flex", gap: 8, alignItems: "center" }}>
            {b.emoji} {b.label}
            <button onClick={() => setLocal({ ...local, badges: local.badges.filter((x) => x.id !== b.id) })}>x</button>
            <button onClick={() => idx > 0 && setLocal({ ...local, badges: local.badges.map((x, i, arr) => (i === idx - 1 ? arr[idx] : i === idx ? arr[idx - 1] : x)) })}>↑</button>
            <button onClick={() => idx < local.badges.length - 1 && setLocal({ ...local, badges: local.badges.map((x, i, arr) => (i === idx + 1 ? arr[idx] : i === idx ? arr[idx + 1] : x)) })}>↓</button>
          </div>
        ))}
      </div>
      <button onClick={() => setLocal({ ...local, badges: [...local.badges, { id: `b_${Date.now()}`, emoji: "✨", label: "New Badge" }] })}>Add Badge</button>
      <div style={{ marginTop: 12 }}>
        <ImageUploadField
          label="Profile photo"
          value={local.profilePhoto}
          onChange={(v) => setLocal({ ...local, profilePhoto: v })}
        />
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button disabled={saving} onClick={() => void saveAbout()} style={{ padding: "8px 12px" }}>
          {saving ? "Saving..." : "Save"}
        </button>
        {resetButton(() => void resetAbout())}
      </div>
    </div>
  );
}

function HeroPage() {
  const { data, loading, error, refetch } = usePortfolioData();
  const [hero, setHero] = useState(data.hero);
  const [saving, setSaving] = useState(false);
  useEffect(() => setHero(data.hero), [data.hero]);
  if (loading) return <Skeleton />;
  if (error) return <ErrorRetry message={error} onRetry={() => void refetch()} />;

  const saveHero = async () => {
    const he = imageRefError("Hero photo", hero.heroPhoto, true);
    if (he) {
      pushAdminToast("error", he);
      return;
    }
    setSaving(true);
    try {
      await adminPut("/api/hero", hero);
      await refetch();
      pushAdminToast("success", "Updated Hero section");
    } catch (e) {
      pushAdminToast("error", e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const resetHero = async () => {
    if (!window.confirm("Reset Hero section to built-in defaults?")) return;
    setSaving(true);
    try {
      await adminPut("/api/hero", defaultPortfolioData.hero);
      await refetch();
      pushAdminToast("success", "Reset Hero to default");
    } catch (e) {
      pushAdminToast("error", e instanceof Error ? e.message : "Reset failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <div style={{ ...sectionCardStyle(), padding: 16 }}>
        <input value={hero.heading} onChange={(e) => setHero({ ...hero, heading: e.target.value })} style={{ width: "100%", marginBottom: 8 }} />
        <input value={hero.subHeading} onChange={(e) => setHero({ ...hero, subHeading: e.target.value })} style={{ width: "100%", marginBottom: 8 }} />
        <input value={hero.cta1Label} onChange={(e) => setHero({ ...hero, cta1Label: e.target.value })} style={{ width: "100%", marginBottom: 8 }} />
        <input value={hero.cta1Link} onChange={(e) => setHero({ ...hero, cta1Link: e.target.value })} style={{ width: "100%", marginBottom: 8 }} />
        <input value={hero.cta2Label} onChange={(e) => setHero({ ...hero, cta2Label: e.target.value })} style={{ width: "100%", marginBottom: 8 }} />
        <input value={hero.cta2Link} onChange={(e) => setHero({ ...hero, cta2Link: e.target.value })} style={{ width: "100%", marginBottom: 8 }} />
        <ImageUploadField
          label="Hero photo"
          required
          value={hero.heroPhoto}
          onChange={(v) => setHero({ ...hero, heroPhoto: v })}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button type="button" disabled={saving} onClick={() => void saveHero()}>
            {saving ? "Saving..." : "Save"}
          </button>
          {resetButton(() => void resetHero())}
        </div>
      </div>
      <div style={{ ...sectionCardStyle(), padding: 16 }}>
        <h3>{hero.heading}</h3>
        <p>{hero.subHeading}</p>
        <img src={hero.heroPhoto} alt="" style={{ width: 140, height: 140, objectFit: "cover", borderRadius: "50%" }} />
      </div>
    </div>
  );
}

function ContactPage() {
  const { data, loading, error, refetch } = usePortfolioData();
  const [contact, setContact] = useState(data.contact);
  const [saving, setSaving] = useState(false);
  useEffect(() => setContact(data.contact), [data.contact]);
  if (loading) return <Skeleton />;
  if (error) return <ErrorRetry message={error} onRetry={() => void refetch()} />;

  const saveContact = async () => {
    setSaving(true);
    try {
      await adminPut("/api/contact", contact);
      await refetch();
      pushAdminToast("success", "Updated Contact info");
    } catch (e) {
      pushAdminToast("error", e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const resetContact = async () => {
    if (!window.confirm("Reset Contact section to built-in defaults?")) return;
    setSaving(true);
    try {
      await adminPut("/api/contact", defaultPortfolioData.contact);
      await refetch();
      pushAdminToast("success", "Reset Contact to default");
    } catch (e) {
      pushAdminToast("error", e instanceof Error ? e.message : "Reset failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ ...sectionCardStyle(), padding: 16 }}>
      {(["email", "whatsapp", "linkedin", "github", "phone", "heading", "description"] as const).map((k) => (
        <input key={k} value={contact[k]} onChange={(e) => setContact({ ...contact, [k]: e.target.value })} style={{ width: "100%", marginBottom: 8 }} />
      ))}
      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" disabled={saving} onClick={() => void saveContact()}>
          {saving ? "Saving..." : "Save"}
        </button>
        {resetButton(() => void resetContact())}
      </div>
    </div>
  );
}

function BaseModal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "grid", placeItems: "center", padding: 16, zIndex: 1000 }}>
      <div style={{ width: "min(760px,96vw)", maxHeight: "90vh", overflow: "auto", ...sectionCardStyle(), padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}><button onClick={onClose}>Close</button></div>
        {children}
      </div>
    </div>
  );
}

function ProjectModal({
  item,
  onClose,
  onSave,
}: {
  item: ProjectItem;
  onClose: () => void;
  onSave: (item: ProjectItem) => void | Promise<void>;
}) {
  const [state, setState] = useState<ProjectItem>({ ...item, extraImages: item.extraImages ?? [] });
  const [stackInput, setStackInput] = useState("");
  const [stack, setStack] = useState<string[]>(item.techStack);
  const [shortCount, setShortCount] = useState(item.shortDescription?.length ?? 0);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [extrasBusy, setExtrasBusy] = useState(false);

  const addTag = () => {
    const v = stackInput.trim();
    if (!v) return;
    if (!stack.includes(v)) setStack([...stack, v]);
    setStackInput("");
  };

  const removeTag = (tag: string) => {
    setStack(stack.filter((t) => t !== tag));
  };

  const onStackKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const removeExtraImage = (idx: number) => {
    setState((prev) => ({
      ...prev,
      extraImages: (prev.extraImages ?? []).filter((_, i) => i !== idx),
    }));
  };

  const addExtraFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setExtrasBusy(true);
    try {
      for (const file of Array.from(files)) {
        const dataUrl = await fileToCompressedDataUrl(file);
        const url = await uploadImageDataUrl(dataUrl);
        setState((prev) => ({ ...prev, extraImages: [...(prev.extraImages ?? []), url] }));
      }
    } catch (e) {
      pushAdminToast("error", e instanceof Error ? e.message : "Upload failed");
    } finally {
      setExtrasBusy(false);
    }
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!state.name.trim()) nextErrors.name = "Project name is required.";
    if (!state.type) nextErrors.type = "Category is required.";
    if (!state.shortDescription.trim()) nextErrors.shortDescription = "Short description is required.";
    if (shortCount > 150) nextErrors.shortDescription = "Short description must be 150 characters or less.";
    if (!state.longDescription.trim()) nextErrors.longDescription = "Full description is required.";
    const mainErr = imageRefError("Main photo", state.thumbnail, true);
    if (mainErr) nextErrors.thumbnail = mainErr;
    (state.extraImages ?? []).forEach((url, i) => {
      const ex = imageRefError(`Additional photo ${i + 1}`, url, true);
      if (ex) nextErrors[`extra_${i}`] = ex;
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await Promise.resolve(onSave({ ...state, techStack: stack }));
    } finally {
      setSaving(false);
    }
  };

  const typeOptions: { value: ProjectItem["type"]; label: string; color: string }[] = [
    { value: "Individual", label: "Individual", color: "#4F8EF7" },
    { value: "Group", label: "Group", color: "#22c55e" },
    { value: "Research", label: "Research", color: "#7C3AED" },
  ];

  const currentType = typeOptions.find((o) => o.value === state.type) ?? typeOptions[0];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        display: "flex",
        justifyContent: "flex-end",
        zIndex: 1000,
        padding: 0,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "min(520px, 100vw)",
          maxWidth: "100%",
          height: "100%",
          background: "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(15,23,42,0.98))",
          borderLeft: "1px solid rgba(148,163,184,0.35)",
          boxShadow: "0 0 40px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid rgba(148,163,184,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            {item.id ? "Edit Project" : "Add Project"}
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              borderRadius: 999,
              border: "1px solid rgba(148,163,184,0.4)",
              background: "rgba(15,23,42,0.8)",
              color: "#e5e7eb",
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 20px 80px",
          }}
        >
          {/* 1. Project Name */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ marginBottom: 4, fontSize: 12, fontWeight: 600 }}>
              <span>Project Name</span>
              <span style={{ color: "#f97373", marginLeft: 4 }}>*</span>
            </div>
            <input
              value={state.name}
              onChange={(e) => setState({ ...state, name: e.target.value })}
              placeholder="Enter project name"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 12,
                border: `1px solid ${errors.name ? "rgba(248,113,113,0.8)" : "rgba(148,163,184,0.4)"}`,
                background: "rgba(15,23,42,0.85)",
                color: "#e5e7eb",
                fontSize: 13,
              }}
            />
            {errors.name && (
              <div style={{ marginTop: 4, fontSize: 11, color: "#f87171" }}>{errors.name}</div>
            )}
          </div>

          {/* 2. Category */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ marginBottom: 4, fontSize: 12, fontWeight: 600 }}>
              <span>Category</span>
              <span style={{ color: "#f97373", marginLeft: 4 }}>*</span>
            </div>
            <div
              style={{
                position: "relative",
                borderRadius: 12,
                border: `1px solid ${errors.type ? "rgba(248,113,113,0.8)" : "rgba(148,163,184,0.4)"}`,
                background: "rgba(15,23,42,0.9)",
                padding: "4px 10px",
              }}
            >
              <select
                value={currentType.value}
                onChange={(e) =>
                  setState({ ...state, type: e.target.value as ProjectItem["type"] })
                }
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  color: "#e5e7eb",
                  padding: "6px 0 6px 0",
                  fontSize: 13,
                  WebkitAppearance: "none",
                }}
              >
                {typeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} style={{ color: "#000" }}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.type && (
              <div style={{ marginTop: 4, fontSize: 11, color: "#f87171" }}>{errors.type}</div>
            )}
          </div>

          {/* 3. Short Description */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ marginBottom: 4, fontSize: 12, fontWeight: 600 }}>
              <span>Short Description</span>
              <span style={{ color: "#f97373", marginLeft: 4 }}>*</span>
            </div>
            <div
              style={{
                borderRadius: 12,
                border: `1px solid ${errors.shortDescription ? "rgba(248,113,113,0.8)" : "rgba(148,163,184,0.4)"}`,
                background: "rgba(15,23,42,0.85)",
                padding: 8,
              }}
            >
              <textarea
                value={state.shortDescription}
                onChange={(e) => {
                  const v = e.target.value;
                  setState({ ...state, shortDescription: v });
                  setShortCount(v.length);
                }}
                rows={3}
                placeholder="Brief description shown on project card"
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  resize: "none",
                  background: "transparent",
                  color: "#e5e7eb",
                  fontSize: 13,
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  fontSize: 11,
                  color: shortCount > 150 ? "#f87171" : "rgba(148,163,184,0.9)",
                }}
              >
                {shortCount}/150
              </div>
            </div>
            {errors.shortDescription && (
              <div style={{ marginTop: 4, fontSize: 11, color: "#f87171" }}>
                {errors.shortDescription}
              </div>
            )}
          </div>

          {/* 4. Full Description */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ marginBottom: 4, fontSize: 12, fontWeight: 600 }}>
              <span>Full Description</span>
              <span style={{ color: "#f97373", marginLeft: 4 }}>*</span>
            </div>
            <textarea
              value={state.longDescription}
              onChange={(e) => setState({ ...state, longDescription: e.target.value })}
              rows={6}
              placeholder="Full detailed description of the project"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 12,
                border: `1px solid ${errors.longDescription ? "rgba(248,113,113,0.8)" : "rgba(148,163,184,0.4)"}`,
                background: "rgba(15,23,42,0.85)",
                color: "#e5e7eb",
                fontSize: 13,
                resize: "vertical",
              }}
            />
            {errors.longDescription && (
              <div style={{ marginTop: 4, fontSize: 11, color: "#f87171" }}>
                {errors.longDescription}
              </div>
            )}
          </div>

          {/* 5. Main photo (upload → URL in DB) */}
          <ImageUploadField
            label="Main photo"
            required
            value={state.thumbnail}
            onChange={(v) => setState({ ...state, thumbnail: v })}
            error={errors.thumbnail}
          />

          {/* 6. Additional photos (optional, same upload flow) */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ marginBottom: 4, fontSize: 12, fontWeight: 600 }}>
              <span>Additional photos</span>
              <span style={{ color: "rgba(148,163,184,0.9)", marginLeft: 4 }}>(optional)</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(148,163,184,0.45)",
                  background: extrasBusy ? "rgba(15,23,42,0.5)" : "rgba(59,130,246,0.15)",
                  color: "#e5e7eb",
                  fontSize: 13,
                  cursor: extrasBusy ? "wait" : "pointer",
                  opacity: extrasBusy ? 0.7 : 1,
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={extrasBusy}
                  style={{ display: "none" }}
                  onChange={(e) => {
                    void addExtraFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
                {extrasBusy ? "Uploading…" : "Add photos"}
              </label>
              <span style={{ fontSize: 11, color: "rgba(148,163,184,0.9)" }}>
                Each file is uploaded; stored URLs are appended to this project.
              </span>
            </div>
            {(state.extraImages ?? []).map((_, idx) =>
              errors[`extra_${idx}`] ? (
                <div key={`err_${idx}`} style={{ fontSize: 11, color: "#f87171", marginBottom: 4 }}>
                  {errors[`extra_${idx}`]}
                </div>
              ) : null,
            )}
            {(state.extraImages?.length ?? 0) > 0 && (
              <div
                style={{
                  marginTop: 8,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0,1fr))",
                  gap: 6,
                }}
              >
                {(state.extraImages ?? []).map((img, idx) => (
                  <div
                    key={`${img}-${idx}`}
                    style={{
                      position: "relative",
                      borderRadius: 10,
                      overflow: "hidden",
                      border: "1px solid rgba(148,163,184,0.5)",
                    }}
                  >
                    <img
                      src={img}
                      alt=""
                      style={{ width: "100%", height: 72, objectFit: "cover" }}
                    />
                    <button
                      type="button"
                      onClick={() => removeExtraImage(idx)}
                      style={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        width: 18,
                        height: 18,
                        borderRadius: 999,
                        border: "none",
                        background: "rgba(15,23,42,0.85)",
                        color: "#f97373",
                        fontSize: 11,
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 7. GitHub Link */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ marginBottom: 4, fontSize: 12, fontWeight: 600 }}>
              <span>GitHub Link</span>
              <span style={{ color: "rgba(148,163,184,0.9)", marginLeft: 4 }}>(optional)</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderRadius: 12,
                border: "1px solid rgba(148,163,184,0.4)",
                background: "rgba(15,23,42,0.85)",
                padding: "6px 10px",
                gap: 6,
              }}
            >
              <span style={{ fontSize: 15 }}>🐙</span>
              <input
                value={state.githubLink}
                onChange={(e) => setState({ ...state, githubLink: e.target.value })}
                placeholder="https://github.com/username/repo"
                style={{
                  flex: 1,
                  border: "none",
                  background: "transparent",
                  color: "#e5e7eb",
                  fontSize: 13,
                }}
              />
            </div>
          </div>

          {/* 8. Live Demo Link */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ marginBottom: 4, fontSize: 12, fontWeight: 600 }}>
              <span>Live Demo Link</span>
              <span style={{ color: "rgba(148,163,184,0.9)", marginLeft: 4 }}>(optional)</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderRadius: 12,
                border: "1px solid rgba(148,163,184,0.4)",
                background: "rgba(15,23,42,0.85)",
                padding: "6px 10px",
                gap: 6,
              }}
            >
              <span style={{ fontSize: 14 }}>↗</span>
              <input
                value={state.liveDemoLink}
                onChange={(e) => setState({ ...state, liveDemoLink: e.target.value })}
                placeholder="https://your-demo.vercel.app"
                style={{
                  flex: 1,
                  border: "none",
                  background: "transparent",
                  color: "#e5e7eb",
                  fontSize: 13,
                }}
              />
            </div>
          </div>

          {/* 9. Tech Stack */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ marginBottom: 4, fontSize: 12, fontWeight: 600 }}>
              <span>Tech Stack</span>
              <span style={{ color: "rgba(148,163,184,0.9)", marginLeft: 4 }}>(optional)</span>
            </div>
            <div
              style={{
                borderRadius: 12,
                border: "1px solid rgba(148,163,184,0.4)",
                background: "rgba(15,23,42,0.85)",
                padding: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginBottom: 6,
                }}
              >
                {stack.map((t) => (
                  <span
                    key={t}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "2px 8px",
                      borderRadius: 999,
                      border: "1px solid rgba(96,165,250,0.5)",
                      background: "rgba(37,99,235,0.16)",
                      fontSize: 11,
                      color: "#bfdbfe",
                    }}
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      style={{
                        border: "none",
                        background: "transparent",
                        color: "rgba(248,113,113,0.9)",
                        fontSize: 10,
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                value={stackInput}
                onChange={(e) => setStackInput(e.target.value)}
                onKeyDown={onStackKeyDown}
                placeholder="Type a technology and press Enter"
                style={{
                  width: "100%",
                  border: "none",
                  background: "transparent",
                  color: "#e5e7eb",
                  fontSize: 13,
                }}
              />
            </div>
          </div>

          {/* 10. Featured Toggle */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>Featured Project</div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(148,163,184,0.95)",
                    marginTop: 2,
                  }}
                >
                  Featured projects appear first on portfolio
                </div>
              </div>
              <button
                type="button"
                onClick={() => setState({ ...state, featured: !state.featured })}
                style={{
                  width: 40,
                  height: 22,
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.6)",
                  background: state.featured
                    ? "linear-gradient(135deg, #4F8EF7, #7C3AED)"
                    : "rgba(15,23,42,0.9)",
                  padding: 0,
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    left: state.featured ? 20 : 2,
                    width: 16,
                    height: 16,
                    borderRadius: "999px",
                    background: "#f9fafb",
                    boxShadow: "0 2px 6px rgba(15,23,42,0.6)",
                    transition: "left 160ms ease",
                  }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "10px 16px",
            borderTop: "1px solid rgba(148,163,184,0.25)",
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              border: "1px solid rgba(148,163,184,0.6)",
              background: "transparent",
              color: "#e5e7eb",
              fontSize: 13,
              minWidth: 90,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={saving}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              border: "1px solid rgba(59,130,246,0.9)",
              background: "linear-gradient(135deg, #4F8EF7, #7C3AED)",
              color: "#f9fafb",
              fontSize: 13,
              fontWeight: 600,
              minWidth: 110,
              cursor: saving ? "default" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              opacity: saving ? 0.8 : 1,
            }}
          >
            {saving && (
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "999px",
                  border: "2px solid rgba(219,234,254,0.5)",
                  borderTopColor: "#fff",
                  animation: "spin 0.8s linear infinite",
                }}
              />
            )}
            {saving ? "Saving..." : "Save Project"}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function SkillModal({
  item,
  onClose,
  onSave,
}: {
  item: SkillItem;
  onClose: () => void;
  onSave: (item: SkillItem) => void | Promise<void>;
}) {
  const [state, setState] = useState(item);
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    setSaving(true);
    try {
      await Promise.resolve(onSave(state));
    } finally {
      setSaving(false);
    }
  };
  return (
    <BaseModal onClose={onClose}>
      <input value={state.name} onChange={(e) => setState({ ...state, name: e.target.value })} placeholder="Skill Name" style={{ width: "100%", marginBottom: 8 }} />
      <input value={state.icon} onChange={(e) => setState({ ...state, icon: e.target.value })} placeholder="Optional: emoji or image URL (known tools use logos from name/ID)" style={{ width: "100%", marginBottom: 8 }} />
      <select value={state.category} onChange={(e) => setState({ ...state, category: e.target.value as SkillItem["category"] })} style={{ width: "100%", marginBottom: 8 }}>
        <option>Frontend</option><option>Backend</option><option>DevOps</option><option>Tools</option>
      </select>
      <input value={state.shortDescription} onChange={(e) => setState({ ...state, shortDescription: e.target.value })} placeholder="Short Description" style={{ width: "100%", marginBottom: 8 }} />
      <select value={state.proficiency} onChange={(e) => setState({ ...state, proficiency: e.target.value as SkillItem["proficiency"] })} style={{ width: "100%", marginBottom: 8 }}>
        <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
      </select>
      <button type="button" disabled={saving} onClick={() => void submit()}>
        {saving ? "Saving..." : "Save"}
      </button>
    </BaseModal>
  );
}

function ExperienceModal({
  item,
  onClose,
  onSave,
}: {
  item: ExperienceItem;
  onClose: () => void;
  onSave: (item: ExperienceItem) => void | Promise<void>;
}) {
  const [state, setState] = useState(item);
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    const le = imageRefError("Company logo", state.logo, false);
    if (le) {
      pushAdminToast("error", le);
      return;
    }
    setSaving(true);
    try {
      await Promise.resolve(onSave(state));
    } finally {
      setSaving(false);
    }
  };
  return (
    <BaseModal onClose={onClose}>
      <input value={state.companyName} onChange={(e) => setState({ ...state, companyName: e.target.value })} placeholder="Company Name" style={{ width: "100%", marginBottom: 8 }} />
      <input value={state.role} onChange={(e) => setState({ ...state, role: e.target.value })} placeholder="Role" style={{ width: "100%", marginBottom: 8 }} />
      <input value={state.startDate} onChange={(e) => setState({ ...state, startDate: e.target.value })} placeholder="Start Date" style={{ width: "100%", marginBottom: 8 }} />
      <input value={state.endDate} onChange={(e) => setState({ ...state, endDate: e.target.value })} placeholder="End Date" style={{ width: "100%", marginBottom: 8 }} />
      <label style={{ display: "block", marginBottom: 8 }}>
        <input type="checkbox" checked={state.present} onChange={(e) => setState({ ...state, present: e.target.checked })} /> Present
      </label>
      <textarea value={state.description} onChange={(e) => setState({ ...state, description: e.target.value })} placeholder="Description" style={{ width: "100%", minHeight: 80, marginBottom: 8 }} />
      <ImageUploadField
        label="Company logo"
        value={state.logo}
        onChange={(v) => setState({ ...state, logo: v })}
      />
      <button type="button" disabled={saving} onClick={() => void submit()} style={{ marginTop: 10 }}>
        {saving ? "Saving..." : "Save"}
      </button>
    </BaseModal>
  );
}

function EducationModal({
  item,
  onClose,
  onSave,
}: {
  item: EducationItem;
  onClose: () => void;
  onSave: (item: EducationItem) => void | Promise<void>;
}) {
  const [state, setState] = useState(item);
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    const le = imageRefError("Institution logo", state.logo, false);
    if (le) {
      pushAdminToast("error", le);
      return;
    }
    setSaving(true);
    try {
      await Promise.resolve(onSave(state));
    } finally {
      setSaving(false);
    }
  };
  return (
    <BaseModal onClose={onClose}>
      <input value={state.institutionName} onChange={(e) => setState({ ...state, institutionName: e.target.value })} placeholder="Institution Name" style={{ width: "100%", marginBottom: 8 }} />
      <input value={state.degree} onChange={(e) => setState({ ...state, degree: e.target.value })} placeholder="Degree" style={{ width: "100%", marginBottom: 8 }} />
      <input value={state.startDate} onChange={(e) => setState({ ...state, startDate: e.target.value })} placeholder="Start Date" style={{ width: "100%", marginBottom: 8 }} />
      <input value={state.endDate} onChange={(e) => setState({ ...state, endDate: e.target.value })} placeholder="End Date" style={{ width: "100%", marginBottom: 8 }} />
      <label style={{ display: "block", marginBottom: 8 }}>
        <input type="checkbox" checked={state.present} onChange={(e) => setState({ ...state, present: e.target.checked })} /> Present
      </label>
      <textarea value={state.description} onChange={(e) => setState({ ...state, description: e.target.value })} placeholder="Description" style={{ width: "100%", minHeight: 80, marginBottom: 8 }} />
      <ImageUploadField
        label="Institution logo"
        value={state.logo}
        onChange={(v) => setState({ ...state, logo: v })}
      />
      <button type="button" disabled={saving} onClick={() => void submit()} style={{ marginTop: 10 }}>
        {saving ? "Saving..." : "Save"}
      </button>
    </BaseModal>
  );
}

export function AdminRoutes() {
  return (
    <Routes>
      {/* /admin/login (handled by parent /admin/* route) */}
      <Route path="login" element={<LoginPage />} />

      {/* Protected admin shell at /admin and /admin/* */}
      <Route element={<AdminGuard />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="experience" element={<ExperiencePage />} />
          <Route path="education" element={<EducationPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="hero" element={<HeroPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
      </Route>

      {/* Fallback: anything under /admin/* goes to /admin (Dashboard or login via guard) */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

export function DevAdminFloatingButton() {
  if (import.meta.env.MODE !== "development") return null;
  return (
    <Link
      to="/admin"
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 1200,
        textDecoration: "none",
        color: "#fff",
        borderRadius: 999,
        border: "1px solid rgba(79,142,247,0.4)",
        background: "rgba(79,142,247,0.2)",
        padding: "10px 14px",
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      Admin
    </Link>
  );
}

