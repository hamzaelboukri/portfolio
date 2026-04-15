export function TopoBackground() {
  return (
    <div className="topo-bg" aria-hidden>
      <svg
        className="topo-svg"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="topo-lines"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 60 Q30 40 60 60 T120 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.35"
              opacity="0.45"
            />
            <path
              d="M0 30 Q40 10 80 30 T120 30"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.25"
              opacity="0.35"
            />
            <path
              d="M0 90 Q35 70 70 90 T120 90"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.28"
              opacity="0.38"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#topo-lines)" />
      </svg>
    </div>
  );
}
