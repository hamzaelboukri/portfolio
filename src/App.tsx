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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
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
            <span className="side-card-label">Next Project</span>
            <div className="side-card-divider" />
            <div className="side-card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="22" y1="8.5" x2="2" y2="15.5"/><line x1="2" y1="8.5" x2="22" y2="15.5"/></svg>
            </div>
            <span className="side-card-value">Web App</span>
            <div className="side-card-divider" />
            <div className="side-card-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <span className="side-card-note">Creative Dev<br/>Since 2023</span>
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
            <span className="side-card-label">Interact</span>
            <div className="side-card-divider" />
            <div className="side-card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
            </div>
            <span className="side-card-value">Hover</span>
            <div className="side-card-divider" />
            <span className="side-card-note">Move cursor<br/>to reveal</span>
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

        /* ── Background ── */
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
          cursor: crosshair;
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
          opacity: 0.10;
          margin: 0;
        }

        /* ── Side Cards (Lando Norris style) ── */
        .landing-side-card {
          position: absolute;
          z-index: 4;
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 0.75rem 0.7rem;
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.45rem;
          width: 96px;
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

        .side-card-label {
          display: block;
          font-size: 0.48rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ink-soft);
          font-weight: 500;
        }

        .side-card-divider {
          width: 100%;
          height: 1px;
          background: rgba(10, 10, 10, 0.08);
        }

        .side-card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--ink);
          opacity: 0.7;
          padding: 0.15rem 0;
        }

        .side-card-value {
          font-family: "Bebas Neue", sans-serif;
          font-size: 1rem;
          letter-spacing: 0.04em;
          line-height: 1;
          text-transform: uppercase;
        }

        .side-card-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--ink);
          opacity: 0.5;
        }

        .side-card-note {
          font-size: 0.5rem;
          line-height: 1.35;
          color: var(--ink-soft);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 500;
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

          .side-card-icon svg {
            width: 22px;
            height: 22px;
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
