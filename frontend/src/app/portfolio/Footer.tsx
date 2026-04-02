export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid #1F1F1F",
        marginTop: "96px",
      }}
    >
      <div
        className="footer-inner page-inner"
        style={{
          height: "52px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            font: "400 12px/1 'Geist Mono', monospace",
            color: "#444",
          }}
        >
          © 2025 Yunos Nabavi
        </span>
        <span
          style={{
            font: "400 12px/1 'Geist Mono', monospace",
            color: "#444",
          }}
        >
          React · Vite
        </span>
      </div>

      <style>{`
        @media (max-width: 389px) {
          .footer-inner {
            height: auto !important;
            flex-direction: column !important;
            align-items: center !important;
            padding-top: 16px !important;
            padding-bottom: 16px !important;
            gap: 8px !important;
          }
        }
      `}</style>
    </footer>
  );
}
