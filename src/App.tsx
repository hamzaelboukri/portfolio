import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FooterScrollReveal } from "./components/FooterScrollReveal";
import { HelmetHero, type HeroCanvasHoverSettings } from "./components/HelmetHero";
import { HeroRive } from "./components/HeroRive";
import { HeroScrollShrink } from "./components/HeroScrollShrink";
import { CanvasToBlackRamp } from "./components/CanvasToBlackRamp";
import { SkillsHallOfFame } from "./components/SkillsHallOfFame";
import { TopoBackground } from "./components/TopoBackground";
import { RIVE_ASSETS } from "./riveAssets";

gsap.registerPlugin(ScrollTrigger);

const HERO_BASE = "/images/hamzaelboukri-Photoroom.png";
const HERO_HOVER = "/images/hero-3-Photoroom.png";

/** Larger spotlight + stronger blend so hero-3-Photoroom fills more of the portrait on hover */
const HERO_HOVER_REVEAL: HeroCanvasHoverSettings = {
  revealStrength: 1.5,
  spotRadius: 1.58,
  maskEllipseY: 1.88,
  pointerDamp: 5.85,
  hoverFadeDamp: 5.35,
  parallax: 0.44,
  overlayHoverZoom: 0.034,
  overlayOpacity: 1,
  overlaySaturation: 1.06,
};

function App() {
  const landingRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroLineARef = useRef<HTMLParagraphElement>(null);
  const heroLineBRef = useRef<HTMLParagraphElement>(null);
  const heroSignatureRef = useRef<SVGSVGElement>(null);
  const heroVisualRef = useRef<HTMLDivElement>(null);
  const [bootReady, setBootReady] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const isLoading = useMemo(() => !(bootReady && heroReady), [bootReady, heroReady]);

  useEffect(() => {
    const root = landingRef.current;
    if (!root) return;

    const onMove = (e: MouseEvent) => {
      root.style.setProperty("--mx", `${e.clientX}px`);
      root.style.setProperty("--my", `${e.clientY}px`);
      /* Cursor parallax: topo SVG + wave layer shift with pointer */
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      root.style.setProperty("--look-x", `${(-nx * 32).toFixed(2)}px`);
      root.style.setProperty("--look-y", `${(-ny * 26).toFixed(2)}px`);
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

  useEffect(() => {
    const trigger = heroSectionRef.current;
    const lineA = heroLineARef.current;
    const lineB = heroLineBRef.current;
    const sig = heroSignatureRef.current;
    const visual = heroVisualRef.current;
    if (!trigger || !lineA || !lineB || !sig || !visual) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger,
          start: "top top",
          end: "+=150vh",
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
          lineA,
          { xPercent: -20, opacity: 0 },
          { xPercent: 14, opacity: 1, ease: "none", duration: 1 },
          0.58,
        )
        .fromTo(
          lineB,
          { xPercent: 20, opacity: 0 },
          { xPercent: -14, opacity: 1, ease: "none", duration: 1 },
          0.58,
        )
        .fromTo(
          sig,
          { opacity: 0, scale: 0.52, rotate: -14 },
          { opacity: 1, scale: 1.14, rotate: 0, ease: "none", duration: 0.62 },
          0.66,
        )
        .fromTo(
          visual,
          {
            filter: "grayscale(0) blur(0px) brightness(1) contrast(1)",
            opacity: 1,
          },
          {
            filter: "grayscale(0.92) blur(2px) brightness(0.86) contrast(0.95)",
            opacity: 0.92,
            ease: "none",
            duration: 1,
          },
          0.52,
        );
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, []);

  return (
    <div className={`landing${isLoading ? "" : " is-ready"}`} ref={landingRef}>
      {isLoading && (
        <div className="boot-loader" role="status" aria-live="polite" aria-label="Loading website">
          <div className="boot-loader-ring" />
          <span className="boot-loader-text">Loading experience...</span>
        </div>
      )}

      <header className={`landing-header${isLoading ? " is-booting" : ""}`}>
        <span className="landing-logo">
          Hamza
          <br />
          Elboukri
        </span>
        <div className="landing-header-actions">
          <a
            className="landing-store"
            href="/images/hamzaelboukri_cv.pdf"
            download="hamzaelboukri_cv.pdf"
            aria-label="Download resume PDF"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Resume
          </a>
          <button type="button" className="landing-menu" aria-label="Menu">
            <span />
            <span />
          </button>
        </div>
      </header>

      <main className={`landing-main${isLoading ? " is-booting" : ""}`}>
        <section className={`landing-first-screen${isLoading ? " is-booting" : ""}`} ref={heroSectionRef}>
          <div className="landing-first-screen-headline" aria-hidden>
            <p className="landing-first-screen-line landing-first-screen-line--lime" ref={heroLineARef}>
              WE DID IT AT HOME WE DID IT AT HOME
            </p>
            <p className="landing-first-screen-line landing-first-screen-line--white" ref={heroLineBRef}>
              FOREVER A BRITISH GP WEEKEND I WILL REMEMBER
            </p>
          </div>

          <HeroScrollShrink triggerRef={heroSectionRef} themeSurfaceRef={landingRef}>
            {/* Topo + wave above white paper, below WebGL — transparent canvas shows lines + animation immediately */}
            <TopoBackground />
            <div className="landing-spotlight landing-spotlight--hero-stack" aria-hidden />
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
            <div className="landing-hero-visual" ref={heroVisualRef}>
              <HelmetHero
                baseUrl={HERO_BASE}
                revealUrl={HERO_HOVER}
                portraitAlt="Hamza Elboukri"
                hover={HERO_HOVER_REVEAL}
                onReady={() => setHeroReady(true)}
              />

              {/* Rive aligned on portrait zone (same focal area as hero-3 hover reveal) */}
              <HeroRive className="hero-rive-layer--portrait" variant="portrait" src={RIVE_ASSETS.helmets} />
            </div>

            <div className="landing-hero-fx-card" aria-hidden />

            <svg
              className="landing-first-screen-signature"
              viewBox="0 0 640 420"
              aria-hidden
              ref={heroSignatureRef}
            >
              <path d="M46 280 C140 210, 250 150, 338 116 C392 95, 452 87, 490 110 C522 132, 518 170, 476 200 C426 235, 322 256, 221 286" />
              <path d="M240 355 L363 102" />
              <path d="M306 334 C320 266, 360 224, 398 220 C416 218, 431 228, 428 248 C425 268, 401 287, 372 289" />
              <path d="M359 300 L414 212 L399 308" />
              <path d="M428 303 L506 296" />
            </svg>

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
          </HeroScrollShrink>
        </section>

        <div className="landing-sticky-stack">
          <section
            className="landing-sticky-panel landing-sticky-panel--dev-manifesto"
            id="philosophy"
            aria-labelledby="dev-manifesto-heading"
          >
            <h2 id="dev-manifesto-heading" className="sr-only">Developer philosophy</h2>
            <div className="dev-manifesto-inner">
              <div className="dev-manifesto-badge">
                <svg
                  className="dev-manifesto-emblem"
                  viewBox="0 0 200 72"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <g
                    stroke="rgba(245, 243, 235, 0.88)"
                    strokeWidth="1.15"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  >
                    <path d="M18 46c8-22 28-34 48-30c-6 10-10 22-10 34M34 22c4 8 6 18 4 28M26 38c6-4 14-6 22-4" />
                    <path d="M182 46c-8-22-28-34-48-30c6 10 10 22 10 34M166 22c-4 8-6 18-4 28M174 38c-6-4-14-6-22-4" />
                    <ellipse cx="100" cy="40" rx="17" ry="15" />
                    <path d="M83 38h34M100 28v22" />
                  </g>
                </svg>
                <p className="dev-manifesto-tagline">TYPESCRIPT · OPEN WEB · SINCE 2023</p>
              </div>
              <p className="dev-manifesto-text">
                <span className="dev-manifesto-line">
                  <span className="dev-manifesto-highlight">PUSHING</span> QUALITY,
                </span>
                <span className="dev-manifesto-line">
                  SHIPPING FOR <span className="dev-manifesto-highlight">USERS</span>,
                </span>
                <span className="dev-manifesto-line">BRINGING IT ALL IN</span>
                <span className="dev-manifesto-line">EVERY REPO. DEFINING A</span>
                <span className="dev-manifesto-line">
                  <span className="dev-manifesto-highlight">CRAFT</span> IN TYPESCRIPT
                </span>
                <span className="dev-manifesto-line">ON THE WEB AND</span>
                <span className="dev-manifesto-line">IN PRODUCTION.</span>
              </p>
            </div>
          </section>
        </div>

        <CanvasToBlackRamp />
        <SkillsHallOfFame />
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
          /* Clean white base; section 1 shrinks while section 2 rises from below */
          --paper: #ffffff;
          --paper-hover: #f0f0f3;
          /* Deep racing green — reads clearly when hero paper fades on scroll */
          --canvas: #2d3222;
          --mx: 50vw;
          --my: 50vh;
          --ink: #0a0a0a;
          --ink-soft: rgba(10, 10, 10, 0.45);
          --lime: #d4ff00;
          --line: rgba(10, 10, 10, 0.08);
          /* Rive “liquid” helmet: lower = more portrait / hero-3 visible */
          /* Lower so hero-3 PNG reveal stays the readable focal layer */
          --hero-rive-opacity: 0.22;
          /* Topo: dark ink at first paint (white hero); HeroScrollShrink tweens to light on green */
          --topo-stroke: rgba(0, 0, 0, 0.12);
          --topo-stroke-mid: rgba(0, 0, 0, 0.082);
          --topo-stroke-soft: rgba(0, 0, 0, 0.056);
          --topo-blob-fill: rgba(0, 0, 0, 0.042);
          --topo-mist-opacity: 0.7;
          --look-x: 0px;
          --look-y: 0px;

          position: relative;
          min-height: 100vh;
          background: var(--canvas);
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
            rgba(0, 0, 0, 0.12) 0%,
            rgba(0, 0, 0, 0.05) 45%,
            transparent 70%
          );
        }

        @media (prefers-reduced-motion: reduce) {
          .landing-spotlight,
          .landing-spotlight--hero-stack {
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

        /* Cinematic first impression: start after loader hides (.is-ready) */
        .landing-first-screen {
          animation: none;
        }

        .is-ready .landing-first-screen {
          animation: intro-rise 0.95s cubic-bezier(0.2, 0.72, 0.22, 1) both;
        }

        .landing-first-screen-shrink {
          animation: none;
          transform-origin: 50% 50%;
          overflow: hidden;
          clip-path: inset(0% 0% 0% 0% round 0px);
        }

        .is-ready .landing-first-screen-shrink {
          animation:
            intro-mask 1.05s cubic-bezier(0.2, 0.72, 0.22, 1) both;
        }

        .landing-header {
          animation: none;
        }

        .is-ready .landing-header {
          animation: intro-fade-up 0.85s cubic-bezier(0.22, 0.7, 0.28, 1) 0.15s both;
        }

        .landing-side-card-left {
          animation: none;
        }

        .is-ready .landing-side-card-left {
          animation: intro-fade-left 0.95s cubic-bezier(0.2, 0.72, 0.22, 1) 0.2s both;
        }

        .landing-side-card-right {
          animation: none;
        }

        .is-ready .landing-side-card-right {
          animation: intro-fade-right 0.95s cubic-bezier(0.2, 0.72, 0.22, 1) 0.24s both;
        }

        /* ── Background ── */
        .topo-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
          isolation: isolate;
          animation: topo-pan 52s ease-in-out infinite alternate;
        }

        .topo-bg-shift {
          position: absolute;
          inset: -4%;
          width: 108%;
          height: 108%;
          pointer-events: none;
          transform: translate3d(var(--look-x, 0px), var(--look-y, 0px), 0);
          will-change: transform;
        }

        .topo-bg::after {
          content: "";
          position: absolute;
          inset: -25%;
          background:
            radial-gradient(50% 42% at 20% 30%, rgba(255, 255, 255, 0.14), transparent 72%),
            radial-gradient(48% 40% at 78% 65%, rgba(255, 255, 255, 0.09), transparent 75%),
            radial-gradient(35% 30% at 50% 88%, rgba(255, 255, 255, 0.08), transparent 70%);
          opacity: var(--topo-mist-opacity, 0.7);
          animation: ambient-flow 46s ease-in-out infinite alternate;
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
          animation: topo-pan 62s ease-in-out infinite alternate;
        }

        .topo-ripples .topo-re {
          stroke: var(--topo-stroke-soft);
          stroke-width: 0.52;
          fill: none;
          vector-effect: non-scaling-stroke;
        }

        .topo-blobs {
          color: var(--topo-blob-fill);
          z-index: 0;
          animation: blob-field-drift 58s ease-in-out infinite alternate;
        }

        .topo-contours-h {
          z-index: 1;
          opacity: 1;
          pointer-events: none;
          animation: topo-pan 68s ease-in-out infinite alternate;
        }

        .topo-h {
          stroke: var(--topo-stroke-mid);
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
        .topo-h-11 { opacity: 0.55; stroke: var(--topo-stroke-soft); }
        .topo-h-10,
        .topo-h-12,
        .topo-h-14 { opacity: 0.72; }

        .topo-shape { transform-origin: center; }
        .topo-shape-a { animation: blob-drift-a 40s ease-in-out infinite alternate; }
        .topo-shape-b { animation: blob-drift-b 46s ease-in-out infinite alternate; opacity: 0.85; }
        .topo-shape-c { animation: blob-drift-c 42s ease-in-out infinite alternate; opacity: 0.7; }
        .topo-shape-d { animation: blob-drift-d 50s ease-in-out infinite alternate; opacity: 0.6; }
        .topo-shape-e { animation: blob-drift-e 44s ease-in-out infinite alternate; opacity: 0.5; }

        .topo-lines {
          opacity: 0.62;
          filter: blur(0.18px);
          z-index: 1;
          animation: lines-field-drift 48s ease-in-out infinite alternate;
        }
        .topo-wave-canvas {
          z-index: 2;
          opacity: 0.52;
          filter: blur(0.32px);
          mix-blend-mode: soft-light;
          animation: wave-field-drift 38s ease-in-out infinite alternate;
        }
        .topo-line {
          fill: none;
          stroke: var(--topo-stroke);
          stroke-width: 0.45;
          transform-origin: 50% 50%;
        }
        .topo-line-1  { animation: line-wave-a 34s ease-in-out infinite alternate; }
        .topo-line-2  { animation: line-wave-b 38s ease-in-out infinite alternate; }
        .topo-line-3  { animation: line-wave-c 36s ease-in-out infinite alternate; stroke-width: 0.35; }
        .topo-line-4  { animation: line-wave-a 40s ease-in-out infinite alternate; stroke-width: 0.4; }
        .topo-line-5  { animation: line-wave-b 32s ease-in-out infinite alternate; stroke-width: 0.32; opacity: 0.72; }
        .topo-line-6  { animation: line-wave-c 42s ease-in-out infinite alternate; stroke-width: 0.32; opacity: 0.76; }
        .topo-line-7  { animation: line-wave-a 36s ease-in-out infinite alternate; stroke-width: 0.36; opacity: 0.62; }
        .topo-line-8  { animation: line-wave-b 44s ease-in-out infinite alternate; stroke-width: 0.28; opacity: 0.65; }
        .topo-line-9  { animation: line-wave-c 30s ease-in-out infinite alternate; stroke-width: 0.32; opacity: 0.58; }
        .topo-line-10 { animation: line-wave-a 41s ease-in-out infinite alternate; stroke-width: 0.28; opacity: 0.55; }

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
        @keyframes intro-zoom {
          0%   { transform: scale(1.08); filter: saturate(0.9) contrast(0.95); }
          100% { transform: scale(1); filter: saturate(1) contrast(1); }
        }
        @keyframes intro-mask {
          0%   { clip-path: inset(8% 9% 10% 9% round 30px); }
          100% { clip-path: inset(0% 0% 0% 0% round 0px); }
        }
        @keyframes intro-rise {
          0%   { transform: translate3d(0, 28px, 0); opacity: 0; }
          100% { transform: translate3d(0, 0, 0); opacity: 1; }
        }
        @keyframes intro-fade-up {
          0%   { transform: translate3d(0, -16px, 0); opacity: 0; }
          100% { transform: translate3d(0, 0, 0); opacity: 1; }
        }
        @keyframes intro-fade-left {
          0%   { transform: translate3d(-18px, 10px, 0); opacity: 0; }
          100% { transform: translate3d(0, 0, 0); opacity: 1; }
        }
        @keyframes intro-fade-right {
          0%   { transform: translate3d(18px, 10px, 0); opacity: 0; }
          100% { transform: translate3d(0, 0, 0); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dev-manifesto-inner {
            transform: none !important;
          }
          .landing-first-screen,
          .landing-first-screen-shrink,
          .landing-header,
          .landing-side-card-left,
          .landing-side-card-right {
            animation: none !important;
          }
          .topo-bg-shift {
            transform: none !important;
          }
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
          background: transparent;
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

        /* ── First screen: topo + spotlight + header + hero scale together on scroll ── */
        .landing-main { padding: 0; }

        .landing-first-screen {
          position: relative;
          min-height: 100vh;
        }

        .landing-first-screen-shrink {
          position: relative;
          z-index: 2;
          width: 100%;
          margin: 0;
          min-height: 100vh;
          border-radius: 0;
          overflow: visible;
          border: 0;
          background: transparent;
          box-shadow: none;
          will-change: transform;
        }

        /* Paper (0) → topo + wave (1) → portrait canvas (2): WebGL alpha shows lines without scrolling */
        .landing-first-screen-shrink .topo-bg {
          z-index: 1;
        }

        .landing-spotlight--hero-stack {
          z-index: 1;
        }

        /* White hero + faint map lines visible through paper */
        .landing-hero-paper {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background: var(--paper);
          opacity: 0.86;
        }

        .landing-hero {
          position: relative;
          z-index: 2;
          height: 100vh;
          min-height: 100svh;
          display: flex;
          align-items: stretch;
        }

        /* Lando-like overlay moved to FIRST section */
        .landing-first-screen-headline {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 160vw;
          pointer-events: none;
          z-index: 1;
          display: grid;
          gap: clamp(0.35rem, 1vw, 0.7rem);
          opacity: 0; /* Hidden before scroll; GSAP reveals after threshold */
        }

        .landing-first-screen-line {
          font-family: "Bebas Neue", sans-serif;
          font-size: clamp(2rem, 7.6vw, 5.6rem);
          letter-spacing: 0.03em;
          line-height: 0.88;
          text-transform: uppercase;
          text-align: center;
          white-space: nowrap;
          will-change: transform, opacity;
        }

        .landing-first-screen-line--lime {
          color: rgba(195, 230, 0, 0.58);
        }

        .landing-first-screen-line--white {
          color: rgba(248, 248, 248, 0.92);
        }

        .landing-first-screen-signature {
          position: absolute;
          left: 50%;
          top: 50%;
          width: min(96vw, 1240px);
          height: min(76vh, 720px);
          transform: translate(-50%, -50%);
          z-index: 3;
          pointer-events: none;
          overflow: visible;
          transform-origin: 50% 50%;
          filter: drop-shadow(0 4px 8px rgba(134, 188, 0, 0.45));
          will-change: transform, opacity;
          opacity: 0; /* Hidden before scroll; GSAP reveals after threshold */
        }

        .landing-first-screen-signature path {
          fill: none;
          stroke: #cfff14;
          stroke-width: 10.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .landing-hero-inner {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .landing-hero-visual {
          position: absolute;
          inset: 0;
          z-index: 1;
          will-change: filter, opacity, transform;
        }

        .landing-hero-fx-card {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: min(42vw, 460px);
          height: min(44vh, 350px);
          background: rgba(185, 189, 181, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.22);
          box-shadow:
            inset 0 0 80px rgba(255, 255, 255, 0.06),
            0 16px 42px rgba(0, 0, 0, 0.28);
          z-index: 2;
          pointer-events: none;
          opacity: 0;
          visibility: hidden;
          will-change: opacity;
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
          width: min(40vw, 420px);
          max-height: min(51vh, 465px);
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
          background: transparent;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          border: none;
          box-shadow: none;
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

        /* Wraps sticky manifesto; height comes from the panel (min 100vh). Do not add extra
           min-height here — a tall min-height (e.g. 190vh) only created empty canvas scroll
           before the skills section below. */
        .landing-sticky-stack {
          position: relative;
          background: var(--canvas);
        }

        .landing-sticky-panel {
          position: sticky;
          top: 0;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(2rem, 6vw, 4rem) clamp(1.25rem, 4vw, 2.5rem);
          background: var(--canvas);
          z-index: 2;
          overflow: hidden;
        }

        /* McLaren-style editorial block: near-black, serif stack, emblem, acid lime hits */
        .landing-sticky-panel--dev-manifesto {
          position: relative;
          background: var(--canvas);
          padding: clamp(1.5rem, 4vh, 2.5rem) clamp(1.25rem, 5vw, 2rem);
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          box-sizing: border-box;
        }

        .landing-sticky-panel--dev-manifesto::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(ellipse 80% 45% at 50% 20%, rgba(212, 255, 0, 0.045), transparent 55%);
          z-index: 0;
        }

        .dev-manifesto-inner {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: min(40rem, 94vw);
          margin: 0 auto;
          text-align: center;
          transform: translateY(-6vh);
        }

        .dev-manifesto-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: clamp(1.5rem, 4vh, 2.25rem);
          color: rgba(245, 243, 235, 0.9);
        }

        .dev-manifesto-emblem {
          width: min(200px, 52vw);
          height: auto;
          margin-bottom: 0.85rem;
          filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.4));
        }

        .dev-manifesto-tagline {
          font-family: "Inter", system-ui, sans-serif;
          font-size: 0.52rem;
          font-weight: 600;
          letter-spacing: 0.42em;
          text-transform: uppercase;
          color: rgba(245, 243, 235, 0.55);
          margin: 0;
        }

        .dev-manifesto-text {
          font-family: "Fraunces", "Georgia", serif;
          font-optical-sizing: auto;
          font-weight: 700;
          font-size: clamp(1.75rem, 3.85vw, 3.15rem);
          line-height: 0.82;
          letter-spacing: -0.015em;
          text-transform: uppercase;
          color: rgba(245, 243, 235, 0.94);
          margin: 0;
          font-variation-settings: "opsz" 72;
        }

        .dev-manifesto-line {
          display: block;
        }

        .dev-manifesto-highlight {
          color: #d4ff00;
          font-weight: 800;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          margin: -1px;
          padding: 0;
          border: 0;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
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
          background: var(--paper);
        }

        .landing-footer a { color: var(--ink); }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .landing-first-screen { min-height: 100svh; }
          .landing-hero {
            height: 100svh;
            min-height: 100svh;
          }
          .landing-first-screen-shrink {
            width: 100%;
            margin: 0;
            min-height: 100svh;
          }
          .landing-first-screen-line {
            font-size: clamp(1.7rem, 10vw, 3.1rem);
          }
          .landing-first-screen-signature {
            width: min(98vw, 1020px);
            height: min(64vh, 560px);
          }

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
          .dev-manifesto-text {
            font-size: clamp(1.5rem, 7.5vw, 2.45rem);
          }

          .dev-manifesto-inner {
            transform: translateY(-4vh);
          }

          .landing-first-screen-line {
            font-size: clamp(1.45rem, 12vw, 2.4rem);
          }
          .landing-first-screen-signature path {
            stroke-width: 9;
          }

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
