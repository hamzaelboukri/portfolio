import { useEffect, useRef } from "react";

type Layer = {
  anchor: number;
  amp: number;
  freq: number;
  freq2: number;
  speed: number;
  speed2: number;
  phase: number;
  fillAlpha: number;
  strokeAlpha: number;
};

type Ripple = {
  anchor: number;
  amp: number;
  freq: number;
  speed: number;
  phase: number;
  alpha: number;
  width: number;
};

type WaveFieldCanvasProps = {
  className?: string;
};

/**
 * Full-viewport layered wave field: soft filled bands, contour lines,
 * gradient depth, and thin high-frequency ripples for extra motion.
 */
export function WaveFieldCanvas({ className }: WaveFieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduceMotion = media.matches;
    const motion = reduceMotion ? 0.22 : 1;

    const layers: Layer[] = [
      { anchor: 0.06, amp: 11, freq: 0.0042, freq2: 0.0095, speed: 0.2, speed2: 0.32, phase: 0.2, fillAlpha: 0.032, strokeAlpha: 0.1 },
      { anchor: 0.18, amp: 15, freq: 0.005, freq2: 0.011, speed: 0.26, speed2: 0.4, phase: 1.4, fillAlpha: 0.04, strokeAlpha: 0.12 },
      { anchor: 0.3, amp: 18, freq: 0.0045, freq2: 0.01, speed: 0.22, speed2: 0.36, phase: 2.1, fillAlpha: 0.046, strokeAlpha: 0.13 },
      { anchor: 0.42, amp: 21, freq: 0.0039, freq2: 0.0085, speed: 0.18, speed2: 0.28, phase: 0.5, fillAlpha: 0.052, strokeAlpha: 0.145 },
      { anchor: 0.54, amp: 24, freq: 0.0052, freq2: 0.0125, speed: 0.3, speed2: 0.4, phase: 2.8, fillAlpha: 0.058, strokeAlpha: 0.155 },
      { anchor: 0.66, amp: 27, freq: 0.0044, freq2: 0.0105, speed: 0.24, speed2: 0.36, phase: 1.0, fillAlpha: 0.064, strokeAlpha: 0.168 },
      { anchor: 0.78, amp: 29, freq: 0.0048, freq2: 0.0115, speed: 0.28, speed2: 0.42, phase: 3.6, fillAlpha: 0.068, strokeAlpha: 0.178 },
      { anchor: 0.9, amp: 32, freq: 0.0051, freq2: 0.013, speed: 0.25, speed2: 0.44, phase: 0.85, fillAlpha: 0.072, strokeAlpha: 0.19 },
    ];

    const ripples: Ripple[] = [
      { anchor: 0.14, amp: 5.5, freq: 0.014, speed: 0.55, phase: 0.3, alpha: 0.08, width: 0.95 },
      { anchor: 0.25, amp: 6.2, freq: 0.018, speed: -0.42, phase: 1.7, alpha: 0.072, width: 0.9 },
      { anchor: 0.38, amp: 7, freq: 0.012, speed: 0.38, phase: 2.9, alpha: 0.078, width: 1.0 },
      { anchor: 0.5, amp: 6.5, freq: 0.016, speed: -0.5, phase: 0.9, alpha: 0.07, width: 0.92 },
      { anchor: 0.62, amp: 7.5, freq: 0.013, speed: 0.48, phase: 2.2, alpha: 0.076, width: 0.98 },
      { anchor: 0.74, amp: 8, freq: 0.017, speed: -0.36, phase: 4.1, alpha: 0.072, width: 0.94 },
      { anchor: 0.86, amp: 8.5, freq: 0.015, speed: 0.41, phase: 1.2, alpha: 0.082, width: 1.02 },
      { anchor: 0.2, amp: 4.5, freq: 0.022, speed: 0.62, phase: 5.0, alpha: 0.062, width: 0.88 },
      { anchor: 0.56, amp: 5, freq: 0.02, speed: -0.58, phase: 3.4, alpha: 0.065, width: 0.9 },
      { anchor: 0.95, amp: 9, freq: 0.011, speed: 0.33, phase: 0.15, alpha: 0.085, width: 1.05 },
    ];

    let raf = 0;
    let t = 0;
    let lastTime = performance.now();
    let width = 0;
    let height = 0;
    const step = 4;

    const waveY = (x: number, time: number, L: Layer, padBottom: number) => {
      const base = height * L.anchor;
      const t1 = time * motion;
      const slow = Math.sin(x * 0.00085 + t1 * 0.06);
      let y =
        base +
        Math.sin(x * L.freq + t1 * L.speed + L.phase) * L.amp +
        Math.sin(x * L.freq2 * 1.65 - t1 * L.speed2 + L.phase * 1.25) * (L.amp * 0.42) +
        Math.sin(x * 0.0011 + t1 * 0.075) * (L.amp * 0.14) +
        slow * (L.amp * 0.08);

      const px = pointerRef.current.x * width;
      const py = pointerRef.current.y * height;
      const dx = x - px;
      const dy = y - py;
      const dist = Math.hypot(dx, dy) + 200;
      const inf = pointerRef.current.active ? (460 / dist) * 26 : 0;
      y += (dy / dist) * inf * inf * 0.52;

      return Math.min(height + padBottom, Math.max(-48, y));
    };

    const rippleY = (x: number, time: number, R: Ripple) => {
      const base = height * R.anchor;
      const t1 = time * motion;
      return (
        base +
        Math.sin(x * R.freq + t1 * R.speed + R.phase) * R.amp +
        Math.sin(x * R.freq * 2.1 - t1 * R.speed * 1.1) * (R.amp * 0.28) +
        Math.sin(x * 0.0009 + t1 * 0.04) * (R.amp * 0.12)
      );
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const onMove = (e: PointerEvent) => {
      if (!width || !height) return;
      pointerRef.current.tx = Math.min(Math.max(e.clientX / width, 0), 1);
      pointerRef.current.ty = Math.min(Math.max(e.clientY / height, 0), 1);
      pointerRef.current.active = true;
    };

    const onLeave = () => {
      pointerRef.current.active = false;
    };

    const draw = (now: number) => {
      const dt = Math.min(0.045, (now - lastTime) / 1000);
      lastTime = now;
      t += dt * 0.95 * motion;

      ctx.clearRect(0, 0, width, height);

      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "rgba(10, 10, 10, 0.028)");
      grad.addColorStop(0.38, "rgba(10, 10, 10, 0.006)");
      grad.addColorStop(0.62, "rgba(10, 10, 10, 0.01)");
      grad.addColorStop(1, "rgba(10, 10, 10, 0.034)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      const p = pointerRef.current;
      p.x += (p.tx - p.x) * 0.08;
      p.y += (p.ty - p.y) * 0.08;

      const padBottom = height * 0.18;
      const bottomEdge = height + padBottom;

      for (let i = 0; i < layers.length - 1; i += 1) {
        const topL = layers[i];
        const botL = layers[i + 1];

        ctx.beginPath();
        for (let x = 0; x <= width; x += step) {
          const y = waveY(x, t, topL, padBottom);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        for (let x = width; x >= 0; x -= step) {
          ctx.lineTo(x, waveY(x, t, botL, padBottom));
        }
        ctx.closePath();
        const fillA = (topL.fillAlpha + botL.fillAlpha) * 0.5;
        ctx.fillStyle = `rgba(10, 10, 10, ${fillA.toFixed(3)})`;
        ctx.fill();
      }

      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      for (const L of layers) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += step) {
          const y = waveY(x, t, L, padBottom);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const pulse = pointerRef.current.active ? 0.055 : 0;
        ctx.strokeStyle = `rgba(10, 10, 10, ${(L.strokeAlpha + pulse).toFixed(3)})`;
        ctx.lineWidth = 1.35;
        ctx.stroke();
      }

      for (const R of ripples) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += step) {
          const y = rippleY(x, t, R);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const rp = pointerRef.current.active ? 0.035 : 0;
        ctx.strokeStyle = `rgba(10, 10, 10, ${(R.alpha + rp).toFixed(3)})`;
        ctx.lineWidth = R.width;
        ctx.stroke();
      }

      ctx.beginPath();
      for (let x = 0; x <= width; x += step) {
        const y = waveY(x, t, layers[layers.length - 1], padBottom);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineTo(width, bottomEdge);
      ctx.lineTo(0, bottomEdge);
      ctx.closePath();
      ctx.fillStyle = "rgba(10, 10, 10, 0.028)";
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
