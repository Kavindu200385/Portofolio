const NAME = "Yunos Nabavi";

export function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      style={{ paddingTop: "120px", paddingBottom: "0" }}
    >
      <div className="page-inner">
        <h1
          style={{
            font: "600 clamp(26px, 3.5vw, 40px)/1.15 'Geist', system-ui, sans-serif",
            color: "#F2F2F2",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          {NAME}
        </h1>
        <p
          style={{
            font: "600 clamp(26px, 3.5vw, 40px)/1.15 'Geist', system-ui, sans-serif",
            color: "#444",
            margin: "0",
            letterSpacing: "-0.02em",
          }}
        >
          Software Engineer &amp; DevOps
        </p>

        <p
          style={{
            font: "400 15px/1.7 'Geist', system-ui, sans-serif",
            color: "#888",
            marginTop: "28px",
            maxWidth: "460px",
          }}
        >
          Building reliable systems and scalable full-stack products.
          Based in Colombo, Sri Lanka. Open to senior roles.
        </p>

        <div
          className="hero-links"
          style={{
            marginTop: "36px",
            display: "flex",
            gap: "24px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => scrollTo("work")}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              font: "400 13px/1 'Geist', system-ui, sans-serif",
              color: "#888",
              cursor: "pointer",
              transition: "color 150ms ease",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#F2F2F2")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#888")}
          >
            View Work →
          </button>
          <a
            href="https://github.com"
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
            GitHub ↗
          </a>
        </div>

        <div
          style={{
            marginTop: "72px",
            height: "1px",
            background: "#1F1F1F",
          }}
        />
      </div>

      <style>{`
        @media (max-width: 389px) {
          .hero-links {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
