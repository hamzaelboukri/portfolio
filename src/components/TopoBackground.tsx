export function TopoBackground() {
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
        <path className="topo-line topo-line-1" d="M0 180 Q360 120, 720 180 T1440 180" />
        <path className="topo-line topo-line-2" d="M0 340 Q400 280, 800 340 T1440 340" />
        <path className="topo-line topo-line-3" d="M0 500 Q360 440, 720 500 T1440 500" />
        <path className="topo-line topo-line-4" d="M0 660 Q400 600, 800 660 T1440 660" />
        <path className="topo-line topo-line-5" d="M0 100 Q440 50, 880 100 T1440 100" />
        <path className="topo-line topo-line-6" d="M0 420 Q380 370, 760 420 T1440 420" />
        <path className="topo-line topo-line-7" d="M0 580 Q420 530, 840 580 T1440 580" />
        <path className="topo-line topo-line-8" d="M0 780 Q380 730, 760 780 T1440 780" />
        <path className="topo-line topo-line-9" d="M0 260 Q460 210, 920 260 T1440 260" />
        <path className="topo-line topo-line-10" d="M0 840 Q400 800, 800 840 T1440 840" />
      </svg>
    </div>
  );
}
