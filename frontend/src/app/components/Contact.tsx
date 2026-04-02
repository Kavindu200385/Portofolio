import { useState } from "react";
import { motion } from "motion/react";
import { Copy, Check, Github, Linkedin, Twitter, Send, ArrowUpRight } from "lucide-react";

const socials = [
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Twitter, label: "X", href: "#" },
  { icon: Send, label: "Telegram", href: "#" },
];

export function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "yunos@devcraft.io";

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" style={{ background: "#060610", padding: "120px 0 100px" }} className="relative overflow-hidden">
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 70%, rgba(0,240,255,0.06) 0%, transparent 70%)",
        }}
      />
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 80%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          className="mb-6"
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.75rem",
              color: "#00F0FF",
              letterSpacing: "0.15em",
            }}
          >
            05. CONTACT
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.1 }}
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2.2rem, 6vw, 5rem)",
            lineHeight: 1.1,
            color: "#EDEAE4",
            letterSpacing: "-0.02em",
            marginBottom: "1rem",
          }}
        >
          Let's build something{" "}
          <span style={{ color: "#00F0FF" }}>that matters.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: "1.1rem",
            color: "#7A7A8C",
            marginBottom: "2.5rem",
            lineHeight: 1.7,
          }}
        >
          Whether it's a system at scale or a product from scratch — I'm ready to build.
        </motion.p>

        {/* Email copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-3 mb-10 flex-wrap"
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "clamp(0.9rem, 2.5vw, 1.3rem)",
              color: "#EDEAE4",
              letterSpacing: "0.02em",
            }}
          >
            {email}
          </span>
          <button
            onClick={copyEmail}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer"
            style={{
              background: copied ? "rgba(163,255,71,0.1)" : "rgba(255,255,255,0.06)",
              border: copied ? "1px solid rgba(163,255,71,0.3)" : "1px solid rgba(255,255,255,0.1)",
              color: copied ? "#A3FF47" : "#7A7A8C",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.72rem",
            }}
            data-cursor-hover
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </motion.div>

        {/* Or email directly CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="mb-12"
        >
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl transition-all duration-300 cursor-pointer"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.85rem",
              color: "#080810",
              background: "#00F0FF",
              letterSpacing: "0.04em",
              boxShadow: "0 0 40px rgba(0,240,255,0.3)",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 60px rgba(0,240,255,0.5)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(0,240,255,0.3)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
            data-cursor-hover
          >
            Send me an email <ArrowUpRight size={16} />
          </a>
        </motion.div>

        {/* Social row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          {socials.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "#7A7A8C",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.75rem",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "#EDEAE4";
                el.style.borderColor = "rgba(255,255,255,0.2)";
                el.style.background = "rgba(255,255,255,0.07)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "#7A7A8C";
                el.style.borderColor = "rgba(255,255,255,0.07)";
                el.style.background = "rgba(255,255,255,0.04)";
              }}
              data-cursor-hover
            >
              <Icon size={14} />
              {label}
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
