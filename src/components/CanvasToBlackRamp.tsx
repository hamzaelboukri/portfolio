/**
 * Static blend between --canvas and the black skills block (no scroll-driven color motion).
 */
export function CanvasToBlackRamp() {
  return (
    <div className="canvas-black-ramp" aria-hidden="true">
      <style>{`
        .canvas-black-ramp {
          width: 100%;
          height: clamp(72px, 14vh, 160px);
          pointer-events: none;
          flex-shrink: 0;
          background: linear-gradient(
            180deg,
            var(--canvas, #2d3222) 0%,
            #1a1c17 45%,
            #000000 100%
          );
        }
      `}</style>
    </div>
  );
}
