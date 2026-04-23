import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** devicon (SVG) on jsDelivr â€” https://github.com/devicons/devicon */
const DV = (icon: string, file: string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${icon}/${file}`;
/** Simple Icons (SVG) for entries without a devicon file */
const SI = (slug: string) => `https://cdn.jsdelivr.net/npm/simple-icons@11.6.0/icons/${slug}.svg`;

/** One logo URL per skill (no second image on hover â€” only the % badge appears). */
const SKILL_LOGO_BY_NAME: Record<string, string> = {
  TypeScript: DV("typescript", "typescript-original.svg"),
  JavaScript: DV("javascript", "javascript-original.svg"),
  PHP: DV("php", "php-original.svg"),
  React: DV("react", "react-original.svg"),
  "Next.js": DV("nextjs", "nextjs-original.svg"),
  Tailwind: DV("tailwindcss", "tailwindcss-original.svg"),
  "Node.js": DV("nodejs", "nodejs-original.svg"),
  NestJS: DV("nestjs", "nestjs-original.svg"),
  Express: DV("express", "express-original.svg"),
  Laravel: DV("laravel", "laravel-original.svg"),
  MySQL: DV("mysql", "mysql-original.svg"),
  PostgreSQL: DV("postgresql", "postgresql-original.svg"),
  MongoDB: DV("mongodb", "mongodb-original.svg"),
  Docker: DV("docker", "docker-original.svg"),
  Kubernetes: DV("kubernetes", "kubernetes-original.svg"),
  Jenkins: DV("jenkins", "jenkins-original.svg"),
  "CI/CD": SI("githubactions"),
  AWS: DV("amazonwebservices", "amazonwebservices-original-wordmark.svg"),
  Figma: DV("figma", "figma-original.svg"),
  "UML · ERD": SI("mermaid"),
  "Agile · Scrum": DV("trello", "trello-plain.svg"),
  Git: DV("git", "git-original.svg"),
  Postman: DV("postman", "postman-original.svg"),
  Jira: DV("jira", "jira-original.svg"),
};

function skillLogoSrc(name: string): string {
  return SKILL_LOGO_BY_NAME[name] ?? DV("github", "github-original.svg");
}


/**
 * Skills hall â€” structure inspired by Lando Norris site (Webflow):
 * dual SVG frames (base + lime overlay), split headlines with lime line-reveal,
 * intro lines, one tech logo per card + % on hover + PNG mask extenders, bottom label row.
 */

/** Desktop helmet frame â€” from site SVG viewBox 0 0 407 411 */
const FRAME_PATH_BASE =
  "M8 .5h390.89a7.5 7.5 0 0 1 7.5 7.5v356.983a7.5 7.5 0 0 1-7.5 7.5H263.329a23.502 23.502 0 0 0-18.375 8.849l-16.499 20.695a22.502 22.502 0 0 1-17.593 8.473H8A7.5 7.5 0 0 1 .5 403V8A7.5 7.5 0 0 1 8 .5Z";

const FRAME_PATH_OVERLAY =
  "M8 1h390.89a7 7 0 0 1 7 7v356.983a7 7 0 0 1-7 7H263.329a23.999 23.999 0 0 0-18.766 9.038l-16.499 20.694A21.999 21.999 0 0 1 210.862 410H8a7 7 0 0 1-7-7V8a7 7 0 0 1 7-7Z";

/** `learnedPct` = how well you know the tech (0â€“100), shown on card hover. Edit freely. */
const SKILLS: { name: string; tag: string; learnedPct: number }[] = [
  { name: "TypeScript", tag: "Languages", learnedPct: 88 },
  { name: "JavaScript", tag: "Languages", learnedPct: 90 },
  { name: "PHP", tag: "Languages", learnedPct: 78 },
  { name: "React", tag: "Front-end", learnedPct: 92 },
  { name: "Next.js", tag: "Front-end", learnedPct: 85 },
  { name: "Tailwind", tag: "Front-end", learnedPct: 88 },
  { name: "Node.js", tag: "Back-end", learnedPct: 87 },
  { name: "NestJS", tag: "Back-end", learnedPct: 82 },
  { name: "Express", tag: "Back-end", learnedPct: 80 },
  { name: "Laravel", tag: "Back-end", learnedPct: 79 },
  { name: "MySQL", tag: "SGBD", learnedPct: 86 },
  { name: "PostgreSQL", tag: "SGBD", learnedPct: 83 },
  { name: "MongoDB", tag: "SGBD", learnedPct: 80 },
  { name: "Docker", tag: "DevOps", learnedPct: 85 },
  { name: "Kubernetes", tag: "DevOps", learnedPct: 72 },
  { name: "Jenkins", tag: "DevOps", learnedPct: 75 },
  { name: "CI/CD", tag: "DevOps", learnedPct: 80 },
  { name: "AWS", tag: "Cloud", learnedPct: 78 },
  { name: "Figma", tag: "Design", learnedPct: 81 },
  { name: "UML · ERD", tag: "Modeling", learnedPct: 88 },
  { name: "Agile · Scrum", tag: "Methods", learnedPct: 90 },
  { name: "Git", tag: "Tools", learnedPct: 91 },
  { name: "Postman", tag: "Tools", learnedPct: 89 },
  { name: "Jira", tag: "Tools", learnedPct: 86 },
];

/** Reference layout: 4 columns; tracks 2 & 4 sit lower than 1 & 3 (stepped rhythm). */
function isStaggeredFourColTrack(index: number) {
  const track = index % 4;
  return track === 1 || track === 3;
}

const INTRO_LINES = [
  "YouCode training plus real repos — TypeScript, React, Node, and cloud primitives.",
  "Front-end polish, back-end APIs, DevOps basics, databases, and the glue between them.",
];

function HelmetFrameSvgs({ active }: { active: boolean }) {
  return (
    <div className="skills-hall-card-frame-w" aria-hidden>
      <svg className="skills-hall-svg skills-hall-svg--base" viewBox="0 0 407 411" preserveAspectRatio="xMidYMid meet" width="100%" height="100%">
        <path fill="none" stroke="rgba(245,243,235,0.2)" strokeWidth={2} vectorEffect="non-scaling-stroke" d={FRAME_PATH_BASE} />
      </svg>
      <svg className="skills-hall-svg skills-hall-svg--overlay" viewBox="0 0 407 411" preserveAspectRatio="xMidYMid meet" width="100%" height="100%">
        <path
          fill="none"
          stroke="var(--skills-lime)"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          d={FRAME_PATH_OVERLAY}
          className={active ? "is-on" : ""}
        />
      </svg>
    </div>
  );
}

export function SkillsHallOfFame() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const header = root.querySelector(".skills-hall-header");
    const reveals = root.querySelectorAll(".skills-high-line-reveal");
    const grid = root.querySelector(".skills-hall-grid");
    const cardBodies = root.querySelectorAll(".skills-hall-card-item");

    const ctx = gsap.context(() => {
      if (header && reveals.length) {
        gsap.set(reveals, { transformOrigin: "left center", scaleX: 0 });
        gsap.to(reveals, {
          scaleX: 1,
          duration: 0.85,
          ease: "power2.inOut",
          stagger: 0.07,
          scrollTrigger: {
            trigger: header,
            start: "top 78%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      }

      if (grid && cardBodies.length) {
        gsap.from(cardBodies, {
          y: 72,
          opacity: 0,
          duration: 0.65,
          ease: "power2.out",
          stagger: { each: 0.028, from: "center" },
          scrollTrigger: {
            trigger: grid,
            start: "top 88%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      }
    }, root);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="skills-hall"
      data-nav-theme-target="light"
      id="skills"
      aria-labelledby="skills-hall-heading"
    >
      {/* â”€â”€ Decorative background â”€â”€ */}
      <div className="skills-hall-bg" aria-hidden>

        {/* â”€â”€ Radar / HUD SVG â”€â”€ */}
        <svg className="skills-hud" viewBox="0 0 1400 900" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="hud-fade" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#d2ff00" stopOpacity="1" />
              <stop offset="100%" stopColor="#d2ff00" stopOpacity="0" />
            </radialGradient>
            <mask id="hud-ring-mask">
              <radialGradient id="hud-ring-mask-grad" cx="50%" cy="50%" r="50%">
                <stop offset="25%"  stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
              <rect width="1400" height="900" fill="url(#hud-ring-mask-grad)" />
            </mask>
          </defs>

          {/* Concentric rings */}
          <g mask="url(#hud-ring-mask)" fill="none">
            {[110, 210, 320, 440, 570, 710, 860, 1020].map((r, i) => (
              <circle
                key={r}
                cx="700" cy="450" r={r}
                stroke={i % 3 === 0 ? "rgba(210,255,0,0.14)" : "rgba(210,255,0,0.055)"}
                strokeWidth={i % 3 === 0 ? "1" : "0.6"}
                strokeDasharray={i % 2 === 0 ? "none" : "6 10"}
              />
            ))}
          </g>

          {/* Radial spokes */}
          <g fill="none" stroke="rgba(210,255,0,0.06)" strokeWidth="0.7">
            {Array.from({ length: 24 }, (_, i) => {
              const angle = (i / 24) * Math.PI * 2;
              const x2 = 700 + Math.cos(angle) * 1100;
              const y2 = 450 + Math.sin(angle) * 1100;
              return <line key={i} x1="700" y1="450" x2={x2} y2={y2} />;
            })}
          </g>

          {/* Bright cardinal spokes (N/E/S/W) */}
          <g fill="none" stroke="rgba(210,255,0,0.18)" strokeWidth="1">
            <line x1="700" y1="450" x2="700"  y2="-200" />
            <line x1="700" y1="450" x2="1800" y2="450"  />
            <line x1="700" y1="450" x2="700"  y2="1200" />
            <line x1="700" y1="450" x2="-400" y2="450"  />
          </g>

          {/* Diagonal accent spokes (45Â°) */}
          <g fill="none" stroke="rgba(210,255,0,0.1)" strokeWidth="0.8">
            <line x1="700" y1="450" x2="1700" y2="-550" />
            <line x1="700" y1="450" x2="1700" y2="1450" />
            <line x1="700" y1="450" x2="-300" y2="-550" />
            <line x1="700" y1="450" x2="-300" y2="1450" />
          </g>

          {/* Rotating sweep arm */}
          <g className="hud-sweep">
            <line x1="700" y1="450" x2="700" y2="-200"
              stroke="rgba(210,255,0,0.45)" strokeWidth="1.2"
              strokeLinecap="round"
            />
            {/* Sweep glow trail */}
            <path
              d="M700,450 L700,-200 A1020,1020 0 0,0 -268,757 Z"
              fill="url(#hud-fade)" opacity="0.04"
            />
          </g>

          {/* Node dots at ring intersections on cardinal spokes */}
          <g fill="rgba(210,255,0,0.35)">
            {[110, 210, 320, 440, 570, 710].map((r) => (
              <g key={r}>
                <circle cx="700"      cy={450 - r} r="2.5" />
                <circle cx={700 + r}  cy="450"     r="2.5" />
                <circle cx="700"      cy={450 + r} r="2.5" />
                <circle cx={700 - r}  cy="450"     r="2.5" />
              </g>
            ))}
          </g>

          {/* Bright center core */}
          <circle cx="700" cy="450" r="8" fill="rgba(210,255,0,0.12)" />
          <circle cx="700" cy="450" r="4" fill="rgba(210,255,0,0.25)" />
          <circle cx="700" cy="450" r="2" fill="rgba(210,255,0,0.7)"  />

          {/* Top-left HUD readout bracket */}
          <g stroke="rgba(210,255,0,0.22)" strokeWidth="0.9" fill="none">
            <path d="M40 40 L40 16 L64 16" />
            <text x="70" y="22" fill="rgba(210,255,0,0.35)" fontSize="7" fontFamily="monospace" letterSpacing="2">CORE · STACK</text>
            <text x="70" y="34" fill="rgba(210,255,0,0.2)"  fontSize="6" fontFamily="monospace" letterSpacing="2">HAMZA · 2026</text>
            <path d="M40 80 L40 54 L64 54" />
            <text x="70" y="60" fill="rgba(210,255,0,0.2)"  fontSize="6" fontFamily="monospace">24 MODULES</text>
          </g>

          {/* Bottom-right HUD readout bracket */}
          <g stroke="rgba(210,255,0,0.18)" strokeWidth="0.9" fill="none" transform="translate(1400,900) rotate(180)">
            <path d="M40 40 L40 16 L64 16" />
            <text x="70" y="22" fill="rgba(210,255,0,0.25)" fontSize="7" fontFamily="monospace" letterSpacing="2" transform="scale(-1,1) translate(-1330,0)">READY · OK</text>
          </g>
        </svg>

        {/* Radial glow layers */}
        <div className="skills-hall-glow-c" />
        <div className="skills-hall-glow-tl" />
        <div className="skills-hall-glow-br" />

        {/* Pulse rings */}
        <div className="skills-hall-pulse skills-hall-pulse--1" />
        <div className="skills-hall-pulse skills-hall-pulse--2" />
        <div className="skills-hall-pulse skills-hall-pulse--3" />

        {/* Ghost watermark */}
        <span className="skills-hall-bg-wm">24</span>

        {/* Precision corner brackets */}
        <svg className="skills-corner skills-corner--tl" viewBox="0 0 60 60" fill="none">
          <path d="M0 60 L0 0 L60 0" stroke="rgba(210,255,0,0.3)" strokeWidth="1.2"/>
          <circle cx="0" cy="0" r="3" fill="rgba(210,255,0,0.4)"/>
          <line x1="8" y1="0" x2="0" y2="0" stroke="rgba(210,255,0,0.5)" strokeWidth="1"/>
          <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(210,255,0,0.5)" strokeWidth="1"/>
        </svg>
        <svg className="skills-corner skills-corner--tr" viewBox="0 0 60 60" fill="none">
          <path d="M60 60 L60 0 L0 0" stroke="rgba(210,255,0,0.2)" strokeWidth="1.2"/>
          <circle cx="60" cy="0" r="3" fill="rgba(210,255,0,0.3)"/>
        </svg>
        <svg className="skills-corner skills-corner--bl" viewBox="0 0 60 60" fill="none">
          <path d="M0 0 L0 60 L60 60" stroke="rgba(210,255,0,0.2)" strokeWidth="1.2"/>
          <circle cx="0" cy="60" r="3" fill="rgba(210,255,0,0.3)"/>
        </svg>
        <svg className="skills-corner skills-corner--br" viewBox="0 0 60 60" fill="none">
          <path d="M60 0 L60 60 L0 60" stroke="rgba(210,255,0,0.3)" strokeWidth="1.2"/>
          <circle cx="60" cy="60" r="3" fill="rgba(210,255,0,0.4)"/>
        </svg>
      </div>

      <div className="skills-hall-inner">
        <header className="skills-hall-header title-layout">
          <div className="skills-hall-title-headline title-headline-w">
            <h2 id="skills-hall-heading" className="sr-only">
              Core stack
              <br />
              and depth
            </h2>
            <h2 className="skills-hall-title-mona text-title-lg" aria-hidden="true">
              <span className="skills-hall-line">
                <span className="skills-hall-line-txt">Core stack</span>
                <span className="skills-high-line-reveal" />
              </span>
            </h2>
            <h2 className="skills-hall-title-brier text-title-lg-brier c-lime-off" aria-hidden="true">
              <span className="skills-hall-line">
                <span className="skills-hall-line-txt">and depth</span>
                <span className="skills-high-line-reveal" />
              </span>
            </h2>
          </div>

          <div className="skills-hall-intro-w title-para-w">
            <p className="sr-only">{INTRO_LINES.join(" ")}</p>
            <div className="skills-hall-split-intro text-body-reg" aria-hidden="true">
              {INTRO_LINES.map((line) => (
                <p key={line} className="skills-hall-intro-line">
                  <span className="skills-hall-line">
                    <span className="skills-hall-line-txt">{line}</span>
                    <span className="skills-high-line-reveal" />
                  </span>
                </p>
              ))}
            </div>
          </div>
        </header>

        <div className="skills-hall-spacer spacer-8" aria-hidden />

        <div className="skills-hall-grid skills-hall-grid--lando helmet-grid w-dyn-items" role="list">
          {SKILLS.map((s, i) => {
            const isHover = hovered === i;
            const logoSrc = skillLogoSrc(s.name);
            const colStagger = isStaggeredFourColTrack(i);

            return (
              <div
                key={`${s.name}-${i}`}
                role="listitem"
                className={`skills-hall-card helmet-grid-item-w w-dyn-item${isHover ? " is-hover" : ""}${
                  colStagger ? " skills-hall-card--col-stagger" : ""
                }`}
                style={{ gridColumn: "span 1" } as CSSProperties}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                tabIndex={0}
                aria-label={`${s.name}, ${s.tag}, ${s.learnedPct}% learned`}
              >
                <div className="shc-shift">
                  <div className="shc-card helmet-grid-item" data-helmet-item="">
                    <HelmetFrameSvgs active={isHover} />

                    <div className="shc-img-w helmet-grid-item-img-w">
                      <div className="shc-img-inner helmet-grid-item-img-helmet-w">
                        <img
                          className="shc-img-helmet helmet-grid-item-img-helmet"
                          src={logoSrc}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          sizes="(max-width: 900px) 50vw, 25vw"
                        />
                      </div>
                    </div>

                    <div
                      className="skills-hall-learned-panel"
                      style={{ ["--learn-pct" as string]: String(s.learnedPct) }}
                      aria-hidden
                    >
                      <div className="skills-hall-pct-wheel">
                        <svg className="skills-hall-pct-svg" viewBox="0 0 100 100" aria-hidden>
                          <g transform="rotate(-90 50 50)">
                            <circle
                              className="skills-hall-pct-track"
                              cx="50" cy="50" r="40"
                              fill="none"
                              stroke="rgba(245, 243, 235, 0.11)"
                              strokeWidth="4.5"
                              pathLength={100}
                            />
                            <circle
                              className="skills-hall-pct-arc"
                              cx="50" cy="50" r="40"
                              fill="none"
                              stroke="var(--skills-lime)"
                              strokeWidth="4.5"
                              strokeLinecap="round"
                              pathLength={100}
                            />
                          </g>
                        </svg>
                        <span className="skills-hall-learned-pct">{s.learnedPct}%</span>
                      </div>
                    </div>

                    <div className="shc-text-w helmet-grid-item-text-w">
                      <h3 className="shc-title text-title-small-label text">{s.name}</h3>
                      <div className="shc-date-w helmet-grid-item-date-w">
                        <div className="shc-date text-title-small-label date">{s.tag}</div>
                      </div>
                      <div className="shc-extender helmet-grid-extender" aria-hidden />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .skills-hall {
          --skills-lime: #d2ff00;
          --skills-muted: rgba(180, 182, 176, 0.92);
          --skills-lime-dim: rgba(210, 255, 0, 0.72);
          position: relative;
          overflow: hidden;
          z-index: 1;
          background: #2d3222;
          color: #f5f3eb;
          padding: clamp(3rem, 8vw, 5.5rem) clamp(1.25rem, 4vw, 2.75rem)
            clamp(4rem, 10vw, 6rem);
        }

        .skills-hall-inner {
          max-width: 1240px;
          margin: 0 auto;
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

        .title-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(1.5rem, 4vw, 3rem);
          align-items: start;
          margin-bottom: 0;
        }

        @media (max-width: 720px) {
          .title-layout {
            grid-template-columns: 1fr;
          }
        }

        .title-headline-w {
          display: flex;
          flex-direction: column;
          gap: 0.12em;
        }

        .skills-hall-title-mona.text-title-lg {
          font-family: "Inter", system-ui, sans-serif;
          font-weight: 800;
          font-size: clamp(2rem, 4.5vw, 3.35rem);
          line-height: 0.98;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: #fff;
          margin: 0;
        }

        .skills-hall-title-brier.text-title-lg-brier {
          font-family: "Fraunces", "Georgia", serif;
          font-weight: 700;
          font-size: clamp(2.2rem, 5vw, 3.85rem);
          line-height: 0.92;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          margin: 0;
          font-variation-settings: "opsz" 72;
        }

        .c-lime-off {
          color: var(--skills-lime-dim);
        }

        .skills-hall-line {
          display: inline-block;
          position: relative;
          text-align: start;
          padding-bottom: 0.08em;
        }

        .skills-hall-line-txt {
          position: relative;
          z-index: 2;
        }

        /* Lime strip â€” Webflow â€œhigh-line-revealâ€ (simplified as underline sweep) */
        .skills-high-line-reveal {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 0.22em;
          min-height: 3px;
          background: var(--skills-lime);
          transform: scaleX(0);
          transform-origin: left center;
          z-index: 1;
          pointer-events: none;
        }

        .skills-hall-intro-w {
          justify-self: end;
        }

        .skills-hall-split-intro {
          max-width: 42ch;
        }

        .skills-hall-intro-line {
          margin: 0 0 0.5rem;
          font-family: "Inter", system-ui, sans-serif;
          font-size: clamp(0.78rem, 1.3vw, 0.92rem);
          line-height: 1.55;
          color: var(--skills-muted);
        }

        .skills-hall-intro-line:last-child {
          margin-bottom: 0;
        }

        @media (max-width: 720px) {
          .skills-hall-intro-w {
            justify-self: start;
          }
        }

        .skills-hall-spacer.spacer-8 {
          min-height: clamp(3rem, 8.75vw, 5.5rem);
        }

        /* 4-col bento rhythm: cols 1 & 3 align to top; cols 2 & 4 shifted down (reference screenshot) */
        .skills-hall-grid--lando {
          --hall-col-drop: clamp(2.75rem, 7.2vw, 6.25rem);
          margin: 0;
          /* Extra bottom space so staggered last-row cards aren't cut off */
          padding: 0 0 var(--hall-col-drop);
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          grid-auto-rows: auto;
          grid-auto-flow: row;
          gap: clamp(1.1rem, 2.2vw, 1.75rem);
          align-items: start;
        }

        .skills-hall-grid--lando .skills-hall-card {
          min-width: 0;
        }

        @media (min-width: 521px) {
          .skills-hall-grid--lando .skills-hall-card--col-stagger {
            transform: translate3d(0, var(--hall-col-drop), 0);
          }
        }

        @media (max-width: 900px) and (min-width: 521px) {
          .skills-hall-grid--lando {
            --hall-col-drop: clamp(1.35rem, 3.8vw, 2.85rem);
          }
        }

        .skills-hall-card-shift {
          width: 100%;
        }

        @media (max-width: 900px) {
          .skills-hall-grid--lando {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .skills-hall-grid--lando .skills-hall-card {
            grid-column: span 1 !important;
          }
        }

        @media (max-width: 520px) {
          .skills-hall-grid--lando {
            grid-template-columns: minmax(0, 1fr);
          }
          .skills-hall-grid--lando .skills-hall-card {
            transform: none !important;
          }
        }

        /* â”€â”€ Card shell â”€â”€ */
        .skills-hall-card { outline: none; }

        .shc-shift { width: 100%; }

        .shc-card {
          position: relative;
          width: 100%;
          aspect-ratio: 407 / 411;
          background: rgba(8, 11, 6, 0.72);
          overflow: hidden;
        }

        .skills-hall-card-frame-w {
          position: absolute;
          inset: 0;
          z-index: 6;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .skills-hall-card-frame-w .skills-hall-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .skills-hall-svg--base  { z-index: 1; }
        .skills-hall-svg--overlay { z-index: 2; }
        .skills-hall-svg--overlay path {
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .skills-hall-svg--overlay path.is-on { opacity: 1; }
        /* % ring on hover */
        .skills-hall-learned-panel {
          --learn-pct: 0;
          position: absolute;
          inset: 0;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(ellipse 70% 65% at 50% 45%, rgba(8,11,6,0.9) 0%, rgba(8,11,6,0.6) 55%, transparent 85%);
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: opacity 0.32s ease, visibility 0.32s ease;
        }
        .skills-hall-card.is-hover .skills-hall-learned-panel { opacity: 1; visibility: visible; }

        .skills-hall-pct-wheel {
          position: relative;
          width: min(52%, 148px);
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: scale(0.92);
          transition: transform 0.4s cubic-bezier(0.22, 0.9, 0.28, 1);
        }
        .skills-hall-card.is-hover .skills-hall-pct-wheel { transform: scale(1); }
        .skills-hall-pct-svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
        .skills-hall-pct-arc {
          stroke-dasharray: 0.01 100;
          transition: stroke-dasharray 0.78s cubic-bezier(0.22, 0.85, 0.2, 1);
        }
        .skills-hall-card.is-hover .skills-hall-pct-arc {
          stroke-dasharray: var(--learn-pct) calc(100 - var(--learn-pct));
        }
        .skills-hall-learned-pct {
          position: relative; z-index: 1;
          font-family: "Inter", system-ui, sans-serif;
          font-size: clamp(1.05rem, 2.4vw, 1.4rem);
          font-weight: 800; letter-spacing: 0.02em; line-height: 1;
          color: var(--skills-lime);
          text-shadow: 0 1px 14px rgba(210, 255, 0, 0.22);
        }
        @media (prefers-reduced-motion: reduce) {
          .skills-hall-pct-arc { transition: none; }
          .skills-hall-pct-wheel { transition: none; transform: scale(1); }
          .skills-hall-card.is-hover .skills-hall-pct-arc {
            stroke-dasharray: var(--learn-pct) calc(100 - var(--learn-pct));
          }
        }

        /* Full-card logo (Lando-style image block) */
        .shc-img-w {
          position: absolute;
          inset: 0;
          z-index: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(0.65rem, 2.1vw, 1rem);
        }
        .shc-img-inner {
          position: relative;
          width: min(88%, 200px);
          height: min(88%, 200px);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .shc-img-helmet {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 2px 18px rgba(0, 0, 0, 0.35));
        }

        .shc-text-w {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          z-index: 4;
          padding: 0.5rem 0.65rem 0.55rem 0.75rem;
          padding-top: 2.25rem;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: flex-end;
          text-align: right;
          gap: 0.12rem;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .skills-hall-card.is-hover .shc-text-w { opacity: 0; }
        .shc-extender {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          top: -35%;
          z-index: 0;
          background:
            linear-gradient(
              175deg,
              rgba(5, 8, 4, 0) 0%,
              rgba(5, 8, 4, 0.32) 38%,
              rgba(5, 8, 4, 0.82) 100%
            );
          box-shadow: inset 0 -1px 0 rgba(210, 255, 0, 0.1);
        }
        .shc-text-w :is(h3, .shc-date-w) { position: relative; z-index: 1; }
        .shc-title {
          font-family: "Bebas Neue", "Bebas", sans-serif;
          font-size: clamp(0.75rem, 1.5vw, 0.95rem);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #f5f3eb;
          margin: 0;
          line-height: 1.1;
          max-width: 100%;
        }
        .shc-date-w { margin: 0; }
        .shc-date {
          font-family: "Inter", system-ui, sans-serif;
          font-size: clamp(0.44rem, 0.75vw, 0.55rem);
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--skills-lime);
          line-height: 1.2;
        }
        .skills-hall-card:focus-visible .skills-hall-svg--overlay path { opacity: 1; }

        /* â”€â”€ Background system â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        .skills-hall-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        /* â”€â”€ Radar HUD SVG â”€â”€ */
        .skills-hud {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        /* Sweep arm rotation */
        .hud-sweep {
          transform-origin: 700px 450px;
          animation: hud-rotate 8s linear infinite;
        }

        @keyframes hud-rotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .hud-sweep { animation: none; }
        }

        /* â”€â”€ Radial glows â”€â”€ */
        .skills-hall-glow-c {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 55vw;
          max-width: 760px;
          aspect-ratio: 1;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle,
            rgba(210, 255, 0, 0.07) 0%,
            rgba(210, 255, 0, 0.03) 40%,
            transparent 70%
          );
          animation: glow-breathe 6s ease-in-out infinite alternate;
        }

        .skills-hall-glow-tl {
          position: absolute;
          top: -10%;
          left: -5%;
          width: 40vw;
          max-width: 500px;
          aspect-ratio: 1;
          background: radial-gradient(circle,
            rgba(210, 255, 0, 0.045) 0%,
            transparent 65%
          );
        }

        .skills-hall-glow-br {
          position: absolute;
          bottom: -10%;
          right: -5%;
          width: 38vw;
          max-width: 460px;
          aspect-ratio: 1;
          background: radial-gradient(circle,
            rgba(210, 255, 0, 0.035) 0%,
            transparent 65%
          );
        }

        @keyframes glow-breathe {
          0%   { opacity: 0.6; transform: translate(-50%, -50%) scale(0.96); }
          100% { opacity: 1;   transform: translate(-50%, -50%) scale(1.04); }
        }

        /* â”€â”€ Pulse rings â”€â”€ */
        .skills-hall-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          aspect-ratio: 1;
          border-radius: 50%;
          border: 1px solid rgba(210, 255, 0, 0.18);
          transform: translate(-50%, -50%) scale(0);
          animation: pulse-ring 6s ease-out infinite;
        }
        .skills-hall-pulse--1 { width: 200px; animation-delay: 0s; }
        .skills-hall-pulse--2 { width: 200px; animation-delay: 2s; }
        .skills-hall-pulse--3 { width: 200px; animation-delay: 4s; }

        @keyframes pulse-ring {
          0%   { transform: translate(-50%, -50%) scale(0.4); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(6);   opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .skills-hall-pulse  { animation: none; opacity: 0; }
          .skills-hall-glow-c { animation: none; }
        }

        /* â”€â”€ Ghost watermark â”€â”€ */
        .skills-hall-bg-wm {
          position: absolute;
          top: -0.06em;
          right: -0.02em;
          font-family: "Bebas Neue", "Bebas", sans-serif;
          font-size: clamp(14rem, 32vw, 28rem);
          line-height: 1;
          color: transparent;
          -webkit-text-stroke: 1px rgba(210, 255, 0, 0.065);
          text-stroke: 1px rgba(210, 255, 0, 0.065);
          letter-spacing: -0.04em;
          pointer-events: none;
          user-select: none;
        }

        /* â”€â”€ Corner brackets â”€â”€ */
        .skills-corner {
          position: absolute;
          width: 60px;
          height: 60px;
          pointer-events: none;
        }
        .skills-corner--tl { top: 1.2rem;    left: 1.2rem;  }
        .skills-corner--tr { top: 1.2rem;    right: 1.2rem; }
        .skills-corner--bl { bottom: 1.2rem; left: 1.2rem;  }
        .skills-corner--br { bottom: 1.2rem; right: 1.2rem; }

        /* Ensure content sits above bg */
        .skills-hall-inner { position: relative; z-index: 1; }
      `}</style>
    </section>
  );
}
