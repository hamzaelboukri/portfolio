import { useEffect, useState } from "react";
import Rive, { Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { RIVE_ASSETS, RIVE_CDN_FALLBACK } from "../riveAssets";

type HeroRiveProps = {
  /** Default: helmets (`reef.riv`) */
  src?: string;
};

function useResolvedRiveSrc(preferred: string) {
  const [resolved, setResolved] = useState(preferred);

  useEffect(() => {
    let cancelled = false;

    if (!preferred.startsWith("/")) {
      setResolved(preferred);
      return;
    }

    fetch(preferred, { method: "HEAD" })
      .then((r) => {
        if (!cancelled) setResolved(r.ok ? preferred : RIVE_CDN_FALLBACK);
      })
      .catch(() => {
        if (!cancelled) setResolved(RIVE_CDN_FALLBACK);
      });

    return () => {
      cancelled = true;
    };
  }, [preferred]);

  return resolved;
}

/**
 * Rive HTML canvas above the Three.js hero. pointer-events: none so HelmetHero reveal works.
 */
export function HeroRive({ src = RIVE_ASSETS.helmets }: HeroRiveProps) {
  const resolved = useResolvedRiveSrc(src);

  return (
    <div className="hero-rive-layer" aria-hidden>
      <Rive
        key={resolved}
        src={resolved}
        layout={new Layout({
          fit: Fit.Cover,
          alignment: Alignment.Center,
        })}
        shouldResizeCanvasToContainer
      />
    </div>
  );
}
