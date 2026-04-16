import { useEffect, useRef } from "react";

export function TopoBackground() {
  const waveCanvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({
    x: 0.5,
    y: 0.5,
    tx: 0.5,
    ty: 0.5,
    active: false,
  });

  useEffect(() => {
    const canvas = waveCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduceMotion = media.matches;
    const motionFactor = reduceMotion ? 0.45 : 1;

    type StreamConfig = {
      y: number;
      speed: number;
      freq: number;
      amp: number;
      phase: number;
      alpha: number;
      width: number;
      span: number;
      drift: number;
    };

    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    const streams: StreamConfig[] = Array.from({ length: 10 }, () => ({
      y: rand(0.1, 0.9),
      speed: rand(0.38, 0.86),
      freq: rand(1.1, 2.4),
      amp: rand(8, 26),
      phase: rand(0, Math.PI * 2),
      alpha: rand(0.1, 0.28),
      width: rand(1.0, 2.1),
      span: rand(420, 780),
      drift: rand(5, 14),
    }));

    let raf = 0;
    let t = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.6);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!width || !height) return;
      pointerRef.current.tx = Math.min(Math.max(e.clientX / width, 0), 1);
      pointerRef.current.ty = Math.min(Math.max(e.clientY / height, 0), 1);
      pointerRef.current.active = true;
    };

    const onPointerLeave = () => {
      pointerRef.current.active = false;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const pointer = pointerRef.current;
      pointer.x += (pointer.tx - pointer.x) * 0.14;
      pointer.y += (pointer.ty - pointer.y) * 0.14;
      const px = pointer.x * width;
      const py = pointer.y * height;
      const influenceRadius = Math.min(width, height) * 0.24;

      for (const stream of streams) {
        const cycle = (t * stream.speed * 0.0015 + stream.phase) % 1;
        const headX = -width * 0.35 + cycle * width * 1.7;
        const segs = 34;

        ctx.beginPath();
        for (let i = 0; i <= segs; i += 1) {
          const p = i / segs - 0.5;
          const x = headX + p * stream.span;
          let y =
            height * stream.y +
            Math.sin((x / Math.max(width, 1)) * Math.PI * 2 * stream.freq + t * 0.012 + stream.phase) *
              stream.amp +
            Math.cos(t * 0.004 + stream.phase) * stream.drift;

          if (pointer.active) {
            const dx = x - px;
            const dy = y - py;
            const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
            const f = Math.max(0, 1 - dist / influenceRadius);
            y += (dy / dist) * f * f * 24;
          }

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const alphaBoost = pointer.active ? 0.08 : 0;
        ctx.strokeStyle = `rgba(10, 10, 10, ${(stream.alpha + alphaBoost).toFixed(3)})`;
        ctx.lineWidth = stream.width;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      t += 0.5 * motionFactor;
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
    };
  }, []);

  return (
    <div className="topo-bg" aria-hidden>
      <svg
        className="topo-blobs"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="blob-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" />
          </filter>
        </defs>

        <g filter="url(#blob-blur)">
          <path
            className="topo-shape topo-shape-a"
            fill="currentColor"
            d="M180 100 C320 20, 560 40, 660 180 C760 320, 700 520, 540 580 C380 640, 180 560, 100 400 C20 240, 40 180, 180 100Z"
          />
          <path
            className="topo-shape topo-shape-b"
            fill="currentColor"
            d="M820 60 C1020 -20, 1280 30, 1380 200 C1480 370, 1420 580, 1240 660 C1060 740, 860 680, 780 520 C700 360, 620 140, 820 60Z"
          />
          <path
            className="topo-shape topo-shape-c"
            fill="currentColor"
            d="M500 440 C660 360, 880 380, 980 520 C1080 660, 1020 840, 860 900 C700 960, 500 920, 400 780 C300 640, 340 520, 500 440Z"
          />
          <path
            className="topo-shape topo-shape-d"
            fill="currentColor"
            d="M-60 380 C80 280, 300 300, 380 440 C460 580, 400 760, 260 820 C120 880, -60 840, -120 700 C-180 560, -200 480, -60 380Z"
          />
          <path
            className="topo-shape topo-shape-e"
            fill="currentColor"
            d="M1100 400 C1260 320, 1440 360, 1500 500 C1560 640, 1500 800, 1360 860 C1220 920, 1060 880, 1000 740 C940 600, 940 480, 1100 400Z"
          />
        </g>
      </svg>

      <svg
        className="topo-lines"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <path className="topo-line topo-line-1" d="M135 110 C190 65, 286 66, 334 126 C380 182, 376 266, 314 308 C248 352, 160 338, 118 280 C76 220, 82 153, 135 110 Z" />
        <path className="topo-line topo-line-2" d="M540 86 C624 42, 736 62, 792 132 C846 202, 836 302, 758 348 C672 398, 566 376, 512 304 C456 228, 462 128, 540 86 Z" />
        <path className="topo-line topo-line-3" d="M1038 124 C1114 86, 1212 100, 1258 162 C1302 224, 1296 310, 1230 354 C1158 404, 1058 396, 1008 332 C958 266, 964 170, 1038 124 Z" />
        <path className="topo-line topo-line-4" d="M286 404 C370 360, 492 372, 556 444 C620 518, 612 626, 532 684 C450 742, 328 730, 268 656 C206 580, 212 456, 286 404 Z" />
        <path className="topo-line topo-line-5" d="M730 414 C810 374, 914 388, 966 454 C1018 522, 1012 620, 940 670 C862 722, 754 708, 704 642 C652 572, 658 466, 730 414 Z" />
        <path className="topo-line topo-line-6" d="M1148 448 C1204 420, 1278 430, 1316 478 C1352 528, 1348 600, 1298 636 C1246 674, 1174 666, 1138 620 C1102 572, 1104 482, 1148 448 Z" />
        <path className="topo-line topo-line-7" d="M84 652 C138 620, 212 628, 254 670 C296 716, 294 786, 244 824 C192 862, 120 856, 82 812 C44 768, 42 684, 84 652 Z" />
        <path className="topo-line topo-line-8" d="M506 690 C566 654, 650 666, 694 716 C738 768, 734 844, 674 882 C614 920, 526 910, 482 856 C438 800, 444 726, 506 690 Z" />
        <path className="topo-line topo-line-9" d="M914 716 C970 686, 1044 694, 1088 738 C1132 782, 1130 854, 1078 892 C1024 932, 948 926, 906 880 C864 834, 864 754, 914 716 Z" />
        <path className="topo-line topo-line-10" d="M1268 684 C1310 662, 1362 668, 1388 702 C1414 736, 1412 790, 1378 820 C1342 852, 1288 848, 1258 814 C1228 778, 1230 708, 1268 684 Z" />
      </svg>
      <canvas ref={waveCanvasRef} className="topo-wave-canvas" />
    </div>
  );
}
