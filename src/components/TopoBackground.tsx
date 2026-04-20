import { WaveFieldCanvas } from "./WaveFieldCanvas";

export function TopoBackground() {
  return (
    <div className="topo-bg" aria-hidden>
      <div className="topo-bg-shift">
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
        className="topo-contours-h"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <g fill="none">
          <path
            className="topo-h topo-h-1"
            d="M0,52 C200,46 380,58 580,50 S1000,44 1440,54"
          />
          <path className="topo-h topo-h-2" d="M0,118 C240,112 460,128 700,114 S1100,108 1440,122" />
          <path className="topo-h topo-h-3" d="M0,178 C300,168 520,190 760,176 S1120,168 1440,184" />
          <path className="topo-h topo-h-4" d="M0,238 C220,232 480,250 720,236 S1060,226 1440,244" />
          <path className="topo-h topo-h-5" d="M0,298 C280,288 500,310 740,296 S1040,286 1440,302" />
          <path className="topo-h topo-h-6" d="M0,358 C200,352 440,372 680,358 S1020,348 1440,364" />
          <path className="topo-h topo-h-7" d="M0,418 C260,408 520,430 780,414 S1080,408 1440,424" />
          <path className="topo-h topo-h-8" d="M0,478 C240,470 460,492 700,480 S980,468 1440,486" />
          <path className="topo-h topo-h-9" d="M0,538 C300,528 540,552 800,536 S1100,522 1440,542" />
          <path className="topo-h topo-h-10" d="M0,598 C220,590 460,610 720,598 S1000,586 1440,602" />
          <path className="topo-h topo-h-11" d="M0,658 C280,648 520,672 760,656 S1040,644 1440,664" />
          <path className="topo-h topo-h-12" d="M0,718 C200,710 480,732 740,718 S1020,704 1440,724" />
          <path className="topo-h topo-h-13" d="M0,778 C320,766 560,790 820,772 S1120,762 1440,782" />
          <path className="topo-h topo-h-14" d="M0,838 C240,828 500,852 760,836 S980,822 1440,846" />
        </g>
      </svg>

      {/* Lando-style: soft organic “ripple / topo” rings on white */}
      <svg
        className="topo-ripples"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <ellipse className="topo-re" cx={720} cy={450} rx={400} ry={270} transform="rotate(-8 720 450)" />
          <ellipse className="topo-re" cx={720} cy={450} rx={320} ry={218} transform="rotate(-8 720 450)" />
          <ellipse className="topo-re" cx={720} cy={450} rx={240} ry={165} transform="rotate(-8 720 450)" />
          <ellipse className="topo-re" cx={720} cy={450} rx={165} ry={112} transform="rotate(-8 720 450)" />
          <ellipse className="topo-re" cx={280} cy={260} rx={190} ry={128} transform="rotate(14 280 260)" />
          <ellipse className="topo-re" cx={1180} cy={300} rx={210} ry={145} transform="rotate(-16 1180 300)" />
          <ellipse className="topo-re" cx={380} cy={720} rx={240} ry={160} transform="rotate(8 380 720)" />
          <ellipse className="topo-re" cx={1080} cy={740} rx={200} ry={130} transform="rotate(-10 1080 740)" />
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
      <WaveFieldCanvas className="topo-wave-canvas" />
      </div>
    </div>
  );
}
