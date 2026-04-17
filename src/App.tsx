import { useEffect, useMemo, useRef, useState } from "react";
import { FooterScrollReveal } from "./components/FooterScrollReveal";
import { HelmetHero, type HeroCanvasHoverSettings } from "./components/HelmetHero";
import { HeroRive } from "./components/HeroRive";
import { TopoBackground } from "./components/TopoBackground";
import { RIVE_ASSETS } from "./riveAssets";

const HERO_BASE = "/images/hamzaelboukri-Photoroom.png";
const HERO_HOVER = "/images/hero-3-Photoroom.png";

/** Larger spotlight + stronger blend so hero-3-Photoroom fills more of the portrait on hover */
const HERO_HOVER_REVEAL: HeroCanvasHoverSettings = {
  revealStrength: 1.44,
  spotRadius: 1.52,
  maskEllipseY: 1.92,
  pointerDamp: 5.85,
  hoverFadeDamp: 5.35,
  parallax: 0.44,
  overlayHoverZoom: 0.034,
  overlayOpacity: 1,
  overlaySaturation: 1.06,
};

function App() {
  const landingRef = useRef<HTMLDivElement>(null);
  const [bootReady, setBootReady] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const isLoading = useMemo(() => !(bootReady && heroReady), [bootReady, heroReady]);

  useEffect(() => {
    const root = landingRef.current;
    if (!root) return;

    const onMove = (e: MouseEvent) => {
      root.style.setProperty("--mx", `${e.clientX}px`);
      root.style.setProperty("--my", `${e.clientY}px`);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    let mounted = true;
    const minDelay = new Promise((resolve) => setTimeout(resolve, 700));

    const preloadImage = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
      });

    const fontsReady =
      "fonts" in document
        ? (document as Document & { fonts: { ready: Promise<unknown> } }).fonts.ready
        : Promise.resolve();

    Promise.allSettled([
      preloadImage(HERO_BASE),
      preloadImage(HERO_HOVER),
      fontsReady,
      minDelay,
    ]).then(() => {
      if (mounted) setBootReady(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="landing" ref={landingRef}>
      {isLoading && (
        <div className="boot-loader" role="status" aria-live="polite" aria-label="Loading website">
          <div className="boot-loader-ring" />
          <span className="boot-loader-text">Loading experience...</span>
        </div>
      )}

      <TopoBackground />

      <div className="landing-spotlight" aria-hidden />

      <header className={`landing-header${isLoading ? " is-booting" : ""}`}>
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

      <main className={`landing-main${isLoading ? " is-booting" : ""}`}>
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
              hover={HERO_HOVER_REVEAL}
              onReady={() => setHeroReady(true)}
            />

            {/* Rive aligned on portrait zone (same focal area as hero-3 hover reveal) */}
            <HeroRive className="hero-rive-layer--portrait" variant="portrait" src={RIVE_ASSETS.helmets} />

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

      <FooterScrollReveal id="contact" className={`landing-footer${isLoading ? " is-booting" : ""}`}>
        <p>&copy; {new Date().getFullYear()} Hamza Elboukri</p>
        <a href="mailto:hello@example.com">hello@example.com</a>
      </FooterScrollReveal>

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
          /* Lando-style: clean white + cursor “flashlight” via --mx/--my */
          --paper: #ffffff;
          --paper-hover: #f0f0f3;
          --mx: 50vw;
          --my: 50vh;
          --ink: #0a0a0a;
          --ink-soft: rgba(10, 10, 10, 0.45);
          --lime: #d4ff00;
          --line: rgba(10, 10, 10, 0.08);
          /* Rive “liquid” helmet: lower = more portrait / hero-3 visible */
          /* Lower so hero-3 PNG reveal stays the readable focal layer */
          --hero-rive-opacity: 0.22;

          position: relative;
          min-height: 100vh;
          background: var(--paper);
          color: var(--ink);
          overflow-x: hidden;
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'%3E%3Ccircle cx='12' cy='12' r='6' stroke='%23717171' stroke-width='1.5'/%3E%3C/svg%3E") 12 12, auto;
        }

        .landing-spotlight {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background: radial-gradient(
            circle clamp(220px, 42vmin, 520px) at var(--mx, 50vw) var(--my, 50vh),
            rgba(0, 0, 0, 0.09) 0%,
            rgba(0, 0, 0, 0.045) 45%,
            transparent 70%
          );
        }

        @media (prefers-reduced-motion: reduce) {
          .landing-spotlight {
            opacity: 0;
          }
        }

        .landing a[href],
        .landing button,
        .landing [role='button'],
        .landing .landing-store,
        .landing .landing-menu {
          cursor: pointer;
        }

        .boot-loader {
          position: fixed;
          inset: 0;
          z-index: 20;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.9rem;
          background: var(--paper);
          color: var(--ink);
        }

        .boot-loader-ring {
          width: 42px;
          height: 42px;
          border: 3px solid rgba(10, 10, 10, 0.14);
          border-top-color: rgba(10, 10, 10, 0.8);
          border-radius: 999px;
          animation: loader-spin 0.85s linear infinite;
        }

        .boot-loader-text {
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(10, 10, 10, 0.65);
          font-weight: 600;
        }

        .landing-header,
        .landing-main,
        .landing-footer {
          transition: opacity 0.45s ease;
        }

        .is-booting {
          opacity: 0;
          pointer-events: none;
        }

        /* ── Background ── */
        .topo-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
          isolation: isolate;
          animation: none;
        }

        .topo-bg::after {
          content: "";
          position: absolute;
          inset: -25%;
          background:
            radial-gradient(50% 42% at 20% 30%, rgba(240, 242, 245, 0.85), transparent 72%),
            radial-gradient(48% 40% at 78% 65%, rgba(230, 232, 236, 0.55), transparent 75%),
            radial-gradient(35% 30% at 50% 88%, rgba(245, 246, 248, 0.5), transparent 70%);
          opacity: 0.95;
          animation: none;
          z-index: 0;
        }

        .topo-blobs,
        .topo-ripples,
        .topo-contours-h,
        .topo-lines,
        .topo-wave-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .topo-ripples {
          z-index: 0;
          opacity: 0.78;
          pointer-events: none;
        }

        .topo-ripples .topo-re {
          stroke: rgba(0, 0, 0, 0.048);
          stroke-width: 0.52;
          fill: none;
          vector-effect: non-scaling-stroke;
        }

        .topo-blobs {
          color: rgba(0, 0, 0, 0.028);
          z-index: 0;
          animation: none;
        }

        .topo-contours-h {
          z-index: 1;
          opacity: 0.88;
          pointer-events: none;
        }

        .topo-h {
          stroke: rgba(0, 0, 0, 0.07);
          stroke-width: 0.48;
          stroke-linecap: round;
          stroke-linejoin: round;
          vector-effect: non-scaling-stroke;
        }

        .topo-h-2,
        .topo-h-4,
        .topo-h-6,
        .topo-h-8 { opacity: 0.78; stroke-width: 0.48; }
        .topo-h-1,
        .topo-h-5,
        .topo-h-9,
        .topo-h-13 { opacity: 0.92; }
        .topo-h-3,
        .topo-h-7,
        .topo-h-11 { opacity: 0.55; stroke: rgba(0, 0, 0, 0.055); }
        .topo-h-10,
        .topo-h-12,
        .topo-h-14 { opacity: 0.72; }

        .topo-shape { transform-origin: center; }
        .topo-shape-a { animation: none; }
        .topo-shape-b { animation: none; opacity: 0.85; }
        .topo-shape-c { animation: none; opacity: 0.7; }
        .topo-shape-d { animation: none; opacity: 0.6; }
        .topo-shape-e { animation: none; opacity: 0.5; }

        .topo-lines {
          opacity: 0.42;
          filter: blur(0.18px);
          z-index: 1;
          animation: none;
        }
        .topo-wave-canvas {
          z-index: 2;
          opacity: 0.3;
          filter: blur(0.32px);
          mix-blend-mode: soft-light;
          animation: none;
        }
        .topo-line {
          fill: none;
          stroke: rgba(0, 0, 0, 0.09);
          stroke-width: 0.45;
          transform-origin: 50% 50%;
        }
        .topo-line-1  { animation: none; }
        .topo-line-2  { animation: none; }
        .topo-line-3  { animation: none; stroke-width: 0.35; }
        .topo-line-4  { animation: none; stroke-width: 0.4; }
        .topo-line-5  { animation: none; stroke-width: 0.32; opacity: 0.72; }
        .topo-line-6  { animation: none; stroke-width: 0.32; opacity: 0.76; }
        .topo-line-7  { animation: none; stroke-width: 0.36; opacity: 0.62; }
        .topo-line-8  { animation: none; stroke-width: 0.28; opacity: 0.65; }
        .topo-line-9  { animation: none; stroke-width: 0.32; opacity: 0.58; }
        .topo-line-10 { animation: none; stroke-width: 0.28; opacity: 0.55; }

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
        @keyframes line-wave-a {
          0%   { transform: translate3d(-1.5%, 0.8%, 0) scale(1, 1); }
          50%  { transform: translate3d(0.8%, -1.2%, 0) scale(1.01, 0.985); }
          100% { transform: translate3d(1.8%, 0.4%, 0) scale(0.995, 1.01); }
        }
        @keyframes line-wave-b {
          0%   { transform: translate3d(1.2%, -0.7%, 0) scale(1, 1); }
          50%  { transform: translate3d(-0.9%, 1.1%, 0) scale(0.99, 1.01); }
          100% { transform: translate3d(-1.6%, -0.3%, 0) scale(1.01, 0.99); }
        }
        @keyframes line-wave-c {
          0%   { transform: translate3d(-0.8%, -0.3%, 0) scale(1, 1); }
          50%  { transform: translate3d(1.4%, 1.2%, 0) scale(1.005, 0.99); }
          100% { transform: translate3d(-1.1%, -1%, 0) scale(0.995, 1.01); }
        }
        @keyframes ambient-flow {
          0%   { transform: translate3d(-2%, -1.5%, 0) scale(1); opacity: 0.52; }
          50%  { transform: translate3d(1.5%, 1.8%, 0) scale(1.03); opacity: 0.62; }
          100% { transform: translate3d(2.5%, -1%, 0) scale(0.99); opacity: 0.5; }
        }
        @keyframes topo-pan {
          0%   { transform: translate3d(-1.2%, -0.8%, 0) scale(1.01); }
          50%  { transform: translate3d(0.8%, 0.9%, 0) scale(1.03); }
          100% { transform: translate3d(1.4%, -0.6%, 0) scale(1.02); }
        }
        @keyframes blob-field-drift {
          0%   { transform: translate3d(-1.6%, 0.8%, 0) rotate(-0.4deg); }
          50%  { transform: translate3d(1.2%, -1.4%, 0) rotate(0.6deg); }
          100% { transform: translate3d(1.8%, 1%, 0) rotate(-0.3deg); }
        }
        @keyframes lines-field-drift {
          0%   { transform: translate3d(-1.5%, 0.3%, 0); }
          50%  { transform: translate3d(1.1%, -0.8%, 0); }
          100% { transform: translate3d(1.6%, 0.6%, 0); }
        }
        @keyframes wave-field-drift {
          0%   { transform: translate3d(-1%, -0.5%, 0) scale(1); }
          50%  { transform: translate3d(0.9%, 0.9%, 0) scale(1.015); }
          100% { transform: translate3d(1.3%, -0.7%, 0) scale(1.01); }
        }
        @keyframes loader-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .topo-h,
          .topo-line,
          .topo-shape,
          .topo-bg::after,
          .topo-bg,
          .topo-contours-h,
          .topo-lines,
          .topo-ripples,
          .topo-wave-canvas,
          .topo-blobs {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
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
          border-radius: 12px;
          border: 1px solid rgba(10, 10, 10, 0.1);
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
          pointer-events: none;
        }

        /* ── WebGL hero (z:1) + Rive canvas overlay (z:2), name (z:3) ── */
        .hero-canvas-wrap {
          position: absolute;
          inset: 0;
          z-index: 1;
          perspective: 1200px;
          pointer-events: none;
        }

        .hero-rive-layer {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          opacity: 0.38;
          mix-blend-mode: soft-light;
        }

        /* Centered “liquid” helmet read — soft edge + blend like Lando ref */
        .hero-rive-layer--portrait {
          inset: auto;
          width: min(44vw, 480px);
          max-height: min(56vh, 520px);
          aspect-ratio: 1;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -54%);
          opacity: var(--hero-rive-opacity);
          mix-blend-mode: soft-light;
          filter: saturate(1.08) contrast(1.04);
          -webkit-mask-image: radial-gradient(
            ellipse 76% 80% at 50% 45%,
            #000 46%,
            rgba(0, 0, 0, 0.65) 58%,
            transparent 76%
          );
          mask-image: radial-gradient(
            ellipse 76% 80% at 50% 45%,
            #000 46%,
            rgba(0, 0, 0, 0.65) 58%,
            transparent 76%
          );
        }

        .hero-rive-layer canvas {
          display: block;
          width: 100% !important;
          height: 100% !important;
        }

        .hero-canvas-perspective {
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          pointer-events: none;
          transform:
            rotateX(var(--rx, 0deg))
            rotateY(var(--ry, 0deg));
          transition: transform 0.7s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .hero-canvas-wrap:hover .hero-canvas-perspective {
          transition: transform 0.22s ease-out;
        }

        .hero-canvas-perspective canvas {
          display: block;
          width: 100% !important;
          height: 100% !important;
          pointer-events: auto;
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'%3E%3Cg stroke='%23717171' stroke-width='1.5' stroke-linecap='round'%3E%3Cpath d='M12 4v4M12 16v4M4 12h4M16 12h4'/%3E%3Ccircle cx='12' cy='12' r='1.5' fill='%23717171'/%3E%3C/g%3E%3C/svg%3E") 12 12, crosshair;
          touch-action: none;
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

        /* ── Side Cards ── */
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

export default App;
