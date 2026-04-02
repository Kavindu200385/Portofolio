export function Footer() {
  return (
    <footer
      style={{
        background: "#040408",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        padding: "24px 0",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-3">
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.7rem",
            color: "#7A7A8C",
            letterSpacing: "0.04em",
          }}
        >
          © 2025 Yunos Nabavi · Built with React & Vite · All rights reserved
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.7rem",
            color: "#7A7A8C",
          }}
        >
          <span style={{ color: "#00F0FF" }}>[&nbsp;YN&nbsp;]</span>
          {" "}— crafted with precision
        </span>
      </div>
    </footer>
  );
}
