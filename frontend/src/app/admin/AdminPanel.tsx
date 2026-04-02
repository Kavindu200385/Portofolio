import { FormEvent, useEffect, useState } from "react";
import { Link, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router";
import {
  clearAdminToken,
  getAdminToken,
  setAdminToken,
  TOAST_EVENT,
  usePortfolioData,
  type EducationItem,
  type ExperienceItem,
  type ProjectItem,
  type SkillItem,
} from "../data/portfolioData";
import { SkillIcon } from "../components/skillIcons";

function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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

  useEffect(() => {
    const handler = (ev: Event) => {
      const ce = ev as CustomEvent<{ type: string; message: string }>;
      if (ce.detail?.message) {
        setToast(ce.detail.message);
        setTimeout(() => setToast(""), 1800);
      }
    };
    window.addEventListener(TOAST_EVENT, handler);
    return () => window.removeEventListener(TOAST_EVENT, handler);
  }, []);
  return (
    <div style={{ minHeight: "100vh", background: "#080810", color: "#fff", padding: 20 }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
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
        <div style={{ position: "fixed", right: 16, bottom: 16, zIndex: 2000, ...sectionCardStyle(), padding: "10px 14px", borderColor: "rgba(16,185,129,0.35)", color: "#bbf7d0", fontSize: 12 }}>
          {toast}
        </div>
      ) : null}
      <style>{`
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
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#080810", color: "#fff" }}>
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
  const { data, loading } = usePortfolioData();
  if (loading) return <Skeleton />;
  const stats = [
    ["Total Projects", data.projects.length],
    ["Total Skills", data.skills.length],
    ["Total Experience", data.experiences.length],
    ["Total Education", data.education.length],
  ];
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

function resetButton(onClick: () => void) {
  return (
    <button onClick={onClick} style={{ borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#fff", padding: "8px 10px", fontSize: 12 }}>
      Reset to Default
    </button>
  );
}

function ProjectsPage() {
  const { data, save, resetSection, loading } = usePortfolioData();
  const [editing, setEditing] = useState<ProjectItem | null>(null);
  if (loading) return <Skeleton />;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <button onClick={() => setEditing({ id: `p_${Date.now()}`, name: "", type: "Individual", shortDescription: "", longDescription: "", thumbnail: "", githubLink: "", liveDemoLink: "", techStack: [], featured: false })} style={{ borderRadius: 10, border: "1px solid rgba(79,142,247,0.35)", background: "rgba(79,142,247,0.15)", color: "#fff", padding: "8px 12px" }}>Add Project</button>
        {resetButton(() => resetSection("projects"))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12 }}>
        {data.projects.map((p) => (
          <div key={p.id} style={{ ...sectionCardStyle(), overflow: "hidden" }}>
            <img src={p.thumbnail} style={{ width: "100%", height: 120, objectFit: "cover" }} />
            <div style={{ padding: 12 }}>
              <div style={{ fontWeight: 700 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{p.type}</div>
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <button onClick={() => setEditing(p)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "#fff" }}>Edit</button>
                <button onClick={() => window.confirm("Delete project?") && save({ ...data, projects: data.projects.filter((x) => x.id !== p.id) }, `Deleted project ${p.name}`)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(248,113,113,0.4)", background: "rgba(248,113,113,0.12)", color: "#fecaca" }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {editing ? <ProjectModal item={editing} onClose={() => setEditing(null)} onSave={(item) => {
        const exists = data.projects.some((p) => p.id === item.id);
        save({ ...data, projects: exists ? data.projects.map((p) => (p.id === item.id ? item : p)) : [item, ...data.projects] }, `${exists ? "Updated" : "Added"} project ${item.name}`);
        setEditing(null);
      }} /> : null}
    </div>
  );
}

function SkillsPage() {
  const { data, save, resetSection, loading } = usePortfolioData();
  const [editing, setEditing] = useState<SkillItem | null>(null);
  if (loading) return <Skeleton />;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <button onClick={() => setEditing({ id: `s_${Date.now()}`, name: "", icon: "", category: "Tools", shortDescription: "", proficiency: "Intermediate", color: "#4F8EF7", size: "normal" })} style={{ borderRadius: 10, border: "1px solid rgba(79,142,247,0.35)", background: "rgba(79,142,247,0.15)", color: "#fff", padding: "8px 12px" }}>Add Skill</button>
        {resetButton(() => resetSection("skills"))}
      </div>
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
              <button onClick={() => idx > 0 && save({ ...data, skills: data.skills.map((x, i, arr) => (i === idx - 1 ? arr[idx] : i === idx ? arr[idx - 1] : x)) }, `Reordered skill ${s.name}`)}>↑</button>
              <button onClick={() => idx < data.skills.length - 1 && save({ ...data, skills: data.skills.map((x, i, arr) => (i === idx + 1 ? arr[idx] : i === idx ? arr[idx + 1] : x)) }, `Reordered skill ${s.name}`)}>↓</button>
              <button onClick={() => setEditing(s)}>Edit</button>
              <button onClick={() => window.confirm("Delete skill?") && save({ ...data, skills: data.skills.filter((x) => x.id !== s.id) }, `Deleted skill ${s.name}`)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {editing ? <SkillModal item={editing} onClose={() => setEditing(null)} onSave={(item) => {
        const exists = data.skills.some((s) => s.id === item.id);
        save({ ...data, skills: exists ? data.skills.map((s) => (s.id === item.id ? item : s)) : [item, ...data.skills] }, `${exists ? "Updated" : "Added"} skill ${item.name}`);
        setEditing(null);
      }} /> : null}
    </div>
  );
}

function ExperiencePage() {
  const { data, save, resetSection, loading } = usePortfolioData();
  const [editing, setEditing] = useState<ExperienceItem | null>(null);
  if (loading) return <Skeleton />;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <button onClick={() => setEditing({ id: `e_${Date.now()}`, companyName: "", role: "", startDate: "", endDate: "", present: false, description: "", logo: "💼", side: "left" })} style={{ borderRadius: 10, border: "1px solid rgba(79,142,247,0.35)", background: "rgba(79,142,247,0.15)", color: "#fff", padding: "8px 12px" }}>Add Experience</button>
        {resetButton(() => resetSection("experiences"))}
      </div>
      {data.experiences.map((e, idx) => (
        <div key={e.id} style={{ ...sectionCardStyle(), padding: 12, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>{e.logo} {e.companyName} — {e.role}</div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => idx > 0 && save({ ...data, experiences: data.experiences.map((x, i, arr) => (i === idx - 1 ? arr[idx] : i === idx ? arr[idx - 1] : x)) }, `Reordered experience ${e.companyName}`)}>↑</button>
            <button onClick={() => idx < data.experiences.length - 1 && save({ ...data, experiences: data.experiences.map((x, i, arr) => (i === idx + 1 ? arr[idx] : i === idx ? arr[idx + 1] : x)) }, `Reordered experience ${e.companyName}`)}>↓</button>
            <button onClick={() => setEditing(e)}>Edit</button>
            <button onClick={() => window.confirm("Delete experience?") && save({ ...data, experiences: data.experiences.filter((x) => x.id !== e.id) }, `Deleted experience ${e.companyName}`)}>Delete</button>
          </div>
        </div>
      ))}
      {editing ? <ExperienceModal item={editing} onClose={() => setEditing(null)} onSave={(item) => {
        const exists = data.experiences.some((x) => x.id === item.id);
        save({ ...data, experiences: exists ? data.experiences.map((x) => (x.id === item.id ? item : x)) : [item, ...data.experiences] }, `${exists ? "Updated" : "Added"} experience ${item.companyName}`);
        setEditing(null);
      }} /> : null}
    </div>
  );
}

function EducationPage() {
  const { data, save, resetSection, loading } = usePortfolioData();
  const [editing, setEditing] = useState<EducationItem | null>(null);
  if (loading) return <Skeleton />;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <button onClick={() => setEditing({ id: `ed_${Date.now()}`, institutionName: "", degree: "", startDate: "", endDate: "", present: false, description: "", logo: "🎓", side: "right" })} style={{ borderRadius: 10, border: "1px solid rgba(79,142,247,0.35)", background: "rgba(79,142,247,0.15)", color: "#fff", padding: "8px 12px" }}>Add Education</button>
        {resetButton(() => resetSection("education"))}
      </div>
      {data.education.map((e, idx) => (
        <div key={e.id} style={{ ...sectionCardStyle(), padding: 12, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>{e.logo} {e.institutionName}</div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => idx > 0 && save({ ...data, education: data.education.map((x, i, arr) => (i === idx - 1 ? arr[idx] : i === idx ? arr[idx - 1] : x)) }, `Reordered education ${e.institutionName}`)}>↑</button>
            <button onClick={() => idx < data.education.length - 1 && save({ ...data, education: data.education.map((x, i, arr) => (i === idx + 1 ? arr[idx] : i === idx ? arr[idx + 1] : x)) }, `Reordered education ${e.institutionName}`)}>↓</button>
            <button onClick={() => setEditing(e)}>Edit</button>
            <button onClick={() => window.confirm("Delete education?") && save({ ...data, education: data.education.filter((x) => x.id !== e.id) }, `Deleted education ${e.institutionName}`)}>Delete</button>
          </div>
        </div>
      ))}
      {editing ? <EducationModal item={editing} onClose={() => setEditing(null)} onSave={(item) => {
        const exists = data.education.some((x) => x.id === item.id);
        save({ ...data, education: exists ? data.education.map((x) => (x.id === item.id ? item : x)) : [item, ...data.education] }, `${exists ? "Updated" : "Added"} education ${item.institutionName}`);
        setEditing(null);
      }} /> : null}
    </div>
  );
}

function AboutPage() {
  const { data, save, resetSection, loading } = usePortfolioData();
  const [local, setLocal] = useState(data.about);
  useEffect(() => setLocal(data.about), [data.about]);
  if (loading) return <Skeleton />;
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
        <input type="file" accept="image/*" onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setLocal({ ...local, profilePhoto: await readAsBase64(f) });
        }} />
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={() => save({ ...data, about: local }, "Updated About Me")} style={{ padding: "8px 12px" }}>Save</button>
        {resetButton(() => resetSection("about"))}
      </div>
    </div>
  );
}

function HeroPage() {
  const { data, save, resetSection, loading } = usePortfolioData();
  const [hero, setHero] = useState(data.hero);
  useEffect(() => setHero(data.hero), [data.hero]);
  if (loading) return <Skeleton />;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <div style={{ ...sectionCardStyle(), padding: 16 }}>
        <input value={hero.heading} onChange={(e) => setHero({ ...hero, heading: e.target.value })} style={{ width: "100%", marginBottom: 8 }} />
        <input value={hero.subHeading} onChange={(e) => setHero({ ...hero, subHeading: e.target.value })} style={{ width: "100%", marginBottom: 8 }} />
        <input value={hero.cta1Label} onChange={(e) => setHero({ ...hero, cta1Label: e.target.value })} style={{ width: "100%", marginBottom: 8 }} />
        <input value={hero.cta1Link} onChange={(e) => setHero({ ...hero, cta1Link: e.target.value })} style={{ width: "100%", marginBottom: 8 }} />
        <input value={hero.cta2Label} onChange={(e) => setHero({ ...hero, cta2Label: e.target.value })} style={{ width: "100%", marginBottom: 8 }} />
        <input value={hero.cta2Link} onChange={(e) => setHero({ ...hero, cta2Link: e.target.value })} style={{ width: "100%", marginBottom: 8 }} />
        <input type="file" accept="image/*" onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setHero({ ...hero, heroPhoto: await readAsBase64(f) });
        }} />
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button onClick={() => save({ ...data, hero }, "Updated Hero section")}>Save</button>
          {resetButton(() => resetSection("hero"))}
        </div>
      </div>
      <div style={{ ...sectionCardStyle(), padding: 16 }}>
        <h3>{hero.heading}</h3>
        <p>{hero.subHeading}</p>
        <img src={hero.heroPhoto} style={{ width: 140, height: 140, objectFit: "cover", borderRadius: "50%" }} />
      </div>
    </div>
  );
}

function ContactPage() {
  const { data, save, resetSection, loading } = usePortfolioData();
  const [contact, setContact] = useState(data.contact);
  useEffect(() => setContact(data.contact), [data.contact]);
  if (loading) return <Skeleton />;
  return (
    <div style={{ ...sectionCardStyle(), padding: 16 }}>
      {(["email", "whatsapp", "linkedin", "github", "phone", "heading", "description"] as const).map((k) => (
        <input key={k} value={contact[k]} onChange={(e) => setContact({ ...contact, [k]: e.target.value })} style={{ width: "100%", marginBottom: 8 }} />
      ))}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => save({ ...data, contact }, "Updated Contact info")}>Save</button>
        {resetButton(() => resetSection("contact"))}
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

function ProjectModal({ item, onClose, onSave }: { item: ProjectItem; onClose: () => void; onSave: (item: ProjectItem) => void }) {
  const [state, setState] = useState(item);
  const [stack, setStack] = useState(item.techStack.join(", "));
  return (
    <BaseModal onClose={onClose}>
      <input value={state.name} onChange={(e) => setState({ ...state, name: e.target.value })} placeholder="Project Name" style={{ width: "100%", marginBottom: 8 }} />
      <select value={state.type} onChange={(e) => setState({ ...state, type: e.target.value as ProjectItem["type"] })} style={{ width: "100%", marginBottom: 8 }}>
        <option>Group</option><option>Individual</option><option>Research</option>
      </select>
      <input value={state.shortDescription} onChange={(e) => setState({ ...state, shortDescription: e.target.value })} placeholder="Short Description" style={{ width: "100%", marginBottom: 8 }} />
      <textarea value={state.longDescription} onChange={(e) => setState({ ...state, longDescription: e.target.value })} placeholder="Long Description" style={{ width: "100%", minHeight: 80, marginBottom: 8 }} />
      <input value={state.githubLink} onChange={(e) => setState({ ...state, githubLink: e.target.value })} placeholder="GitHub Link" style={{ width: "100%", marginBottom: 8 }} />
      <input value={state.liveDemoLink} onChange={(e) => setState({ ...state, liveDemoLink: e.target.value })} placeholder="Live Demo Link" style={{ width: "100%", marginBottom: 8 }} />
      <input value={stack} onChange={(e) => setStack(e.target.value)} placeholder="Tech Stack (comma separated)" style={{ width: "100%", marginBottom: 8 }} />
      <label style={{ display: "block", marginBottom: 8 }}><input type="checkbox" checked={state.featured} onChange={(e) => setState({ ...state, featured: e.target.checked })} /> Featured</label>
      <input type="file" accept="image/*" onChange={async (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setState({ ...state, thumbnail: await readAsBase64(f) });
      }} />
      <button onClick={() => onSave({ ...state, techStack: stack.split(",").map((x) => x.trim()).filter(Boolean) })} style={{ marginTop: 10 }}>Save</button>
    </BaseModal>
  );
}

function SkillModal({ item, onClose, onSave }: { item: SkillItem; onClose: () => void; onSave: (item: SkillItem) => void }) {
  const [state, setState] = useState(item);
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
      <button onClick={() => onSave(state)}>Save</button>
    </BaseModal>
  );
}

function ExperienceModal({ item, onClose, onSave }: { item: ExperienceItem; onClose: () => void; onSave: (item: ExperienceItem) => void }) {
  const [state, setState] = useState(item);
  return (
    <BaseModal onClose={onClose}>
      <input value={state.companyName} onChange={(e) => setState({ ...state, companyName: e.target.value })} placeholder="Company Name" style={{ width: "100%", marginBottom: 8 }} />
      <input value={state.role} onChange={(e) => setState({ ...state, role: e.target.value })} placeholder="Role" style={{ width: "100%", marginBottom: 8 }} />
      <input value={state.startDate} onChange={(e) => setState({ ...state, startDate: e.target.value })} placeholder="Start Date" style={{ width: "100%", marginBottom: 8 }} />
      <input value={state.endDate} onChange={(e) => setState({ ...state, endDate: e.target.value })} placeholder="End Date" style={{ width: "100%", marginBottom: 8 }} />
      <label style={{ display: "block", marginBottom: 8 }}><input type="checkbox" checked={state.present} onChange={(e) => setState({ ...state, present: e.target.checked })} /> Present</label>
      <textarea value={state.description} onChange={(e) => setState({ ...state, description: e.target.value })} placeholder="Description" style={{ width: "100%", minHeight: 80, marginBottom: 8 }} />
      <input type="file" accept="image/*" onChange={async (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setState({ ...state, logo: await readAsBase64(f) });
      }} />
      <button onClick={() => onSave(state)} style={{ marginTop: 10 }}>Save</button>
    </BaseModal>
  );
}

function EducationModal({ item, onClose, onSave }: { item: EducationItem; onClose: () => void; onSave: (item: EducationItem) => void }) {
  const [state, setState] = useState(item);
  return (
    <BaseModal onClose={onClose}>
      <input value={state.institutionName} onChange={(e) => setState({ ...state, institutionName: e.target.value })} placeholder="Institution Name" style={{ width: "100%", marginBottom: 8 }} />
      <input value={state.degree} onChange={(e) => setState({ ...state, degree: e.target.value })} placeholder="Degree" style={{ width: "100%", marginBottom: 8 }} />
      <input value={state.startDate} onChange={(e) => setState({ ...state, startDate: e.target.value })} placeholder="Start Date" style={{ width: "100%", marginBottom: 8 }} />
      <input value={state.endDate} onChange={(e) => setState({ ...state, endDate: e.target.value })} placeholder="End Date" style={{ width: "100%", marginBottom: 8 }} />
      <label style={{ display: "block", marginBottom: 8 }}><input type="checkbox" checked={state.present} onChange={(e) => setState({ ...state, present: e.target.checked })} /> Present</label>
      <textarea value={state.description} onChange={(e) => setState({ ...state, description: e.target.value })} placeholder="Description" style={{ width: "100%", minHeight: 80, marginBottom: 8 }} />
      <input type="file" accept="image/*" onChange={async (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setState({ ...state, logo: await readAsBase64(f) });
      }} />
      <button onClick={() => onSave(state)} style={{ marginTop: 10 }}>Save</button>
    </BaseModal>
  );
}

function AdminHomeRedirect() {
  return <Navigate to="/admin" replace />;
}

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin/login" element={<LoginPage />} />
      <Route element={<AdminGuard />}>
        <Route path="/admin" element={<AdminLayout />}>
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
      <Route path="*" element={<AdminHomeRedirect />} />
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

