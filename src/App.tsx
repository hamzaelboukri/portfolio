import { HelmetHero } from "./components/HelmetHero";
import { TopoBackground } from "./components/TopoBackground";

const HERO_BASE = "/images/hamzaelboukri-Photoroom.png";
const HERO_HOVER = "/images/hero-3-Photoroom.png";

export default function App() {
  return (
    <div className="landing">
      <TopoBackground />

      <header className="landing-header">
        <span className="landing-logo">
          Hamza
          <br />
          Elboukri
        </span>
        <div className="landing-header-actions">
          <a className="landing-store" href="#contact">
            Store
          </a>
          <button type="button" className="landing-menu" aria-label="Menu">
            <span />
            <span />
          </button>
        </div>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <aside className="landing-side-card landing-side-card-left">
            <span className="landing-side-label">Portfolio</span>
            <span className="landing-side-line" />
            <span className="landing-side-value">Hamza</span>
            <span className="landing-side-line" />
            <span className="landing-side-note">creative developer</span>
          </aside>

          <div className="landing-hero-inner">
            <HelmetHero
              baseUrl={HERO_BASE}
              revealUrl={HERO_HOVER}
              portraitAlt="Hamza Elboukri"
            />

            <div className="hero-name-overlay" aria-hidden="true">
              <h1 className="hero-name">Hamza Elboukri</h1>
            </div>
          </div>

          <aside className="landing-side-card landing-side-card-right">
            <span className="landing-side-label">Hover</span>
            <span className="landing-side-line" />
            <span className="landing-side-value">Helmet</span>
            <span className="landing-side-line" />
            <span className="landing-side-note">3D reveal on cursor</span>
          </aside>
        </section>
      </main>

      <footer id="contact" className="landing-footer">
        <p>&copy; {new Date().getFullYear()} Hamza Elboukri</p>
        <a href="mailto:hello@example.com">hello@example.com</a>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body, #root {
          height: 100%;
          -webkit-font-smoothing: antialiased;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* ── Base ── */
        .landing {
          --paper: #f0ede5;
          --ink: #0a0a0a;
          --ink-soft: rgba(10, 10, 10, 0.45);
          --lime: #d4ff00;
          --line: rgba(10, 10, 10, 0.07);

          position: relative;
          min-height: 100vh;
          background: var(--paper);
          color: var(--ink);
          overflow-x: hidden;
        }

        /* ── Background (Lando-style organic blobs) ── */
        .topo-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .topo-blobs,
        .topo-lines {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .topo-blobs { color: rgba(10, 10, 10, 0.055); }

        .topo-shape { transform-origin: center; }
        .topo-shape-a { animation: blob-drift-a 22s ease-in-out infinite alternate; }
        .topo-shape-b { animation: blob-drift-b 26s ease-in-out infinite alternate; opacity: 0.85; }
        .topo-shape-c { animation: blob-drift-c 20s ease-in-out infinite alternate; opacity: 0.7; }
        .topo-shape-d { animation: blob-drift-d 24s ease-in-out infinite alternate; opacity: 0.6; }
        .topo-shape-e { animation: blob-drift-e 18s ease-in-out infinite alternate; opacity: 0.5; }

        .topo-lines { opacity: 0.3; }
        .topo-line {
          fill: none;
          stroke: rgba(10, 10, 10, 0.07);
          stroke-width: 0.5;
        }
        .topo-line-1  { animation: line-shift 28s ease-in-out infinite alternate; }
        .topo-line-2  { animation: line-shift 32s ease-in-out infinite alternate-reverse; }
        .topo-line-3  { animation: line-shift 26s ease-in-out infinite alternate; stroke-width: 0.35; }
        .topo-line-4  { animation: line-shift 30s ease-in-out infinite alternate-reverse; stroke-width: 0.4; }
        .topo-line-5  { animation: line-shift 24s ease-in-out infinite alternate; stroke-width: 0.3; opacity: 0.6; }
        .topo-line-6  { animation: line-shift 34s ease-in-out infinite alternate-reverse; stroke-width: 0.3; opacity: 0.7; }
        .topo-line-7  { animation: line-shift 22s ease-in-out infinite alternate; stroke-width: 0.35; opacity: 0.5; }
        .topo-line-8  { animation: line-shift 29s ease-in-out infinite alternate-reverse; stroke-width: 0.25; opacity: 0.55; }
        .topo-line-9  { animation: line-shift 25s ease-in-out infinite alternate; stroke-width: 0.3; opacity: 0.45; }
        .topo-line-10 { animation: line-shift 31s ease-in-out infinite alternate-reverse; stroke-width: 0.25; opacity: 0.4; }

        @keyframes blob-drift-a {
          0%   { transform: translate3d(0, 0, 0) scale(1) rotate(0deg); }
          50%  { transform: translate3d(30px, -20px, 0) scale(1.06) rotate(3deg); }
          100% { transform: translate3d(-15px, 25px, 0) scale(0.96) rotate(-2deg); }
        }
        @keyframes blob-drift-b {
          0%   { transform: translate3d(0, 0, 0) scale(1) rotate(0deg); }
          50%  { transform: translate3d(-25px, 30px, 0) scale(1.05) rotate(-4deg); }
          100% { transform: translate3d(20px, -15px, 0) scale(0.97) rotate(2deg); }
        }
        @keyframes blob-drift-c {
          0%   { transform: translate3d(0, 0, 0) scale(1) rotate(0deg); }
          50%  { transform: translate3d(20px, 15px, 0) scale(1.08) rotate(5deg); }
          100% { transform: translate3d(-30px, -20px, 0) scale(0.93) rotate(-3deg); }
        }
        @keyframes blob-drift-d {
          0%   { transform: translate3d(0, 0, 0) scale(1); }
          50%  { transform: translate3d(-18px, -25px, 0) scale(1.04); }
          100% { transform: translate3d(25px, 18px, 0) scale(0.97); }
        }
        @keyframes blob-drift-e {
          0%   { transform: translate3d(0, 0, 0) scale(1); }
          50%  { transform: translate3d(15px, 20px, 0) scale(1.06); }
          100% { transform: translate3d(-20px, -12px, 0) scale(0.95); }
        }
        @keyframes line-shift {
          0%   { transform: translate3d(-1.5%, 0, 0); }
          100% { transform: translate3d(1.5%, -1%, 0); }
        }

        /* ── Header ── */
        .landing-header,
        .landing-main,
        .landing-footer {
          position: relative;
          z-index: 1;
        }

        .landing-header {
          position: fixed;
          inset: 0 0 auto 0;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem clamp(1.25rem, 3vw, 2.5rem);
          pointer-events: none;
        }

        .landing-logo {
          font-family: "Bebas Neue", sans-serif;
          font-size: clamp(1.6rem, 2.6vw, 2.4rem);
          letter-spacing: 0.06em;
          line-height: 0.85;
          text-transform: uppercase;
          font-weight: 700;
          pointer-events: auto;
        }

        .landing-header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          pointer-events: auto;
        }

        .landing-store {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1.15rem;
          background: var(--lime);
          color: var(--ink);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          border-radius: 999px;
          text-decoration: none;
          transition: filter 0.2s;
        }

        .landing-store:hover {
          filter: brightness(0.92);
          text-decoration: none;
        }

        .landing-menu {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          border: 1px solid var(--line);
          background: #fff;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: background 0.2s;
        }

        .landing-menu:hover { background: #fafaf8; }

        .landing-menu span {
          display: block;
          width: 18px;
          height: 2px;
          background: var(--ink);
          border-radius: 1px;
        }

        /* ── Hero ── */
        .landing-main { padding: 0; }

        .landing-hero {
          position: relative;
          height: 100vh;
          display: flex;
          align-items: stretch;
        }

        .landing-hero-inner {
          position: relative;
          width: 100%;
          height: 100%;
        }

        /* ── Canvas ── */
        .hero-canvas-wrap {
          position: absolute;
          inset: 0;
          perspective: 1200px;
          cursor: none;
        }

        .hero-canvas-perspective {
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transform:
            rotateX(var(--rx, 0deg))
            rotateY(var(--ry, 0deg));
          transition: transform 0.7s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .hero-canvas-wrap:hover .hero-canvas-perspective {
          transition: transform 0.12s ease-out;
        }

        .hero-canvas-perspective canvas {
          display: block;
          width: 100% !important;
          height: 100% !important;
        }

        /* ── Name Overlay ── */
        .hero-name-overlay {
          position: absolute;
          bottom: 2.5rem;
          left: 0;
          right: 0;
          z-index: 3;
          text-align: center;
          pointer-events: none;
        }

        .hero-name {
          font-family: "Bebas Neue", sans-serif;
          font-size: clamp(3rem, 9vw, 8rem);
          letter-spacing: 0.04em;
          line-height: 0.9;
          text-transform: uppercase;
          color: var(--ink);
          opacity: 0.12;
          margin: 0;
        }

        /* ── Side Cards ── */
        .landing-side-card {
          position: absolute;
          z-index: 4;
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 0.85rem 0.75rem;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          width: 92px;
          text-align: center;
        }

        .landing-side-card-left {
          left: clamp(0.5rem, 1.5vw, 1.25rem);
          bottom: 10%;
        }

        .landing-side-card-right {
          right: clamp(0.5rem, 1.5vw, 1.25rem);
          top: 7rem;
        }

        .landing-side-label {
          display: block;
          font-size: 0.5rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ink-soft);
        }

        .landing-side-value {
          font-family: "Bebas Neue", sans-serif;
          font-size: 1.1rem;
          letter-spacing: 0.04em;
          line-height: 1;
        }

        .landing-side-note {
          font-size: 0.56rem;
          line-height: 1.35;
          color: var(--ink-soft);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .landing-side-line {
          width: 100%;
          height: 1px;
          background: rgba(10, 10, 10, 0.08);
        }

        /* ── Footer ── */
        .landing-footer {
          position: relative;
          z-index: 1;
          padding: 2rem clamp(1rem, 4vw, 2.5rem);
          border-top: 1px solid var(--line);
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--ink-soft);
        }

        .landing-footer a { color: var(--ink); }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .landing-hero { height: 100svh; }

          .landing-side-card-left {
            left: 0.85rem;
            bottom: 4.5rem;
          }

          .landing-side-card-right {
            top: 5.5rem;
            right: 0.85rem;
          }

          .hero-name {
            font-size: clamp(2.5rem, 8vw, 5rem);
          }
        }

        @media (max-width: 640px) {
          .landing-logo { font-size: 1.4rem; }
          .landing-store { padding-inline: 0.85rem; }

          .landing-side-card {
            width: 72px;
            padding: 0.55rem 0.45rem;
            font-size: 0.85em;
          }

          .hero-name-overlay { bottom: 1.5rem; }

          .hero-name {
            font-size: clamp(2rem, 11vw, 3.5rem);
          }
        }
      `}</style>
    </div>
  );
}
