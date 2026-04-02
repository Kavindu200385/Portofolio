import { useRef, useEffect } from "react";
import { motion } from "motion/react";
import { TypeAnimation } from "react-type-animation";
import { ArrowUpRight, Download } from "lucide-react";

const aboutLines = [
  { label: "name", value: "Yunos Nabavi" },
  { label: "role", value: "Full Stack · DevOps · Cloud" },
  { label: "location", value: "Remote / On-site" },
  { label: "status", value: "open to roles" },
  { label: "stack", value: "React · Go · K8s · AWS" },
];

export function Hero() {
  const magnetContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = magnetContainerRef.current;
    if (!container) return;

    const buttons = container.querySelectorAll<HTMLElement>(".magnetic-btn");
    const cleanups: Array<() => void> = [];

    buttons.forEach((btn) => {
      const onMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 60) {
          btn.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`;
        } else {
          btn.style.transform = "";
        }
      };
      const onEnter = () => window.addEventListener("mousemove", onMove);
      const onLeave = () => {
        window.removeEventListener("mousemove", onMove);
        btn.style.transform = "";
      };
      btn.addEventListener("mouseenter", onEnter);
      btn.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        btn.removeEventListener("mouseenter", onEnter);
        btn.removeEventListener("mouseleave", onLeave);
        window.removeEventListener("mousemove", onMove);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  const scrollToWork = () => {
    document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "#080810" }}
    >
      {/* Noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* Radial glow behind terminal */}
      <div
        className="absolute right-[5%] top-1/2 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,240,255,0.08) 0%, transparent 70%)",
          transform: "translateY(-50%)",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-20">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-16 lg:gap-8">

          {/* Left: Text */}
          <div className="flex-1 min-w-0" ref={magnetContainerRef}>
            {/* Tag line */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-6"
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "#A3FF47", boxShadow: "0 0 6px #A3FF47" }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.75rem",
                  color: "#7A7A8C",
                  letterSpacing: "0.1em",
                }}
              >
                AVAILABLE FOR NEW OPPORTUNITIES
              </span>
            </motion.div>

            {/* Hero headline */}
            <div className="overflow-hidden">
              {["Software", "Engineer &", "DevOps."].map((line, i) => (
                <motion.div
                  key={line}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.15, ease: [0.25, 0.46, 0.45, 0.94], duration: 0.7 }}
                >
                  <h1
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 800,
                      fontSize: "clamp(3.5rem, 8vw, 7.5rem)",
                      lineHeight: 1.0,
                      color: i === 2 ? "#00F0FF" : "#EDEAE4",
                      letterSpacing: "-0.02em",
                      margin: 0,
                    }}
                  >
                    {line}
                  </h1>
                </motion.div>
              ))}
            </div>

            {/* Typing animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-6 flex items-center gap-2"
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "1rem",
                  color: "#7A7A8C",
                }}
              >
                $&gt;
              </span>
              <TypeAnimation
                sequence={[
                  "[ Full Stack ]",
                  1800,
                  "[ Cloud Native ]",
                  1800,
                  "[ CI/CD Pipelines ]",
                  1800,
                  "[ System Design ]",
                  1800,
                  "[ Kubernetes ]",
                  1800,
                ]}
                wrapper="span"
                repeat={Infinity}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "1rem",
                  color: "#A3FF47",
                }}
              />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="flex flex-wrap gap-4 mt-10"
            >
              <button
                className="magnetic-btn flex items-center gap-2 px-6 py-3 rounded-xl cursor-pointer transition-all duration-300"
                style={{
                  border: "1px solid rgba(0,240,255,0.5)",
                  color: "#00F0FF",
                  background: "transparent",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.85rem",
                  letterSpacing: "0.05em",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "rgba(0,240,255,0.08)";
                  el.style.boxShadow = "0 0 24px rgba(0,240,255,0.2)";
                  el.style.borderColor = "#00F0FF";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "transparent";
                  el.style.boxShadow = "none";
                  el.style.borderColor = "rgba(0,240,255,0.5)";
                }}
                onClick={scrollToWork}
                data-cursor-hover
              >
                View Work <ArrowUpRight size={14} />
              </button>
              <button
                className="magnetic-btn flex items-center gap-2 px-6 py-3 rounded-xl cursor-pointer transition-all duration-300"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#7A7A8C",
                  background: "transparent",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.85rem",
                  letterSpacing: "0.05em",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.color = "#EDEAE4";
                  el.style.borderColor = "rgba(255,255,255,0.3)";
                  el.style.background = "rgba(255,255,255,0.04)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.color = "#7A7A8C";
                  el.style.borderColor = "rgba(255,255,255,0.1)";
                  el.style.background = "transparent";
                }}
                data-cursor-hover
              >
                Download CV <Download size={14} />
              </button>
            </motion.div>
          </div>

          {/* Right: Terminal card */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-[440px] flex-shrink-0"
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "#0A0A16",
                border: "1px solid rgba(0,240,255,0.15)",
                boxShadow: "0 0 60px rgba(0,240,255,0.06), 0 20px 60px rgba(0,0,0,0.5)",
              }}
            >
              {/* Terminal header */}
              <div
                className="flex items-center gap-2 px-4 py-3"
                style={{
                  background: "#0D0D1E",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "#FFBD2E" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
                <span
                  className="ml-auto"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "#7A7A8C" }}
                >
                  bash — terminal
                </span>
              </div>

              {/* Terminal body */}
              <div className="p-5" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem" }}>
                <div className="mb-3">
                  <span style={{ color: "#A3FF47" }}>yunos@devbox</span>
                  <span style={{ color: "#7A7A8C" }}>:</span>
                  <span style={{ color: "#00F0FF" }}>~</span>
                  <span style={{ color: "#7A7A8C" }}> $ </span>
                  <TypeAnimation
                    sequence={["whoami", 1000, "whoami"]}
                    wrapper="span"
                    speed={60}
                    style={{ color: "#EDEAE4" }}
                    repeat={0}
                  />
                </div>
                <div className="mb-4" style={{ color: "#A3FF47" }}>
                  yunos · software engineer & devops
                </div>

                <div className="mb-3">
                  <span style={{ color: "#A3FF47" }}>yunos@devbox</span>
                  <span style={{ color: "#7A7A8C" }}>:</span>
                  <span style={{ color: "#00F0FF" }}>~</span>
                  <span style={{ color: "#7A7A8C" }}> $ </span>
                  <TypeAnimation
                    sequence={[800, "cat about.txt", 1000, "cat about.txt"]}
                    wrapper="span"
                    speed={60}
                    style={{ color: "#EDEAE4" }}
                    repeat={0}
                  />
                </div>

                <div className="space-y-1 pl-2">
                  {aboutLines.map((line) => (
                    <div key={line.label} className="flex gap-2">
                      <span style={{ color: "#7A7A8C", minWidth: "70px" }}>{line.label}</span>
                      <span style={{ color: "#7A7A8C" }}>→</span>
                      <span style={{ color: "#EDEAE4" }}>{line.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-1">
                  <span style={{ color: "#A3FF47" }}>yunos@devbox</span>
                  <span style={{ color: "#7A7A8C" }}>:</span>
                  <span style={{ color: "#00F0FF" }}>~</span>
                  <span style={{ color: "#7A7A8C" }}> $ </span>
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    style={{ color: "#00F0FF" }}
                  >
                    ▋
                  </motion.span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-12 hidden lg:flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-px h-12"
            style={{ background: "linear-gradient(to bottom, #00F0FF, transparent)" }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.65rem",
              color: "#7A7A8C",
              letterSpacing: "0.1em",
              writingMode: "vertical-rl",
            }}
          >
            SCROLL
          </span>
        </motion.div>
      </div>
    </section>
  );
}