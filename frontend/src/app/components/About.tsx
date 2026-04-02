import { motion } from "motion/react";
import { Github, Linkedin, Twitter, Send } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const skills = [
  { category: "Languages", items: "TypeScript · Python · Go · Bash" },
  { category: "Frontend", items: "React · Next.js · TailwindCSS" },
  { category: "Backend", items: "Node.js · FastAPI · PostgreSQL · Redis" },
  { category: "DevOps", items: "Docker · Kubernetes · Terraform · Ansible" },
  { category: "Cloud", items: "AWS · GCP · Vercel · Cloudflare" },
  { category: "CI/CD", items: "GitHub Actions · ArgoCD · Jenkins" },
];

const socials = [
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Twitter, label: "X / Twitter", href: "#" },
  { icon: Send, label: "Telegram", href: "#" },
];

export function About() {
  return (
    <section id="about" style={{ background: "#080810", padding: "100px 0" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.75rem",
              color: "#00F0FF",
              letterSpacing: "0.15em",
            }}
          >
            01. ABOUT
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
            The human behind{" "}
            <span style={{ color: "#00F0FF", fontStyle: "italic" }}>the terminal.</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-[340px_1fr] gap-12 lg:gap-20">
          {/* Left: Photo + social */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            {/* Photo */}
            <div className="relative">
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(0,240,255,0.2)" }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1737392721245-94db2412951c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXZlbG9wZXIlMjBwb3J0cmFpdCUyMGRhcmslMjBtb29keSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzUxMDU4NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Yunos Nabavi"
                  className="w-full h-80 object-cover"
                  style={{ filter: "saturate(0.7) contrast(1.1)" }}
                />
                {/* Glitch border accent */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{ boxShadow: "inset 0 0 30px rgba(0,240,255,0.08)" }}
                />
                {/* Cyan line accent */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px]"
                  style={{ background: "linear-gradient(to bottom, transparent, #00F0FF, transparent)" }}
                />
              </div>

              {/* Status badge */}
              <div
                className="absolute -bottom-4 left-4 px-3 py-1.5 rounded-lg flex items-center gap-2"
                style={{
                  background: "#0F0F1A",
                  border: "1px solid rgba(163,255,71,0.25)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#A3FF47", boxShadow: "0 0 6px #A3FF47" }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "#A3FF47" }}>
                  Open to roles · Remote / On-site
                </span>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex gap-3 mt-4 flex-wrap">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  title={label}
                  className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 cursor-pointer"
                  style={{
                    background: "#0F0F1A",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "#7A7A8C",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.color = "#00F0FF";
                    el.style.borderColor = "rgba(0,240,255,0.3)";
                    el.style.boxShadow = "0 0 12px rgba(0,240,255,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.color = "#7A7A8C";
                    el.style.borderColor = "rgba(255,255,255,0.07)";
                    el.style.boxShadow = "none";
                  }}
                  data-cursor-hover
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right: Bio + terminal */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {/* Pull quote */}
            <p
              className="mb-6"
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                color: "#EDEAE4",
                lineHeight: 1.7,
              }}
            >
              "I build systems that don't break at 3am — and if they do, I've already written the runbook."
            </p>

            <p className="mb-4" style={{ color: "#7A7A8C", lineHeight: 1.8, fontSize: "0.95rem" }}>
              I'm a Full Stack Software Engineer and DevOps practitioner with 6+ years shipping production-grade
              systems across startups and enterprise. My work lives at the intersection of elegant frontend
              experiences and rock-solid infrastructure — React apps that scale on Kubernetes clusters I designed,
              CI/CD pipelines that deploy before the coffee brews.
            </p>
            <p className="mb-10" style={{ color: "#7A7A8C", lineHeight: 1.8, fontSize: "0.95rem" }}>
              I care deeply about developer experience, observability, and infrastructure that teams can reason
              about at midnight. I've led platform migrations, cut cloud costs by 40%, and mentored engineers
              into senior roles. Currently seeking my next high-leverage role — remote-first, product-focused.
            </p>

            {/* Terminal skills card */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "#0A0A16",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="px-4 py-3 flex items-center gap-2"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "#FFBD2E" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
                <span
                  className="ml-2"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "#7A7A8C" }}
                >
                  bash$ cat skills.txt
                </span>
              </div>
              <div className="p-5">
                {skills.map((skill, i) => (
                  <motion.div
                    key={skill.category}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 * i }}
                    className="flex gap-4 py-2 pl-3"
                    style={{ borderLeft: "2px solid rgba(0,240,255,0.3)" }}
                  >
                    <span
                      className="shrink-0"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.75rem",
                        color: "#7A7A8C",
                        minWidth: "80px",
                      }}
                    >
                      {skill.category}
                    </span>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.75rem",
                        color: "#7A7A8C",
                      }}
                    >
                      →
                    </span>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.75rem",
                        color: "#EDEAE4",
                      }}
                    >
                      {skill.items}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
