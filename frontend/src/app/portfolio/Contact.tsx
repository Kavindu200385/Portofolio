import { useState } from "react";
import { SectionLabel } from "./About";

const EMAIL = "yunos@devcraft.io";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = EMAIL;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" style={{ paddingTop: "72px" }}>
      <div className="page-inner">
        <SectionLabel>CONTACT</SectionLabel>

        <h2
          className="contact-headline"
          style={{
            font: "600 22px/1.4 'Geist', system-ui, sans-serif",
            color: "#F2F2F2",
            margin: "24px 0 0 0",
            maxWidth: "400px",
            letterSpacing: "-0.01em",
          }}
        >
          Open to senior engineering and DevOps opportunities.
        </h2>

        {/* Email row */}
        <div
          style={{
            marginTop: "24px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              font: "400 15px/1 'Geist', system-ui, sans-serif",
              color: "#888",
            }}
          >
            {EMAIL}
          </span>
          <button
            onClick={copyEmail}
            title={copied ? "Copied" : "Copy email"}
            style={{
              background: "none",
              border: "none",
              padding: "0 2px",
              cursor: "pointer",
              color: "#444",
              font: "400 12px/1 'Geist Mono', monospace",
              transition: "color 150ms ease",
              display: "flex",
              alignItems: "center",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#888")}
            onMouseLeave={(e) => {
              if (!copied) (e.currentTarget as HTMLElement).style.color = "#444";
            }}
          >
            {copied ? "✓" : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
            )}
          </button>
        </div>

        {/* Social links */}
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "20px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "GitHub", href: "https://github.com" },
            { label: "LinkedIn", href: "https://linkedin.com" },
            { label: "X", href: "https://x.com" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                font: "400 13px/1 'Geist', system-ui, sans-serif",
                color: "#888",
                textDecoration: "none",
                transition: "color 150ms ease",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#F2F2F2")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#888")}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 389px) {
          .contact-headline {
            font-size: 18px !important;
          }
        }
      `}</style>
    </section>
  );
}
