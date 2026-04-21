import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Skills grid inspired by Lando Norris site “Hall of Fame” blocks:
 * dark canvas, staggered grid, notched cards, lime accent labels.
 * Skill list sourced from hamzaelboukri_cv.pdf (technical stack & tools).
 */

const SKILLS: {
  name: string;
  tag: string;
  /** hue for abstract “helmet” fill */
  hue: number;
}[] = [
  { name: "TypeScript", tag: "Languages", hue: 200 },
  { name: "Java", tag: "Languages", hue: 32 },
  { name: "JavaScript", tag: "Languages", hue: 52 },
  { name: "PHP", tag: "Languages", hue: 280 },
  { name: "React", tag: "Front-end", hue: 195 },
  { name: "Next.js", tag: "Front-end", hue: 210 },
  { name: "Spring Boot", tag: "Back-end", hue: 140 },
  { name: "Node.js", tag: "Back-end", hue: 95 },
  { name: "NestJS", tag: "Back-end", hue: 88 },
  { name: "Express", tag: "Back-end", hue: 75 },
  { name: "Laravel", tag: "Back-end", hue: 350 },
  { name: "MySQL", tag: "SGBD", hue: 215 },
  { name: "PostgreSQL", tag: "SGBD", hue: 220 },
  { name: "MongoDB", tag: "SGBD", hue: 125 },
  { name: "Docker", tag: "DevOps", hue: 200 },
  { name: "Kubernetes", tag: "DevOps", hue: 205 },
  { name: "Jenkins", tag: "DevOps", hue: 15 },
  { name: "CI/CD", tag: "DevOps", hue: 40 },
  { name: "AWS", tag: "Cloud", hue: 38 },
  { name: "Figma", tag: "Design", hue: 265 },
  { name: "UML · ERD", tag: "Modeling", hue: 300 },
  { name: "Agile · Scrum", tag: "Methods", hue: 160 },
  { name: "Git", tag: "Tools", hue: 25 },
  { name: "Postman", tag: "Tools", hue: 330 },
  { name: "Jira", tag: "Tools", hue: 240 },
];

export function SkillsHallOfFame() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const headerEls = root.querySelectorAll(".skills-hall-header > *");
    const cards = root.querySelectorAll(".skills-hall-card");

    const ctx = gsap.context(() => {
      gsap.from(headerEls, {
        y: 48,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: root.querySelector(".skills-hall-header"),
          start: "top 82%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      gsap.from(cards, {
        y: 52,
        opacity: 0,
        duration: 0.55,
        ease: "power2.out",
        stagger: { each: 0.035, from: "start" },
        scrollTrigger: {
          trigger: root.querySelector(".skills-hall-grid"),
          start: "top 90%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    }, root);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="skills-hall"
      id="skills"
      aria-labelledby="skills-hall-heading"
    >
      <div className="skills-hall-inner">
        <header className="skills-hall-header">
          <div className="skills-hall-titles">
            <h2 id="skills-hall-heading" className="skills-hall-line-a">
              Compétences
            </h2>
            <p className="skills-hall-line-b">Hall of fame</p>
          </div>
          <p className="skills-hall-intro">
            Stack et outils issus de mon parcours YouCode, de stages (Experts Human
            Capital) et de projets full-stack MERN / Java — conception UI/UX sur Figma,
            livraison avec Git, Docker et pipelines CI/CD.
          </p>
        </header>

        <ul className="skills-hall-grid">
          {SKILLS.map((s, i) => (
            <li
              key={`${s.name}-${i}`}
              className="skills-hall-card"
              style={
                {
                  "--skill-hue": s.hue,
                  "--stagger": `${(i % 5) * 14}px`,
                } as CSSProperties
              }
            >
              <div className="skills-hall-card-frame">
                <div className="skills-hall-card-visual" aria-hidden>
                  <span className="skills-hall-card-glow" />
                  <span className="skills-hall-card-initial">
                    {s.name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase() ||
                      s.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="skills-hall-card-notch" aria-hidden />
                <div className="skills-hall-card-label">
                  <span className="skills-hall-card-name">{s.name}</span>
                  <span className="skills-hall-card-tag">{s.tag}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        .skills-hall {
          --skills-black: #000000;
          --skills-line: rgba(255, 255, 255, 0.14);
          --skills-lime: #d9ff00;
          --skills-gold: #c4b896;
          --skills-muted: rgba(245, 243, 235, 0.72);
          position: relative;
          z-index: 1;
          background: var(--skills-black);
          color: #f5f3eb;
          padding: clamp(3rem, 8vw, 5.5rem) clamp(1.25rem, 4vw, 2.75rem)
            clamp(4rem, 10vw, 6rem);
        }

        .skills-hall-inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        .skills-hall-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(1.5rem, 4vw, 3rem);
          align-items: start;
          margin-bottom: clamp(2.5rem, 6vw, 3.75rem);
        }

        @media (max-width: 720px) {
          .skills-hall-header {
            grid-template-columns: 1fr;
          }
        }

        .skills-hall-line-a {
          font-family: "Inter", system-ui, sans-serif;
          font-weight: 800;
          font-size: clamp(2rem, 4.5vw, 3.25rem);
          line-height: 0.95;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: #fff;
          margin: 0;
        }

        .skills-hall-line-b {
          font-family: "Fraunces", "Georgia", serif;
          font-weight: 700;
          font-size: clamp(2.35rem, 5.5vw, 4rem);
          line-height: 0.9;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: var(--skills-gold);
          margin: 0.15em 0 0;
          font-variation-settings: "opsz" 72;
        }

        .skills-hall-intro {
          font-family: "Inter", system-ui, sans-serif;
          font-size: clamp(0.8rem, 1.35vw, 0.95rem);
          line-height: 1.65;
          color: var(--skills-muted);
          margin: 0;
          max-width: 38ch;
          justify-self: end;
        }

        @media (max-width: 720px) {
          .skills-hall-intro {
            justify-self: start;
            max-width: none;
          }
        }

        .skills-hall-grid {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(1rem, 2.5vw, 1.35rem);
        }

        @media (max-width: 900px) {
          .skills-hall-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 520px) {
          .skills-hall-grid {
            grid-template-columns: 1fr;
          }
        }

        .skills-hall-card {
          margin-top: var(--stagger, 0);
        }

        @media (max-width: 520px) {
          .skills-hall-card {
            margin-top: 0 !important;
          }
        }

        .skills-hall-card-frame {
          position: relative;
          height: clamp(168px, 22vw, 220px);
          border: 1px solid var(--skills-line);
          background: #050505;
          overflow: hidden;
          clip-path: polygon(
            0 0,
            100% 0,
            100% calc(100% - 52px),
            calc(100% - 108px) 100%,
            0 100%
          );
        }

        .skills-hall-card-visual {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(
            65% 70% at 50% 38%,
            hsla(var(--skill-hue, 80), 85%, 48%, 0.35),
            transparent 72%
          );
        }

        .skills-hall-card-glow {
          position: absolute;
          width: 120%;
          height: 120%;
          left: -10%;
          top: -10%;
          background: radial-gradient(
            circle at 50% 50%,
            hsla(var(--skill-hue, 80), 90%, 55%, 0.22),
            transparent 55%
          );
          filter: blur(28px);
          opacity: 0.9;
        }

        .skills-hall-card-initial {
          position: relative;
          z-index: 1;
          font-family: "Bebas Neue", "Inter", sans-serif;
          font-size: clamp(2.5rem, 6vw, 3.25rem);
          letter-spacing: 0.06em;
          color: rgba(255, 255, 255, 0.92);
          text-shadow: 0 0 40px hsla(var(--skill-hue, 80), 80%, 40%, 0.5);
        }

        .skills-hall-card-notch {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 112px;
          height: 52px;
          background: linear-gradient(
            135deg,
            transparent 40%,
            rgba(255, 255, 255, 0.04) 100%
          );
          pointer-events: none;
        }

        .skills-hall-card-label {
          position: absolute;
          right: 0;
          bottom: 0;
          z-index: 2;
          padding: 10px 14px 12px 18px;
          min-width: 108px;
          text-align: right;
        }

        .skills-hall-card-name {
          display: block;
          font-family: "Inter", system-ui, sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #fff;
          line-height: 1.2;
        }

        .skills-hall-card-tag {
          display: block;
          margin-top: 2px;
          font-family: "Inter", system-ui, sans-serif;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--skills-lime);
          line-height: 1.2;
        }
      `}</style>
    </section>
  );
}
