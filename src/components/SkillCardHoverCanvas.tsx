import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; vx: number; vy: number; life: number; max: number };

/**
 * Lime spark burst + soft ring while hover is active (Canvas 2D — no Rive bundle per card).
 */
export function SkillCardHoverCanvas({
  active,
  hue,
}: {
  active: boolean;
  hue: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const tickRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;

    const burst = (w: number, h: number) => {
      const cx = w * 0.5;
      const cy = h * 0.4;
      particlesRef.current = Array.from({ length: 32 }, () => {
        const a = Math.random() * Math.PI * 2;
        const sp = 1.6 + Math.random() * 3.4;
        return {
          x: cx,
          y: cy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 1,
          life: 1,
          max: 32 + Math.random() * 36,
        };
      });
    };

    const loop = () => {
      if (!running) return;
      const canvasEl = canvasRef.current;
      if (!canvasEl) return;

      const w = canvasEl.clientWidth;
      const h = canvasEl.clientHeight;
      if (w < 4 || h < 4) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvasEl.width !== Math.floor(w * dpr) || canvasEl.height !== Math.floor(h * dpr)) {
        canvasEl.width = Math.floor(w * dpr);
        canvasEl.height = Math.floor(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        burst(w, h);
      }

      tickRef.current += 1;
      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.4;
      const lime = `hsla(${hue}, 92%, 55%, `;

      const parts = particlesRef.current;
      let alive = 0;
      for (const p of parts) {
        if (p.life <= 0) continue;
        alive++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.07;
        p.life -= 1 / p.max;
        const alpha = Math.max(0, p.life * 0.9);
        ctx.beginPath();
        ctx.fillStyle = `${lime}${alpha})`;
        ctx.arc(p.x, p.y, 1 + (1 - p.life) * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      if (alive === 0) {
        burst(w, h);
      }

      const pulse = (Math.sin(tickRef.current * 0.07) + 1) * 0.5;
      ctx.strokeStyle = `${lime}${0.14 + pulse * 0.12})`;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.arc(cx, cy, 20 + pulse * 18, 0, Math.PI * 2);
      ctx.stroke();

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [active, hue]);

  if (!active) return null;

  return <canvas ref={canvasRef} className="skill-hover-canvas" aria-hidden />;
}
