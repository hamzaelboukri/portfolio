import type { ReactNode } from "react";
import { FooterScrollReveal } from "./FooterScrollReveal";

const EMAIL = "hamzaelboukri01@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/hamzaelboukri";
const GITHUB_URL = "https://github.com/hamzaelboukri";

type Props = { isBooting: boolean };

function IconMail() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2 7l10 6 10-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.5 1.12 2.5 2.5zM.5 8h4V23h-4V8zm7.5 0h3.8v2h.1c.5-1 1.8-2.1 3.7-2.1 4 0 4.7 2.6 4.7 6v7h-4v-6.2c0-1.5 0-3.3-2-3.3s-2.3 1.6-2.3 3.2V23h-4V8z" />
    </svg>
  );
}

function IconGitHub() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 007.9 10.9c.58.1.79-.25.79-.55v-2c-3.2.7-3.9-1.3-3.9-1.3-.53-1.35-1.3-1.7-1.3-1.7-1.05-.72.08-.7.08-.7 1.15.08 1.75 1.2 1.75 1.2 1.02 1.75 2.7 1.25 3.35.95.1-.75.4-1.25.73-1.55-2.55-.3-5.2-1.28-5.2-5.7 0-1.25.45-2.28 1.2-3.08-.12-.3-.52-1.52.1-3.15 0 0 .98-.32 3.2 1.2a10.8 10.8 0 013-.4c1.02 0 2.04.14 3 .4 2.2-1.52 3.2-1.2 3.2-1.2.62 1.63.22 2.85.1 3.15.75.8 1.2 1.83 1.2 3.08 0 4.45-2.65 5.4-5.2 5.7.42.35.8 1.05.8 2.1v3.1c0 .3.2.65.8.55A11.5 11.5 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

const links: {
  id: string;
  label: string;
  sub: string;
  href: string;
  external?: boolean;
  icon: () => ReactNode;
}[] = [
  { id: "mail", label: "Email", sub: EMAIL, href: `mailto:${EMAIL}`, icon: IconMail },
  {
    id: "in",
    label: "LinkedIn",
    sub: "Hamza Elboukri",
    href: LINKEDIN_URL,
    external: true,
    icon: IconLinkedIn,
  },
  { id: "gh", label: "GitHub", sub: "hamzaelboukri", href: GITHUB_URL, external: true, icon: IconGitHub },
];

export function RacingFooter({ isBooting }: Props) {
  return (
    <FooterScrollReveal
      id="contact"
      className={`rf-landing landing-footer${isBooting ? " is-booting" : ""}`}
      aria-labelledby="contact-heading"
    >
      <h2 className="rf-sr" id="contact-heading">
        Contact
      </h2>

      <div className="rf-surface" aria-hidden>
        <div className="rf-strip" />
        <div className="rf-check" />
        <ul className="rf-lights" aria-hidden>
          <li className="rf-light rf-light--r" />
          <li className="rf-light" />
          <li className="rf-light" />
          <li className="rf-light" />
          <li className="rf-light" />
        </ul>
        <div className="rf-line" />
      </div>

      <div className="rf-inner">
        <div className="rf-hero">
          <p className="rf-eyebrow">Contact</p>
          <p className="rf-title" aria-hidden>
            <span className="rf-title-a">Open</span>
            <span className="rf-title-b">channel</span>
          </p>
          <p className="rf-lede">Fast replies by email or DM — happy to find a time to talk.</p>
        </div>

        <ul className="rf-grid" role="list">
          {links.map((l) => (
            <li key={l.id} className="rf-card">
              <a
                className="rf-link"
                href={l.href}
                {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                <span className="rf-ico" aria-hidden>
                  {l.icon()}
                </span>
                <span className="rf-meta">
                  <span className="rf-lab">{l.label}</span>
                  <span className="rf-sub">{l.sub}</span>
                </span>
                <span className="rf-go" aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 17L17 7M7 7h10v10"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="rf-bottom">
          <p className="rf-copy">
            &copy; {new Date().getFullYear()} Hamza Elboukri
            <span className="rf-copy-dot" />
            <span className="rf-tag">Full-stack developer · YouCode</span>
          </p>
        </div>
      </div>

      <style>{`
        .rf-landing {
          --rf-lime: #d2ff00;
          --rf-ink: #0a0a0a;
          --rf-carbon: #0c0d0a;
          --rf-asphalt: #141612;
          --rf-tire: #1c1e18;
          --rf-mist: rgba(245, 243, 235, 0.54);
          position: relative;
          z-index: 1;
          overflow: hidden;
          color: #f5f3eb;
          background: var(--rf-asphalt);
          border-top: 1px solid rgba(210, 255, 0, 0.16);
        }

        .rf-sr {
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

        .rf-surface { position: absolute; inset: 0; pointer-events: none; z-index: 0; }

        .rf-strip {
          position: absolute;
          top: 0; left: 0; right: 0; height: 5px;
          background: linear-gradient(90deg,
            var(--rf-carbon) 0%,
            var(--rf-carbon) 12%,
            #f5f3eb 12%,
            #f5f3eb 20%,
            var(--rf-lime) 20%,
            var(--rf-lime) 32%,
            var(--rf-carbon) 32%,
            var(--rf-carbon) 100%
          );
        }
        .rf-check {
          position: absolute;
          top: 5px; left: 0; right: 0; height: 6px;
          background:
            linear-gradient(90deg, #0a0a0a 50%, #f0f0e8 50%) 0 0 / 8px 8px;
          opacity: 0.22;
        }
        .rf-lights {
          position: absolute;
          top: 1.15rem; right: clamp(0.8rem, 3vw, 1.5rem);
          display: flex; gap: 0.3rem; list-style: none; margin: 0; padding: 0;
        }
        .rf-light {
          width: 0.4rem; height: 0.4rem; border-radius: 50%;
          background: #1a1a1a; border: 1px solid rgba(255,255,255,0.08);
        }
        .rf-light--r { background: #e10600; box-shadow: 0 0 8px #e10600; }
        .rf-line {
          position: absolute; left: 0; right: 0; top: 3.1rem; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(210,255,0,0.25) 20%, rgba(210,255,0,0.1) 80%, transparent);
        }

        .rf-inner {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 3.1rem clamp(1.1rem, 3.2vw, 2rem) 1.8rem;
        }

        .rf-eyebrow {
          font-size: 0.65rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--rf-lime);
          margin-bottom: 0.35rem;
        }
        .rf-hero { margin-bottom: 1.75rem; }
        .rf-title {
          display: flex;
          flex-wrap: wrap;
          gap: 0.2em 0.35em;
          align-items: baseline;
          font-family: "Bebas Neue", "Bebas", Impact, sans-serif;
          font-size: clamp(2.2rem, 6.2vw, 3.4rem);
          line-height: 0.9;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          margin: 0 0 0.5rem;
        }
        .rf-title-b { color: var(--rf-lime); }
        .rf-lede { font-size: 0.9rem; line-height: 1.5; color: var(--rf-mist); max-width: 28rem; }

        .rf-grid {
          list-style: none;
          margin: 0 0 1.75rem; padding: 0;
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.65rem;
        }
        @media (min-width: 640px) {
          .rf-grid { grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        }

        .rf-card {
          position: relative;
          border-radius: 10px;
          background: linear-gradient(145deg, rgba(8,9,6,0.95) 0%, rgba(18,20,16,0.85) 100%);
          border: 1px solid rgba(245, 243, 235, 0.08);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
        }
        .rf-card::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; height: 2px; border-radius: 10px 10px 0 0;
          background: linear-gradient(90deg, transparent, var(--rf-lime), transparent);
          opacity: 0.4;
        }

        .rf-link {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          padding: 1rem 1.05rem;
          text-decoration: none;
          color: inherit;
          min-height: 3.4rem;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
        }
        .rf-link:hover {
          background: rgba(210, 255, 0, 0.06);
        }
        .rf-link:focus-visible {
          outline: 2px solid var(--rf-lime);
          outline-offset: 2px;
        }

        .rf-ico {
          flex-shrink: 0;
          width: 2.4rem; height: 2.4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          color: var(--rf-lime);
          background: rgba(210, 255, 0, 0.08);
          border: 1px solid rgba(210, 255, 0, 0.2);
        }
        .rf-meta { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.1rem; }
        .rf-lab {
          font-size: 0.62rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--rf-mist);
        }
        .rf-sub {
          font-size: 0.95rem;
          font-weight: 600;
          color: #f5f3eb;
          word-break: break-all;
        }
        .rf-go { flex-shrink: 0; color: rgba(245, 243, 235, 0.35); transition: color 0.2s, transform 0.2s; }
        .rf-link:hover .rf-go { color: var(--rf-lime); transform: translate(2px, -2px); }

        .rf-bottom { padding-top: 0.5rem; border-top: 1px solid rgba(245, 243, 235, 0.08); }
        .rf-copy { font-size: 0.78rem; color: var(--rf-mist); display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; }
        .rf-copy-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--rf-lime); opacity: 0.5; }
        .rf-tag { font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(245, 243, 235, 0.35); }
      `}</style>
    </FooterScrollReveal>
  );
}
