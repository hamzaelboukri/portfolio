import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** devicon (SVG) on jsDelivr — https://github.com/devicons/devicon */
const DV = (icon: string, file: string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${icon}/${file}`;
/** Simple Icons (SVG) for entries without a devicon file */
const SI = (slug: string) => `https://cdn.jsdelivr.net/npm/simple-icons@11.6.0/icons/${slug}.svg`;

/** One logo URL per skill (no second image on hover — only the % badge appears). */
const SKILL_LOGO_BY_NAME: Record<string, string> = {
  TypeScript: DV("typescript", "typescript-original.svg"),
  Java: DV("java", "java-original.svg"),
  JavaScript: DV("javascript", "javascript-original.svg"),
  PHP: DV("php", "php-original.svg"),
  React: DV("react", "react-original.svg"),
  "Next.js": DV("nextjs", "nextjs-original.svg"),
  "Spring Boot": DV("spring", "spring-original.svg"),
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

const EXTENDER_GREY =
  "https://cdn.prod.website-files.com/67b5a02dc5d338960b17a7e9/67e41c00f127bc68e2462635_ln4-2-helm-mask-extender-grey-fade.png";
const EXTENDER_LIME =
  "https://cdn.prod.website-files.com/67b5a02dc5d338960b17a7e9/67e41235ad69136bdc861b67_ln4-2-helm-mask-extender-lime-fade.png";

/**
 * Skills hall — structure inspired by Lando Norris site (Webflow):
 * dual SVG frames (base + lime overlay), split headlines with lime line-reveal,
 * intro lines, one tech logo per card + % on hover + PNG mask extenders, bottom label row.
 */

/** Desktop helmet frame — from site SVG viewBox 0 0 407 411 */
const FRAME_PATH_BASE =
  "M8 .5h390.89a7.5 7.5 0 0 1 7.5 7.5v356.983a7.5 7.5 0 0 1-7.5 7.5H263.329a23.502 23.502 0 0 0-18.375 8.849l-16.499 20.695a22.502 22.502 0 0 1-17.593 8.473H8A7.5 7.5 0 0 1 .5 403V8A7.5 7.5 0 0 1 8 .5Z";

const FRAME_PATH_OVERLAY =
  "M8 1h390.89a7 7 0 0 1 7 7v356.983a7 7 0 0 1-7 7H263.329a23.999 23.999 0 0 0-18.766 9.038l-16.499 20.694A21.999 21.999 0 0 1 210.862 410H8a7 7 0 0 1-7-7V8a7 7 0 0 1 7-7Z";

/** `learnedPct` = how well you know the tech (0–100), shown on card hover. Edit freely. */
const SKILLS: { name: string; tag: string; learnedPct: number }[] = [
  { name: "TypeScript", tag: "Languages", learnedPct: 88 },
  { name: "Java", tag: "Languages", learnedPct: 70 },
  { name: "JavaScript", tag: "Languages", learnedPct: 90 },
  { name: "PHP", tag: "Languages", learnedPct: 78 },
  { name: "React", tag: "Front-end", learnedPct: 92 },
  { name: "Next.js", tag: "Front-end", learnedPct: 85 },
  { name: "Spring Boot", tag: "Back-end", learnedPct: 70 },
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
  "From YouCode and real projects — TypeScript, Java, React, and cloud.",
  "Four-column stepped layout: middle columns sit lower, like the Hall of Fame reference.",
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
      <div className="skills-hall-inner">
        <header className="skills-hall-header title-layout">
          <div className="skills-hall-title-headline title-headline-w">
            <h2 id="skills-hall-heading" className="sr-only">
              Skills
              <br />
              Hall of fame
            </h2>
            <h2 className="skills-hall-title-mona text-title-lg" aria-hidden="true">
              <span className="skills-hall-line">
                <span className="skills-hall-line-txt">Skills</span>
                <span className="skills-high-line-reveal" />
              </span>
            </h2>
            <h2 className="skills-hall-title-brier text-title-lg-brier c-lime-off" aria-hidden="true">
              <span className="skills-hall-line">
                <span className="skills-hall-line-txt">Hall of fame</span>
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
                <div className="skills-hall-card-shift helmet-grid-item-w">
                  <div className="skills-hall-card-item helmet-grid-item" data-helmet-item="">
                    <HelmetFrameSvgs active={isHover} />

                    <div className="skills-hall-card-media helmet-grid-item-img-w">
                      <div className="skills-hall-card-logo-layer">
                        <div className="helmet-grid-item-img-helmet-w">
                          <img
                            className="helmet-grid-item-img-helmet skills-hall-card-img"
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
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="rgba(245, 243, 235, 0.11)"
                                strokeWidth="4.5"
                                pathLength={100}
                              />
                              <circle
                                className="skills-hall-pct-arc"
                                cx="50"
                                cy="50"
                                r="40"
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
                    </div>

                    <div className="skills-hall-card-text-w helmet-grid-item-text-w">
                      <div className="skills-hall-card-extender helmet-grid-extender" aria-hidden>
                        <img className="helmet-grid-extender-img" src={EXTENDER_GREY} alt="" loading="lazy" />
                        <img
                          className={`helmet-grid-extender-img is-overlay${isHover ? " is-on" : ""}`}
                          src={EXTENDER_LIME}
                          alt=""
                          loading="lazy"
                        />
                      </div>
                      <h3 className="skills-hall-card-title-label text-title-small-label text">{s.name}</h3>
                      <div className="skills-hall-card-date-w helmet-grid-item-date-w skills-hall-card-meta-tag">
                        <div className="skills-hall-card-date text-title-small-label date">{s.tag}</div>
                      </div>
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
          --skills-black: #000000;
          --skills-lime: #d2ff00;
          --skills-muted: rgba(180, 182, 176, 0.92);
          --skills-lime-dim: rgba(210, 255, 0, 0.72);
          position: relative;
          z-index: 1;
          background: var(--skills-black);
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

        /* Lime strip — Webflow “high-line-reveal” (simplified as underline sweep) */
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
          padding: 0;
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

        .skills-hall-card {
          outline: none;
        }

        .skills-hall-card-item {
          position: relative;
          width: 100%;
          margin: 0;
          aspect-ratio: 407 / 411;
          height: auto;
          background: #050505;
          overflow: hidden;
        }

        .skills-hall-card-frame-w {
          position: absolute;
          inset: 0;
          z-index: 6;
          pointer-events: none;
        }

        .skills-hall-card-frame-w .skills-hall-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .skills-hall-svg--base {
          z-index: 1;
        }

        .skills-hall-svg--overlay {
          z-index: 2;
        }

        .skills-hall-svg--overlay path {
          opacity: 0;
          transition: opacity 0.35s ease;
        }

        .skills-hall-svg--overlay path.is-on {
          opacity: 1;
        }

        .skills-hall-card-media {
          position: absolute;
          inset: 0;
          z-index: 1;
          overflow: hidden;
        }

        .skills-hall-card-logo-layer {
          position: absolute;
          inset: 0;
          z-index: 2;
          transition: opacity 0.35s ease, visibility 0.35s ease;
        }

        .skills-hall-card-media .helmet-grid-item-img-helmet-w {
          position: absolute;
          inset: 0;
        }

        .skills-hall-card-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: 50% 50%;
          padding: min(11%, 0.9rem);
          box-sizing: border-box;
          display: block;
        }

        .skills-hall-card.is-hover .skills-hall-card-logo-layer {
          opacity: 0;
          visibility: hidden;
        }

        /* Replaces logo on hover: ring “charge” + % (uses --learn-pct on panel) */
        .skills-hall-learned-panel {
          --learn-pct: 0;
          position: absolute;
          inset: 0;
          z-index: 4;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(ellipse 70% 65% at 50% 48%, rgba(10, 10, 10, 0.88) 0%, rgba(5, 5, 5, 0.55) 62%, transparent 88%);
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: opacity 0.32s ease, visibility 0.32s ease;
        }

        .skills-hall-card.is-hover .skills-hall-learned-panel {
          opacity: 1;
          visibility: visible;
        }

        .skills-hall-pct-wheel {
          position: relative;
          width: min(48%, 152px);
          aspect-ratio: 1;
          max-height: 68%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: scale(0.94);
          transition: transform 0.4s cubic-bezier(0.22, 0.9, 0.28, 1);
        }

        .skills-hall-card.is-hover .skills-hall-pct-wheel {
          transform: scale(1);
        }

        .skills-hall-pct-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
        }

        .skills-hall-pct-arc {
          stroke-dasharray: 0.01 100;
          transition: stroke-dasharray 0.78s cubic-bezier(0.22, 0.85, 0.2, 1);
        }

        .skills-hall-card.is-hover .skills-hall-pct-arc {
          stroke-dasharray: var(--learn-pct) calc(100 - var(--learn-pct));
        }

        @media (prefers-reduced-motion: reduce) {
          .skills-hall-pct-arc {
            transition: none;
          }
          .skills-hall-card.is-hover .skills-hall-pct-arc {
            stroke-dasharray: var(--learn-pct) calc(100 - var(--learn-pct));
          }
          .skills-hall-pct-wheel {
            transition: none;
            transform: scale(1);
          }
        }

        .skills-hall-learned-pct {
          position: relative;
          z-index: 1;
          font-family: "Inter", system-ui, sans-serif;
          font-size: clamp(1.05rem, 2.4vw, 1.45rem);
          font-weight: 800;
          letter-spacing: 0.02em;
          line-height: 1;
          color: var(--skills-lime);
          text-shadow: 0 1px 14px rgba(210, 255, 0, 0.22);
        }

        /* Hover: only logo + title + % — hide frame, category tag, bottom fade strip */
        .skills-hall-card-frame-w,
        .skills-hall-card-extender,
        .skills-hall-card-meta-tag {
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .skills-hall-card.is-hover .skills-hall-card-frame-w {
          opacity: 0;
          visibility: hidden;
        }

        .skills-hall-card.is-hover .skills-hall-card-extender.helmet-grid-extender {
          opacity: 0;
          visibility: hidden;
        }

        .skills-hall-card.is-hover .skills-hall-card-meta-tag {
          opacity: 0;
          visibility: hidden;
          max-height: 0;
          margin: 0;
          overflow: hidden;
        }

        .skills-hall-card.is-hover .skills-hall-card-title-label {
          font-size: clamp(0.8rem, 1.6vw, 0.9rem);
          color: #fff;
        }

        .skills-hall-card-text-w {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 7;
          padding: 0.65rem 0.85rem 0.75rem;
          padding-right: 1rem;
          pointer-events: none;
        }

        .skills-hall-card-title-label,
        .skills-hall-card-date-w {
          position: relative;
          z-index: 2;
        }

        .skills-hall-card-title-label {
          font-family: "Inter", system-ui, sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #fff;
          margin: 0;
          line-height: 1.2;
        }

        .skills-hall-card-date-w {
          margin-top: 0.15rem;
        }

        .skills-hall-card-date {
          font-family: "Inter", system-ui, sans-serif;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--skills-lime);
        }

        .skills-hall-card-extender.helmet-grid-extender {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: clamp(40px, 12vw, 52px);
          pointer-events: none;
          overflow: hidden;
        }

        .skills-hall-card-extender .helmet-grid-extender-img {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
          object-position: bottom center;
        }

        .skills-hall-card-extender .helmet-grid-extender-img.is-overlay {
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: 1;
        }

        .skills-hall-card-extender .helmet-grid-extender-img.is-overlay.is-on {
          opacity: 1;
        }

        .skills-hall-card:focus-visible .skills-hall-svg--overlay path {
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
