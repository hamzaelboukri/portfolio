import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────
   Data
───────────────────────────────────────────────────────────── */
interface Project {
  num: string;
  name: string;
  tagline: string;
  tags: string[];
  lang: string;
  year: string;
  url?: string;
}

const LANG_COLOR: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  PHP: "#8892bf",
};

const PROJECTS: Project[] = [
  {
    num: "01",
    name: "ResQFront",
    tagline:
      "Ambulance dispatching system — live map, fleet management & emergency incident control for first responders.",
    tags: ["React", "TypeScript", "Leaflet", "REST API"],
    lang: "TypeScript",
    year: "2025",
    url: "https://github.com/hamzaelboukri/ResQFront",
  },
  {
    num: "02",
    name: "Track-Go",
    tagline:
      "Real-time delivery tracker — live package status, route history & driver dashboard. ⭐ 2",
    tags: ["React", "TypeScript", "Maps API", "Socket.io"],
    lang: "TypeScript",
    year: "2026",
    url: "https://github.com/hamzaelboukri/Track-Go",
  },
  {
    num: "03",
    name: "Musify — Music Streaming Platform",
    tagline:
      "A full-stack music streaming web platform built with Next.js, NestJS, and MongoDB.",
    tags: ["Next.js", "NestJS", "MongoDB", "TypeScript"],
    lang: "TypeScript",
    year: "2026",
    url: "https://github.com/hamzaelboukri/Musify",
  },
  {
    num: "04",
    name: "Eventify",
    tagline:
      "Full-stack event discovery & booking — Next.js frontend and NestJS API. JWT auth with role-based access (Admin & Participant), bcrypt, DTO validation (class-validator), Mongoose on MongoDB, Passport, and Docker Compose.",
    tags: ["Next.js", "NestJS", "MongoDB", "Docker"],
    lang: "TypeScript",
    year: "2026",
    url: "https://github.com/hamzaelboukri/Eventify",
  },
  {
    num: "05",
    name: "Market Palace",
    tagline:
      "Marketplace for digital assets (3D models, code snippets, Notion templates) with secure file delivery and payment processing. Monorepo — Next.js 14 (App Router, Tailwind, Shadcn), NestJS & Prisma, PostgreSQL, Auth0, Stripe, AWS S3 presigned URLs.",
    tags: ["Next.js", "NestJS", "Prisma", "Stripe"],
    lang: "TypeScript",
    year: "2026",
    url: "https://github.com/hamzaelboukri/market_palce",
  },
  {
    num: "06",
    name: "PHP API",
    tagline:
      "RESTful API built in PHP — resource management, authentication & JSON responses for web clients.",
    tags: ["PHP", "REST API", "MySQL", "Auth"],
    lang: "PHP",
    year: "2025",
    url: "https://github.com/hamzaelboukri/API",
  },
  {
    num: "07",
    name: "TruckManager",
    tagline:
      "Fleet management system — truck assignment, maintenance scheduling & driver trip logging.",
    tags: ["JavaScript", "Node.js", "Express", "MongoDB"],
    lang: "JavaScript",
    year: "2025",
    url: "https://github.com/hamzaelboukri/TruckManager",
  },
  {
    num: "08",
    name: "EHR",
    tagline:
      "Electronic Health Record API — versioned REST endpoints for patients, appointments & conflict prevention.",
    tags: ["JavaScript", "Node.js", "REST API", "JWT"],
    lang: "JavaScript",
    year: "2025",
    url: "https://github.com/hamzaelboukri/EHR",
  },
  {
    num: "09",
    name: "Game Store v2",
    tagline:
      "Gaming e-commerce on Laravel with Blade views — catalogue, cart, wishlist & Stripe checkout. Repo language mix — JS, CSS, SCSS, Blade & PHP.",
    tags: ["Laravel", "Blade", "PHP", "Stripe"],
    lang: "PHP",
    year: "2025",
    url: "https://github.com/hamzaelboukri/game-storev2",
  },
  {
    num: "10",
    name: "Gestion des Offres",
    tagline:
      "Job-offer management portal — post, filter & apply to offers with role-based access for HR teams.",
    tags: ["PHP", "Laravel", "MySQL", "Blade"],
    lang: "PHP",
    year: "2025",
    url: "https://github.com/hamzaelboukri/Gestion-des-Offres-",
  },
];

/* ─────────────────────────────────────────────────────────────
   Single project row
───────────────────────────────────────────────────────────── */
function ProjectRow({ p, index }: { p: Project; index: number }) {
  const [hov, setHov] = useState(false);

  return (
    <a
      className={`pw-row${hov ? " is-hov" : ""}`}
      href={p.url ?? "#"}
      target={p.url ? "_blank" : "_self"}
      rel="noopener noreferrer"
      onClick={(e) => !p.url && e.preventDefault()}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label={`${p.name} — ${p.tagline}`}
      data-index={index}
    >
      {/* sweep fill */}
      <span className="pw-row-fill" aria-hidden />

      <div className="pw-row-inner">
        {/* Number */}
        <span className="pw-num">{p.num}</span>

        {/* Main content */}
        <div className="pw-center">
          <h3 className="pw-name">{p.name}</h3>
          <p className="pw-tagline">{p.tagline}</p>
        </div>

        {/* Right meta */}
        <div className="pw-meta">
          <div className="pw-tags">
            {p.tags.map((t) => (
              <span key={t} className="pw-tag">{t}</span>
            ))}
          </div>
          <div className="pw-bottom-row">
            <span
              className="pw-lang"
              style={{ "--lang-color": LANG_COLOR[p.lang] ?? "#888" } as React.CSSProperties}
            >
              <span className="pw-lang-dot" aria-hidden />
              {p.lang}
            </span>
            <span className="pw-year">{p.year}</span>
            <span className="pw-arrow" aria-hidden>
              <svg viewBox="0 0 18 18" fill="none">
                <path
                  d="M3 15L15 3M15 3H6M15 3V12"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* bottom rule */}
      <span className="pw-rule" aria-hidden />
    </a>
  );
}

/* ─────────────────────────────────────────────────────────────
   Section
───────────────────────────────────────────────────────────── */
export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      /* ── Heading reveal ── */
      if (headRef.current) {
        gsap.fromTo(
          headRef.current.querySelectorAll(".pw-head-line"),
          { clipPath: "inset(0 100% 0 0)", opacity: 0 },
          {
            clipPath: "inset(0 0% 0 0)",
            opacity: 1,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.12,
            scrollTrigger: { trigger: headRef.current, start: "top 85%", once: true },
          }
        );
        gsap.fromTo(
          headRef.current.querySelectorAll(".pw-head-meta > *"),
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.09,
            delay: 0.3,
            scrollTrigger: { trigger: headRef.current, start: "top 85%", once: true },
          }
        );
      }

      /* ── Per-row reveal: each row triggers independently as it enters the viewport ── */
      if (rowsRef.current) {
        const items = rowsRef.current.querySelectorAll(".pw-row-item");

        items.forEach((item) => {
          const num    = item.querySelector(".pw-num");
          const center = item.querySelector(".pw-center");
          const meta   = item.querySelector(".pw-meta");
          const rule   = item.querySelector(".pw-rule");

          /* Set initial hidden state */
          gsap.set(item,   { opacity: 1 });
          gsap.set(num,    { opacity: 0, x: -14 });
          gsap.set(center, { clipPath: "inset(0 100% 0 0)" });
          gsap.set(meta,   { opacity: 0, x: 24 });
          gsap.set(rule,   { scaleX: 0, transformOrigin: "left center" });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: "top 91%",
              once: true,
            },
          });

          tl
            /* number slides in */
            .to(num,    { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" }, 0)
            /* content curtain reveals from left */
            .to(center, { clipPath: "inset(0 0% 0 0)", duration: 0.75, ease: "expo.out" }, 0.08)
            /* tags + meta fade in from right */
            .to(meta,   { opacity: 1, x: 0, duration: 0.55, ease: "power2.out" }, 0.18)
            /* separator line draws itself */
            .to(rule,   { scaleX: 1, duration: 0.9, ease: "expo.out" }, 0.05);
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="pw-section">

      {/* ── Background ────────────────────────────────────── */}
      <div className="pw-bg" aria-hidden>

        {/* ── Speed lines SVG ── */}
        <svg className="pw-speed-svg" viewBox="0 0 1400 1000" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="speed-fade" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#d2ff00" stopOpacity="0" />
              <stop offset="40%"  stopColor="#d2ff00" stopOpacity="0.06" />
              <stop offset="80%"  stopColor="#d2ff00" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#d2ff00" stopOpacity="0.04" />
            </linearGradient>
            <linearGradient id="speed-fade-dim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#d2ff00" stopOpacity="0" />
              <stop offset="50%"  stopColor="#d2ff00" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#d2ff00" stopOpacity="0.01" />
            </linearGradient>
            <radialGradient id="arc-glow" cx="100%" cy="0%" r="80%">
              <stop offset="0%"   stopColor="#d2ff00" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#d2ff00" stopOpacity="0" />
            </radialGradient>
            <mask id="speed-mask">
              <linearGradient id="speed-mask-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0.2" />
              </linearGradient>
              <rect width="1400" height="1000" fill="url(#speed-mask-grad)" />
            </mask>
          </defs>

          {/* Speed lines — dense diagonal slashes */}
          <g mask="url(#speed-mask)">
            {[
              // [x1, y1, x2, y2, opacity]
              [0, 80,  1400, 340,  0.22],
              [0, 160, 1400, 420,  0.14],
              [0, 240, 1400, 500,  0.28],
              [0, 310, 1400, 570,  0.12],
              [0, 390, 1400, 650,  0.32],
              [0, 460, 1400, 720,  0.16],
              [0, 540, 1400, 800,  0.26],
              [0, 610, 1400, 870,  0.10],
              [0, 680, 1400, 940,  0.20],
              [0, 20,  1400, 280,  0.08],
              [0, 750, 1400, 1010, 0.12],
              [200, 0, 1400, 200,  0.10],
              [0, 0,   1400, 180,  0.06],
            ].map(([x1,y1,x2,y2,op], i) => (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={`rgba(210,255,0,${op})`}
                strokeWidth={i % 3 === 0 ? "1.2" : "0.7"}
              />
            ))}

            {/* Bright accent speed lines (lime) */}
            <line x1="0" y1="390" x2="1400" y2="650" stroke="rgba(210,255,0,0.55)" strokeWidth="0.9" />
            <line x1="0" y1="392" x2="1400" y2="652" stroke="rgba(210,255,0,0.15)" strokeWidth="3" />
            <line x1="0" y1="240" x2="1400" y2="500" stroke="rgba(210,255,0,0.35)" strokeWidth="0.8" />
          </g>

          {/* Large speedometer arc — top right */}
          <g fill="none">
            <path
              d="M1400 0 A700 700 0 0 0 700 700"
              stroke="rgba(210,255,0,0.07)"
              strokeWidth="1"
            />
            <path
              d="M1400 0 A600 600 0 0 0 800 600"
              stroke="rgba(210,255,0,0.12)"
              strokeWidth="0.8"
              strokeDasharray="8 14"
            />
            <path
              d="M1400 0 A500 500 0 0 0 900 500"
              stroke="rgba(210,255,0,0.06)"
              strokeWidth="0.7"
              strokeDasharray="4 20"
            />
            <path
              d="M1400 0 A400 400 0 0 0 1000 400"
              stroke="rgba(210,255,0,0.16)"
              strokeWidth="1.5"
            />
            <path
              d="M1400 0 A300 300 0 0 0 1100 300"
              stroke="rgba(210,255,0,0.1)"
              strokeWidth="0.6"
            />
          </g>

          {/* Arc glow fill */}
          <path
            d="M1400 0 A700 700 0 0 0 700 700 L1400 700 Z"
            fill="url(#arc-glow)"
            opacity="0.4"
          />

          {/* Tick marks on the inner arc */}
          <g stroke="rgba(210,255,0,0.25)" strokeWidth="1" fill="none">
            {Array.from({ length: 12 }, (_, i) => {
              const angle = (i / 11) * (Math.PI / 2);
              const r1 = 390, r2 = 405;
              const cx = 1400, cy = 0;
              const x1 = cx - Math.cos(angle) * r1;
              const y1 = cy + Math.sin(angle) * r1;
              const x2 = cx - Math.cos(angle) * r2;
              const y2 = cy + Math.sin(angle) * r2;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
          </g>

          {/* HUD text bottom left */}
          <g fill="rgba(210,255,0,0.2)" fontFamily="monospace" fontSize="7" letterSpacing="2">
            <text x="40" y="970">SELECTED WORKS</text>
            <text x="40" y="982" opacity="0.6">HAMZA ELBOUKRI · 2026</text>
          </g>
        </svg>

        {/* Top lime accent bar */}
        <div className="pw-bg-top-accent" />

        {/* Left rule */}
        <div className="pw-bg-rule-left" />

        {/* Bottom gradient vignette */}
        <div className="pw-bg-vignette" />

        {/* Grain */}
        <svg className="pw-bg-grain" xmlns="http://www.w3.org/2000/svg">
          <filter id="pw-grain-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#pw-grain-filter)" opacity="0.028" />
        </svg>

        {/* Ghost watermark */}
        <span className="pw-bg-wm">WORK</span>
      </div>

      {/* ── Section heading ───────────────────────────────── */}
      <div className="pw-head" ref={headRef}>
        <div className="pw-head-title">
          <span className="pw-head-line pw-head-line--plain">SELECTED</span>
          <span className="pw-head-line pw-head-line--serif">WORKS.</span>
        </div>
        <div className="pw-head-meta">
          <span className="pw-head-count">
            <span className="pw-head-count-num">{PROJECTS.length.toString().padStart(2, "0")}</span>
            <span className="pw-head-count-label"> Projects</span>
          </span>
          <p className="pw-head-copy">
            Full-stack applications, REST APIs and interactive front-ends —
            built across YouCode coursework and personal experiments.
          </p>
        </div>
      </div>

      {/* ── Lime separator rule ───────────────────────────── */}
      <div className="pw-sep" aria-hidden />

      {/* ── Project rows ──────────────────────────────────── */}
      <ul className="pw-rows" ref={rowsRef}>
        {PROJECTS.map((p, i) => (
          <li key={p.num} className="pw-row-item">
            <ProjectRow p={p} index={i} />
          </li>
        ))}
      </ul>

      {/* ── Styles ───────────────────────────────────────── */}
      <style>{`
        .pw-rows { list-style: none; margin: 0; padding: 0; }
        .pw-row-item { display: block; }

        /* ── Section ─────────────────────────────────────────── */
        .pw-section {
          --pw-lime: #d2ff00;
          --pw-black: #2d3222;
          --pw-fg: #f5f3eb;
          --pw-muted: rgba(245, 243, 235, 0.42);
          --pw-border: rgba(245, 243, 235, 0.1);
          background: var(--pw-black);
          color: var(--pw-fg);
          overflow: hidden;
          position: relative;
        }

        /* ── Background system ─────────────────────────────────── */
        .pw-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        /* Speed lines SVG */
        .pw-speed-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        /* SVG grain filter */
        .pw-bg-grain {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        /* Ghost watermark */
        .pw-bg-wm {
          position: absolute;
          right: -0.06em;
          bottom: -0.14em;
          font-family: "Bebas Neue", "Bebas", sans-serif;
          font-size: clamp(10rem, 26vw, 22rem);
          line-height: 1;
          color: transparent;
          -webkit-text-stroke: 1px rgba(210, 255, 0, 0.05);
          text-stroke: 1px rgba(210, 255, 0, 0.05);
          letter-spacing: -0.04em;
          user-select: none;
          pointer-events: none;
        }

        /* Vertical left rule */
        .pw-bg-rule-left {
          position: absolute;
          top: 0;
          bottom: 0;
          left: clamp(1.2rem, 5.5vw, 5rem);
          width: 1px;
          background: linear-gradient(to bottom,
            rgba(210, 255, 0, 0.25) 0%,
            rgba(210, 255, 0, 0.08) 40%,
            rgba(210, 255, 0, 0.04) 80%,
            transparent 100%
          );
        }

        /* Top lime accent bar */
        .pw-bg-top-accent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(to right,
            transparent 0%,
            rgba(210, 255, 0, 0.7) 25%,
            rgba(210, 255, 0, 0.7) 75%,
            transparent 100%
          );
          box-shadow: 0 0 24px 3px rgba(210, 255, 0, 0.15);
        }

        /* Bottom vignette */
        .pw-bg-vignette {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 30%;
          background: linear-gradient(to top,
            rgba(0, 0, 0, 0.5) 0%,
            transparent 100%
          );
        }

        /* Push all section content above bg */
        .pw-marquee-wrap,
        .pw-head,
        .pw-sep,
        .pw-rows {
          position: relative;
          z-index: 1;
        }

        /* ── Heading ─────────────────────────────────────────── */
        .pw-head {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: end;
          gap: clamp(2rem, 5vw, 5rem);
          padding: clamp(4rem, 9vw, 8rem) clamp(1.2rem, 5.5vw, 5rem) clamp(2.5rem, 5vw, 4.5rem);
        }
        @media (max-width: 740px) {
          .pw-head {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        .pw-head-title {
          display: flex;
          flex-direction: column;
          line-height: 0.88;
          gap: 0;
        }
        .pw-head-line {
          display: block;
          font-family: "Bebas Neue", "Bebas", sans-serif;
          font-size: clamp(4.5rem, 13vw, 11.5rem);
          letter-spacing: -0.03em;
          text-transform: uppercase;
          will-change: clip-path, opacity;
          clip-path: inset(0 100% 0 0);
          opacity: 0;
        }
        .pw-head-line--plain {
          color: rgba(245, 243, 235, 0.22);
          font-size: clamp(2.8rem, 7.5vw, 6.5rem);
          letter-spacing: 0.08em;
        }
        .pw-head-line--serif {
          color: var(--pw-fg);
        }

        .pw-head-meta {
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
          padding-bottom: 0.8rem;
        }
        .pw-head-count {
          display: flex;
          align-items: baseline;
          gap: 0.35rem;
        }
        .pw-head-count-num {
          font-family: "Bebas Neue", "Bebas", sans-serif;
          font-size: clamp(3rem, 6vw, 5.5rem);
          line-height: 0.88;
          color: var(--pw-lime);
          letter-spacing: -0.02em;
        }
        .pw-head-count-label {
          font-family: "Inter", system-ui, sans-serif;
          font-size: clamp(0.75rem, 1.2vw, 0.9rem);
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--pw-muted);
        }
        .pw-head-copy {
          font-family: "Inter", system-ui, sans-serif;
          font-size: clamp(0.86rem, 1.3vw, 1rem);
          line-height: 1.72;
          color: var(--pw-muted);
          max-width: 36ch;
        }

        /* ── Separator ───────────────────────────────────────── */
        .pw-sep {
          height: 1px;
          background: linear-gradient(
            to right,
            transparent 0%,
            var(--pw-lime) 20%,
            var(--pw-lime) 80%,
            transparent 100%
          );
          opacity: 0.35;
          margin: 0 clamp(1.2rem, 5.5vw, 5rem);
        }

        /* ── Rows ────────────────────────────────────────────── */
        .pw-rows {
          padding: 0 0 clamp(5rem, 10vw, 9rem);
        }

        /* ── Single row ──────────────────────────────────────── */
        .pw-row {
          position: relative;
          display: block;
          text-decoration: none;
          color: var(--pw-fg);
          padding: 0 clamp(1.2rem, 5.5vw, 5rem);
          overflow: hidden;
          cursor: pointer;
          transition: color 0.04s linear; /* instant on fill arrive */
        }

        .pw-row-fill {
          position: absolute;
          inset: 0;
          background: var(--pw-lime);
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 0.58s cubic-bezier(0.76, 0, 0.24, 1);
          z-index: 0;
          pointer-events: none;
        }
        .pw-row.is-hov .pw-row-fill {
          transform: scaleX(1);
        }

        /* Text colour inverts when lime fill is present */
        .pw-row.is-hov .pw-num,
        .pw-row.is-hov .pw-name,
        .pw-row.is-hov .pw-tagline,
        .pw-row.is-hov .pw-tag,
        .pw-row.is-hov .pw-year,
        .pw-row.is-hov .pw-arrow,
        .pw-row.is-hov .pw-rule {
          color: #000;
          border-color: rgba(0, 0, 0, 0.18);
        }

        .pw-row-inner {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: clamp(1.2rem, 3.5vw, 3rem);
          padding: clamp(1.4rem, 3.2vw, 2.6rem) 0;
          min-height: clamp(80px, 14vw, 130px);
        }

        .pw-rule {
          position: absolute;
          bottom: 0;
          left: clamp(1.2rem, 5.5vw, 5rem);
          right: clamp(1.2rem, 5.5vw, 5rem);
          height: 1px;
          background: var(--pw-border);
          z-index: 1;
          transition: background 0.35s ease;
          display: block;
        }

        /* ── Number ──────────────────────────────────────────── */
        .pw-num {
          font-family: "Bebas Neue", "Bebas", sans-serif;
          font-size: clamp(0.85rem, 1.5vw, 1.1rem);
          letter-spacing: 0.14em;
          color: var(--pw-muted);
          flex-shrink: 0;
          min-width: 2.2rem;
          transition: color 0.35s ease;
        }

        /* ── Center: name + tagline ───────────────────────────── */
        .pw-center {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .pw-name {
          font-family: "Fraunces", Georgia, serif;
          font-style: italic;
          font-weight: 800;
          font-size: clamp(1.8rem, 4.8vw, 4.4rem);
          line-height: 1.0;
          letter-spacing: -0.025em;
          color: var(--pw-fg);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.35s ease;
        }
        @media (max-width: 620px) {
          .pw-name { font-size: clamp(1.4rem, 5.5vw, 2.2rem); white-space: normal; }
        }

        .pw-tagline {
          font-family: "Inter", system-ui, sans-serif;
          font-size: clamp(0.75rem, 1.1vw, 0.88rem);
          line-height: 1.55;
          color: var(--pw-muted);
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transform: translateY(6px);
          transition:
            max-height 0.42s ease,
            opacity 0.35s ease,
            transform 0.35s ease,
            color 0.35s ease;
          margin: 0;
        }
        .pw-row.is-hov .pw-tagline {
          max-height: 3.5rem;
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Right meta ──────────────────────────────────────── */
        .pw-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.55rem;
          flex-shrink: 0;
        }
        @media (max-width: 560px) {
          .pw-meta { display: none; }
        }

        .pw-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem 0.4rem;
          justify-content: flex-end;
          max-width: clamp(160px, 22vw, 340px);
        }
        .pw-tag {
          font-family: "Inter", system-ui, sans-serif;
          font-size: clamp(0.6rem, 0.85vw, 0.7rem);
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--pw-muted);
          border: 1px solid var(--pw-border);
          padding: 0.2em 0.6em;
          border-radius: 2px;
          transition: color 0.35s ease, border-color 0.35s ease;
        }

        .pw-bottom-row {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        .pw-lang {
          display: inline-flex;
          align-items: center;
          gap: 0.38em;
          font-family: "Inter", system-ui, sans-serif;
          font-size: clamp(0.65rem, 0.95vw, 0.75rem);
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--pw-muted);
          transition: color 0.35s ease;
        }
        .pw-lang-dot {
          display: inline-block;
          width: 0.55em;
          height: 0.55em;
          border-radius: 50%;
          background: var(--lang-color, #888);
          flex-shrink: 0;
          transition: background 0.35s ease;
        }
        .pw-row.is-hov .pw-lang { color: rgba(0,0,0,0.55); }
        .pw-row.is-hov .pw-lang-dot { background: rgba(0,0,0,0.35); }

        .pw-year {
          font-family: "Bebas Neue", "Bebas", sans-serif;
          font-size: clamp(0.9rem, 1.4vw, 1.15rem);
          letter-spacing: 0.1em;
          color: var(--pw-muted);
          transition: color 0.35s ease;
        }
        .pw-arrow {
          width: clamp(1rem, 1.8vw, 1.4rem);
          height: clamp(1rem, 1.8vw, 1.4rem);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--pw-lime);
          transform: rotate(0deg);
          transition: transform 0.35s ease, color 0.35s ease;
        }
        .pw-row.is-hov .pw-arrow {
          transform: rotate(0deg) scale(1.2);
          color: #000;
        }
        .pw-arrow svg {
          width: 100%;
          height: 100%;
        }

        /* ── Reduced motion ───────────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .pw-row-fill { transition: none; }
          .pw-tagline { transition: none; }
          .pw-row.is-hov .pw-tagline {
            max-height: 3.5rem;
            opacity: 1;
            transform: none;
          }
          /* Ensure rows are visible when animations are disabled */
          .pw-num, .pw-center, .pw-meta, .pw-rule {
            opacity: 1 !important;
            clip-path: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
