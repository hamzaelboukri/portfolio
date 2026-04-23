import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    id: "freelance",
    date: "May 2024 — Aug 2024",
    role: "UX/UI Designer",
    type: "Freelance",
    org: "Client engagement",
    location: "Remote",
    project: "E-learning",
    projectTitle: "E-learning platform",
    tech: ["Figma"],
    highlights: [
      "End-to-end UX/UI: conversion-focused landing and four responsive dashboards.",
      "Dedicated spaces for admin, manager, trainer, and learner — tailored flows and assets.",
      "Clear signup funnel and smooth onboarding on the marketing site.",
    ],
  },
  {
    id: "ehc",
    date: "Mar 2025 — Sep 2025",
    role: "Full-stack Developer",
    type: "Internship",
    org: "Experts Human Capital",
    location: "Casablanca · HQ in Meknes",
    project: "Recruit",
    projectTitle: "Internal hiring platform",
    tech: ["Java", "Spring Boot", "React", "Figma", "MySQL", "Git"],
    highlights: [
      "Web app to digitize and track recruitment from intake to hire.",
      "Figma-first UI, then an interactive dashboard (React & Bootstrap) replacing spreadsheets with live KPIs.",
      "Application forms, advanced filters, and full candidate lifecycle management.",
      "UX/UI across landing plus three roles — candidate, recruiter, and administrator.",
    ],
  },
];

const education = {
  years: "2025 — 2026",
  status: "In progress",
  title: "Full-stack developer — year 2",
  stack: "MERN",
  school: "YouCode",
  uni: "Mohammed VI Polytechnic University",
  place: "Youssoufia",
};

const languages = [
  { name: "Arabic", level: "Native" },
  { name: "English", level: "Intermediate" },
  { name: "French", level: "Intermediate" },
];

export function ExperienceSection() {
  const rootRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const eduRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      if (headRef.current) {
        const lines = headRef.current.querySelectorAll(".exp-head-chunk");
        gsap.fromTo(
          lines,
          { y: 48, opacity: 0, rotateX: -12 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: { trigger: headRef.current, start: "top 86%", once: true },
          }
        );
        gsap.fromTo(
          headRef.current.querySelectorAll(".exp-head-sub *"),
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.05,
            delay: 0.2,
            ease: "power2.out",
            scrollTrigger: { trigger: headRef.current, start: "top 86%", once: true },
          }
        );
      }

      if (listRef.current) {
        const items = listRef.current.querySelectorAll(".exp-node");
        items.forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
            }
          );
        });
      }

      if (eduRef.current) {
        gsap.fromTo(
          eduRef.current,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: eduRef.current, start: "top 91%", once: true },
          }
        );
      }

      if (langRef.current) {
        const chips = langRef.current.querySelectorAll("li");
        gsap.fromTo(
          chips,
          { opacity: 0, scale: 0.92, y: 16 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "back.out(1.2)",
            scrollTrigger: { trigger: langRef.current, start: "top 92%", once: true },
          }
        );
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="experience"
      className="exp-root"
      data-nav-theme-target="light"
      aria-labelledby="exp-heading"
    >
      <div className="exp-bg" aria-hidden>
        <div className="exp-bg-grid" />
        <div className="exp-bg-orb" />
        <div className="exp-bg-trace" />
        <svg className="exp-bg-noise" xmlns="http://www.w3.org/2000/svg">
          <filter id="exp-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#exp-noise)" opacity="0.04" />
        </svg>
        <span className="exp-bg-wm" aria-hidden>
          CV
        </span>
      </div>

      <div className="exp-inner">
        <header className="exp-head" ref={headRef}>
          <h2 id="exp-heading" className="exp-heading">
            <span className="exp-head-chunk">Experience</span>
            <span className="exp-head-chunk exp-head-chunk--lime">&</span>
            <span className="exp-head-chunk">education</span>
          </h2>
          <div className="exp-head-sub">
            <p>Internships, freelance work, YouCode studies, and languages — the practical thread.</p>
            <div className="exp-head-pill" aria-hidden>
              <span className="exp-pill-dot" />
              Morocco · 2024 — 2026
            </div>
          </div>
        </header>

        <ol className="exp-timeline" ref={listRef}>
          {experiences.map((e) => (
            <li key={e.id} className="exp-node">
              <div className="exp-node-glow" />
              <div className="exp-node-head">
                <time className="exp-date">{e.date}</time>
                <div className="exp-role">
                  <span className="exp-role-title">{e.role}</span>
                  <span className="exp-role-badge">{e.type}</span>
                </div>
                <p className="exp-org">
                  {e.org}
                  {e.location ? ` · ${e.location}` : ""}
                </p>
              </div>
              <div className="exp-node-body">
                <div className="exp-proj">
                  <span className="exp-proj-k">Project</span>
                  <span className="exp-proj-n">{e.project}</span>
                  <span className="exp-proj-t">{e.projectTitle}</span>
                </div>
                <ul className="exp-bullets">
                  {e.highlights.map((t, i) => (
                    <li key={`${e.id}-h-${i}`}>{t}</li>
                  ))}
                </ul>
                <div className="exp-tags">
                  {e.tech.map((t) => (
                    <span key={t} className="exp-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="exp-bottom">
          <div className="exp-edu" ref={eduRef}>
            <h3 className="exp-subh">Education</h3>
            <div className="exp-edu-card">
              <div className="exp-edu-top">
                <span className="exp-edu-years">{education.years}</span>
                <span className="exp-edu-pill">{education.status}</span>
              </div>
              <p className="exp-edu-line">
                <strong>{education.title}</strong> · {education.stack}
              </p>
              <p className="exp-edu-school">
                {education.school} · {education.uni}
                <br />
                <span className="exp-edu-place">{education.place}</span>
              </p>
            </div>
          </div>

          <div className="exp-langs">
            <h3 className="exp-subh">Languages</h3>
            <ul className="exp-lang-chips" ref={langRef}>
              {languages.map((l) => (
                <li key={l.name} className="exp-lang">
                  <span className="exp-lang-n">{l.name}</span>
                  <span className="exp-lang-l">{l.level}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .exp-root {
          --exp-lime: #d2ff00;
          --exp-ink: #0c0d0a;
          --exp-paper: #f5f3eb;
          --exp-muted: rgba(245, 243, 235, 0.55);
          --exp-line: rgba(210, 255, 0, 0.22);
          --exp-card: rgba(8, 11, 6, 0.55);
          position: relative;
          overflow: hidden;
          color: var(--exp-paper);
          background: linear-gradient(165deg, #1a1e14 0%, #0f120c 38%, #12160f 100%);
        }

        .exp-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .exp-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(210, 255, 0, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(210, 255, 0, 0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 20%, black 0%, transparent 70%);
        }
        .exp-bg-orb {
          position: absolute;
          top: -20%;
          right: -10%;
          width: min(55vw, 720px);
          aspect-ratio: 1;
          background: radial-gradient(circle, rgba(210, 255, 0, 0.12) 0%, transparent 68%);
          filter: blur(2px);
        }
        .exp-bg-trace {
          position: absolute;
          left: 0; right: 0; top: 22%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--exp-line), transparent);
        }
        .exp-bg-noise {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .exp-bg-wm {
          position: absolute;
          right: 4%;
          bottom: 6%;
          font-family: "Bebas Neue", "Bebas", Impact, sans-serif;
          font-size: clamp(4rem, 16vw, 12rem);
          line-height: 0.88;
          letter-spacing: 0.02em;
          color: rgba(245, 243, 235, 0.03);
          user-select: none;
        }

        .exp-inner {
          position: relative;
          z-index: 1;
          max-width: 1120px;
          margin: 0 auto;
          padding: clamp(3.2rem, 7vw, 5.5rem) clamp(1.25rem, 4vw, 2.5rem) clamp(3.5rem, 8vw, 5rem);
        }

        .exp-head { margin-bottom: clamp(2rem, 4vw, 2.75rem); }
        .exp-heading {
          display: flex;
          flex-wrap: wrap;
          gap: 0.2em 0.35em;
          align-items: baseline;
          font-family: "Bebas Neue", "Bebas", Impact, sans-serif;
          font-size: clamp(2.6rem, 8.5vw, 4.4rem);
          line-height: 0.95;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        .exp-head-chunk--lime { color: var(--exp-lime); }
        .exp-head-sub {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem 1.5rem;
          align-items: center;
          margin-top: 1.1rem;
        }
        .exp-head-sub p {
          max-width: 32rem;
          font-size: 0.95rem;
          line-height: 1.55;
          color: var(--exp-muted);
        }
        .exp-head-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.32rem 0.7rem 0.35rem;
          border: 1px solid var(--exp-line);
          border-radius: 999px;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--exp-muted);
        }
        .exp-pill-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--exp-lime);
          box-shadow: 0 0 10px var(--exp-lime);
        }

        .exp-timeline {
          list-style: none;
          margin: 0 0 2.5rem;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }
        .exp-node {
          position: relative;
          border-radius: 16px;
          border: 1px solid rgba(245, 243, 235, 0.1);
          background: var(--exp-card);
          padding: 1.35rem 1.35rem 1.45rem;
          overflow: hidden;
          backdrop-filter: blur(8px);
        }
        @supports not (backdrop-filter: blur(8px)) {
          .exp-node { background: rgba(18, 22, 15, 0.92); }
        }
        .exp-node-glow {
          position: absolute;
          top: -1px; left: 20%;
          right: 20%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--exp-lime), transparent);
          opacity: 0.5;
        }
        .exp-node-head { margin-bottom: 1rem; }
        .exp-date {
          display: block;
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--exp-lime);
          margin-bottom: 0.45rem;
        }
        .exp-role { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem; }
        .exp-role-title {
          font-family: "Bebas Neue", "Bebas", sans-serif;
          font-size: clamp(1.35rem, 3.5vw, 1.9rem);
          letter-spacing: 0.04em;
        }
        .exp-role-badge {
          font-size: 0.65rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 0.2rem 0.45rem;
          border: 1px solid var(--exp-line);
          color: var(--exp-muted);
          border-radius: 4px;
        }
        .exp-org { font-size: 0.9rem; color: var(--exp-muted); }

        .exp-proj { margin-bottom: 0.9rem; }
        .exp-proj-k {
          display: block;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--exp-muted);
          margin-bottom: 0.2rem;
        }
        .exp-proj-n {
          display: block;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--exp-paper);
        }
        .exp-proj-t { font-size: 0.9rem; color: var(--exp-muted); }

        .exp-bullets {
          margin: 0 0 1rem 0.15rem;
          padding: 0 0 0 1.1rem;
          color: rgba(245, 243, 235, 0.88);
        }
        .exp-bullets li {
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 0.45rem;
        }
        .exp-bullets li::marker { color: var(--exp-lime); }
        .exp-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .exp-tag {
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.3rem 0.5rem;
          background: rgba(210, 255, 0, 0.08);
          border: 1px solid rgba(210, 255, 0, 0.18);
          border-radius: 4px;
          color: rgba(245, 243, 235, 0.92);
        }

        .exp-bottom {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.25rem;
        }
        @media (min-width: 800px) {
          .exp-bottom { grid-template-columns: 1.1fr 0.9fr; gap: 2rem; align-items: start; }
        }
        .exp-subh {
          font-family: "Bebas Neue", "Bebas", sans-serif;
          font-size: 1.4rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 0.9rem;
          color: var(--exp-paper);
        }
        .exp-edu-card {
          border: 1px solid rgba(245, 243, 235, 0.12);
          border-radius: 14px;
          padding: 1.1rem 1.2rem 1.2rem;
          background: linear-gradient(145deg, rgba(210, 255, 0, 0.06) 0%, rgba(8, 11, 6, 0.4) 100%);
        }
        .exp-edu-top { display: flex; flex-wrap: wrap; align-items: center; gap: 0.6rem; margin-bottom: 0.6rem; }
        .exp-edu-years { font-size: 0.85rem; font-weight: 700; color: var(--exp-lime); letter-spacing: 0.04em; }
        .exp-edu-pill {
          font-size: 0.62rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0.2rem 0.5rem;
          border-radius: 999px;
          background: rgba(210, 255, 0, 0.12);
          color: var(--exp-paper);
        }
        .exp-edu-line { font-size: 1.02rem; line-height: 1.4; margin-bottom: 0.5rem; }
        .exp-edu-school { font-size: 0.9rem; line-height: 1.5; color: var(--exp-muted); }
        .exp-edu-place { color: var(--exp-paper); }

        .exp-lang-chips { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
        .exp-lang {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.9rem;
          border-radius: 10px;
          border: 1px solid rgba(245, 243, 235, 0.1);
          background: rgba(0, 0, 0, 0.2);
        }
        .exp-lang-n { font-weight: 600; font-size: 0.95rem; }
        .exp-lang-l { font-size: 0.78rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--exp-lime); }

        @media (max-width: 520px) {
          .exp-heading { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </section>
  );
}
