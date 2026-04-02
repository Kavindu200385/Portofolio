import { motion } from "motion/react";

const techLogos = [
  "Docker",
  "Kubernetes",
  "AWS",
  "Terraform",
  "React",
  "TailwindCSS",
  "Next.js",
  "Node.js",
  "NestJS",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "GitHub",
  "GitHub Actions",
  "ArgoCD",
  "cPanel",
  "Nginx",
  "Linux",
  "Figma",
  "Cursor",
  "Go",
  "TypeScript",
  "Python",
  "Grafana",
];

const stackGroups = [
  {
    category: "Frontend",
    color: "#00F0FF",
    items: [
      { name: "React", emoji: "⚛" },
      { name: "Next.js", emoji: "▲" },
      { name: "TypeScript", emoji: "TS" },
      { name: "TailwindCSS", emoji: "🎨" },
      { name: "Storybook", emoji: "📖" },
      { name: "Vite", emoji: "⚡" },
      { name: "Figma", emoji: "✏️" },
      { name: "Cursor", emoji: "⌨️" },
    ],
  },
  {
    category: "Backend",
    color: "#A3FF47",
    items: [
      { name: "Go", emoji: "🐹" },
      { name: "Node.js", emoji: "🟢" },
      { name: "FastAPI", emoji: "🚀" },
      { name: "PostgreSQL", emoji: "🐘" },
      { name: "MySQL", emoji: "🐬" },
      { name: "Redis", emoji: "🔴" },
      { name: "Kafka", emoji: "⚙" },
      { name: "NestJS", emoji: "🦉" },
    ],
  },
  {
    category: "DevOps & Cloud",
    color: "#FF6BFF",
    items: [
      { name: "Kubernetes", emoji: "☸" },
      { name: "Docker", emoji: "🐳" },
      { name: "Terraform", emoji: "🏗" },
      { name: "AWS", emoji: "☁" },
      { name: "ArgoCD", emoji: "🔄" },
      { name: "GitHub", emoji: "🐙" },
      { name: "GitHub Actions", emoji: "⚙️" },
      { name: "Prometheus", emoji: "🔥" },
      { name: "cPanel", emoji: "🛠️" },
    ],
  },
];

function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
      <div
        className="flex gap-8 whitespace-nowrap"
        style={{
          animation: `marquee-${reverse ? "reverse" : "forward"} 30s linear infinite`,
          width: "max-content",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.animationPlayState = "paused")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.animationPlayState = "running")}
      >
        {doubled.map((tech, i) => (
          <span
            key={i}
            className="flex items-center gap-2 px-5 py-3 rounded-xl shrink-0"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.78rem",
              color: "#7A7A8C",
              background: "#0F0F1A",
              border: "1px solid rgba(255,255,255,0.06)",
              letterSpacing: "0.04em",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.2)" }}
            />
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

export function TechStack() {
  return (
    <section id="stack" style={{ background: "#060610", padding: "100px 0" }}>
      {/* Section header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.75rem",
              color: "#00F0FF",
              letterSpacing: "0.15em",
            }}
          >
            03. STACK
          </span>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              color: "#EDEAE4",
              marginTop: "0.5rem",
              lineHeight: 1.1,
            }}
          >
            Tools I{" "}
            <span style={{ color: "#00F0FF" }}>trust.</span>
          </h2>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="space-y-4 mb-20">
        <MarqueeRow items={techLogos} />
        <MarqueeRow items={[...techLogos].reverse()} reverse />
      </div>

      {/* Icon grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stackGroups.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: gi * 0.1 }}
              className="rounded-2xl p-6"
              style={{
                background: "#0F0F1A",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: group.color, boxShadow: `0 0 8px ${group.color}` }}
                />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.7rem",
                    color: group.color,
                    letterSpacing: "0.12em",
                  }}
                >
                  {group.category.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {group.items.map((item, ii) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: gi * 0.1 + ii * 0.04 }}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <span style={{ fontSize: "0.9rem" }}>{item.emoji}</span>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.72rem",
                        color: "#EDEAE4",
                      }}
                    >
                      {item.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-forward {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
