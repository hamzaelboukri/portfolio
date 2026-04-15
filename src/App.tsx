import { DistortImageCanvas } from "./components/DistortImageCanvas";
import { RiveAccent } from "./components/RiveAccent";

const IMG_1 = "/images/hero-1.png";
const IMG_2 = "/images/hero-2.png";

export default function App() {
  return (
    <div className="page">
      <header className="header">
        <span className="logo">Portfolio</span>
        <nav className="nav">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Creative developer</p>
          <h1 className="hero-title">
            Always
            <br />
            pushing limits
          </h1>
          <p className="lede">
            Immersive 3D visuals, motion, and craft — built with React, Three.js,
            and Rive.
          </p>
        </div>
        <div className="hero-rive">
          <RiveAccent className="rive-wrap" />
        </div>
      </section>

      <section id="work" className="panel">
        <div className="panel-head">
          <span className="panel-index">01</span>
          <h2 className="panel-title">Featured</h2>
        </div>
        <div className="canvas-wrap">
          <DistortImageCanvas imageUrl={IMG_1} />
        </div>
        <p className="panel-caption">
          Hover the image — the surface bends and ripples like a curved screen.
        </p>
      </section>

      <section className="panel panel-alt">
        <div className="panel-head">
          <span className="panel-index">02</span>
          <h2 className="panel-title">Second look</h2>
        </div>
        <div className="canvas-wrap">
          <DistortImageCanvas imageUrl={IMG_2} />
        </div>
        <p className="panel-caption">
          Move the pointer — the plane tilts in 3D; distortion intensifies on hover.
        </p>
      </section>

      <footer id="contact" className="footer">
        <p>© {new Date().getFullYear()} Portfolio</p>
        <a href="mailto:hello@example.com">hello@example.com</a>
      </footer>

      <style>{`
        .page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem 1.25rem 4rem;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(244, 244, 240, 0.08);
        }

        .logo {
          font-family: "Bebas Neue", sans-serif;
          font-size: 1.5rem;
          letter-spacing: 0.08em;
          color: var(--lime);
        }

        .nav {
          display: flex;
          gap: 1.5rem;
          font-size: 0.9rem;
        }

        .nav a {
          color: var(--muted);
        }

        .nav a:hover {
          color: var(--fg);
        }

        .hero {
          display: grid;
          gap: 2rem;
          padding: 3rem 0 4rem;
          grid-template-columns: 1fr;
        }

        @media (min-width: 900px) {
          .hero {
            grid-template-columns: 1.1fr 0.9fr;
            align-items: center;
            min-height: 52vh;
          }
        }

        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 0.72rem;
          color: var(--lime);
          margin: 0 0 1rem;
        }

        .hero-title {
          font-size: clamp(3.5rem, 12vw, 7rem);
          margin: 0 0 1.25rem;
        }

        .lede {
          max-width: 28rem;
          line-height: 1.6;
          color: var(--muted);
          margin: 0;
          font-size: 1rem;
        }

        .hero-rive {
          min-height: 220px;
          border-radius: 1rem;
          border: 1px solid rgba(200, 255, 0, 0.15);
          background: radial-gradient(
            ellipse at 30% 20%,
            rgba(200, 255, 0, 0.08),
            transparent 55%
          );
          overflow: hidden;
        }

        .rive-wrap {
          width: 100%;
          height: 280px;
        }

        @media (min-width: 900px) {
          .rive-wrap {
            height: 320px;
          }
        }

        .panel {
          padding: 3rem 0;
        }

        .panel-alt {
          border-top: 1px solid rgba(244, 244, 240, 0.06);
        }

        .panel-head {
          display: flex;
          align-items: baseline;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .panel-index {
          font-family: "Bebas Neue", sans-serif;
          font-size: 1.25rem;
          color: var(--lime);
        }

        .panel-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          margin: 0;
        }

        .canvas-wrap {
          width: 100%;
          height: min(72vh, 640px);
          border-radius: 1rem;
          overflow: hidden;
          border: 1px solid rgba(244, 244, 240, 0.08);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.55);
        }

        .distort-canvas {
          display: block;
          width: 100%;
          height: 100%;
          touch-action: none;
        }

        .panel-caption {
          margin: 1rem 0 0;
          font-size: 0.9rem;
          color: var(--muted);
          max-width: 36rem;
        }

        .footer {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(244, 244, 240, 0.08);
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--muted);
        }

        .footer a {
          color: var(--fg);
        }
      `}</style>
    </div>
  );
}
