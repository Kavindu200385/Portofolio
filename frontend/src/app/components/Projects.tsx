import { useState } from "react";
import { motion } from "motion/react";
import { Github, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const projects = [
  {
    id: 1,
    name: "KubeFlow Ops",
    desc: "End-to-end GitOps platform for Kubernetes with real-time cluster health monitoring and auto-scaling policies.",
    stack: ["Go", "Kubernetes", "ArgoCD", "Prometheus"],
    image: "https://images.unsplash.com/photo-1667372459470-5f61c93c6d3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrdWJlcm5ldGVzJTIwY2xvdWQlMjBpbmZyYXN0cnVjdHVyZSUyMGRhcmslMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzc1MTA1ODcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    large: true,
    github: "#",
    live: "#",
  },
  {
    id: 2,
    name: "Axiom Analytics",
    desc: "Real-time SaaS analytics dashboard. 50M+ events/day, sub-100ms query latency with ClickHouse backend.",
    stack: ["React", "TypeScript", "ClickHouse", "Redis"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWFzJTIwZGFzaGJvYXJkJTIwZGFyayUyMGFuYWx5dGljcyUyMHVpfGVufDF8fHx8MTc3NTEwNTg3OXww&ixlib=rb-4.1.0&q=80&w=1080",
    large: true,
    github: "#",
    live: "#",
  },
  {
    id: 3,
    name: "NightWatch",
    desc: "Distributed incident detection & alerting engine. PagerDuty alternative built on event streams.",
    stack: ["Python", "Kafka", "FastAPI"],
    image: "https://images.unsplash.com/photo-1749581134865-6b8255950548?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwc2VydmVyJTIwbmV0d29yayUyMGRhdGElMjBjZW50ZXIlMjBnbG93fGVufDF8fHx8MTc3NTEwNTg3OXww&ixlib=rb-4.1.0&q=80&w=1080",
    large: false,
    github: "#",
    live: "#",
  },
  {
    id: 4,
    name: "DevShell",
    desc: "Cloud-based dev environment provisioner. Spin up full Nix shells in under 10s.",
    stack: ["Nix", "Terraform", "AWS", "Go"],
    image: "https://images.unsplash.com/photo-1759661881353-5b9cc55e1cf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwY29kZSUyMHRlcm1pbmFsJTIwc2NyZWVuJTIwbmlnaHR8ZW58MXx8fHwxNzc1MTA1ODcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    large: false,
    github: "#",
    live: "#",
  },
  {
    id: 5,
    name: "Cipher API",
    desc: "Zero-trust API gateway with mTLS, rate limiting, and distributed tracing at 1M req/min.",
    stack: ["Nginx", "Golang", "Jaeger", "Vault"],
    image: "https://images.unsplash.com/photo-1645395758741-c23bb12d9d6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwYWJzdHJhY3QlMjBjaXJjdWl0JTIwcHVycGxlJTIwZ2xvd3xlbnwxfHx8fDE3NzUxMDU4NzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    large: false,
    github: "#",
    live: "#",
  },
  {
    id: 6,
    name: "NeonGrid UI",
    desc: "Open-source design system for developer tools — 80+ components, dark-first, Radix-based.",
    stack: ["React", "Storybook", "Radix UI"],
    image: "https://images.unsplash.com/photo-1764268602042-88b05a211378?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjB0ZWNoJTIwZ2VvbWV0cmljJTIwYmx1ZSUyMG5lb258ZW58MXx8fHwxNzc1MTA1ODY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    large: false,
    github: "#",
    live: "#",
  },
];

function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`relative rounded-2xl overflow-hidden cursor-pointer ${project.large ? "lg:col-span-2" : ""}`}
      style={{
        background: "#0F0F1A",
        border: hovered ? "1px solid rgba(0,240,255,0.4)" : "1px solid rgba(255,255,255,0.06)",
        boxShadow: hovered ? "0 0 40px rgba(0,240,255,0.12)" : "none",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        minHeight: project.large ? "320px" : "240px",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor-hover
    >
      {/* Background image */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ opacity: hovered ? 0.25 : 0.1 }}
      >
        <ImageWithFallback
          src={project.image}
          alt={project.name}
          className="w-full h-full object-cover"
          style={{ filter: "saturate(0.5) brightness(0.6)" }}
        />
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(15,15,26,0.9) 0%, rgba(15,15,26,0.6) 100%)" }}
      />

      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-3">
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: project.large ? "1.5rem" : "1.1rem",
                color: "#EDEAE4",
              }}
            >
              {project.name}
            </h3>

            {/* Links — appear on hover */}
            <div
              className="flex gap-2 transition-all duration-200"
              style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(-4px)" }}
            >
              <a
                href={project.github}
                className="flex items-center justify-center w-8 h-8 rounded-lg"
                style={{ background: "rgba(255,255,255,0.08)", color: "#EDEAE4" }}
                data-cursor-hover
              >
                <Github size={14} />
              </a>
              <a
                href={project.live}
                className="flex items-center justify-center w-8 h-8 rounded-lg"
                style={{ background: "rgba(0,240,255,0.1)", color: "#00F0FF" }}
                data-cursor-hover
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <p
            className="mb-4"
            style={{
              color: "#7A7A8C",
              fontSize: "0.85rem",
              lineHeight: 1.6,
              maxWidth: "480px",
            }}
          >
            {project.desc}
          </p>
        </div>

        {/* Stack badges */}
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-lg"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                color: "#A3FF47",
                border: "1px solid rgba(163,255,71,0.3)",
                background: "rgba(163,255,71,0.05)",
                letterSpacing: "0.05em",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Projects() {
  return (
    <section id="work" style={{ background: "#080810", padding: "100px 0" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-12"
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.75rem",
              color: "#00F0FF",
              letterSpacing: "0.15em",
            }}
          >
            02. WORK
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
            Selected{" "}
            <span style={{ color: "#00F0FF" }}>projects.</span>
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
