import Rive, { Layout, Fit, Alignment } from "@rive-app/react-canvas";

const DEFAULT_RIVE = "https://cdn.rive.app/animations/vehicles.riv";

type RiveAccentProps = {
  /** Replace with your own .riv file in /public or a URL */
  src?: string;
  className?: string;
};

export function RiveAccent({ src = DEFAULT_RIVE, className }: RiveAccentProps) {
  return (
    <div className={className} aria-hidden>
      <Rive
        src={src}
        layout={new Layout({
          fit: Fit.Contain,
          alignment: Alignment.Center,
        })}
        shouldResizeCanvasToContainer
      />
    </div>
  );
}
