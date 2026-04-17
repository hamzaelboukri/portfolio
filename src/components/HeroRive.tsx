import { useEffect, useState } from "react";
import Rive, { Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { RIVE_ASSETS, RIVE_CDN_FALLBACK } from "../riveAssets";

type HeroRiveProps = {
  /** Default: helmets (`reef.riv`) */
  src?: string;
  /** e.g. `hero-rive-layer--portrait` — align Rive with portrait / hero-3 focal area */
  className?: string;
  /**
   * `portrait`: full artboard visible (clearer silhouette). `full`: cover entire layer.
   */
  variant?: "full" | "portrait";
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
export function HeroRive({ src = RIVE_ASSETS.helmets, className, variant = "full" }: HeroRiveProps) {
  const resolved = useResolvedRiveSrc(src);
  const fit = variant === "portrait" ? Fit.Contain : Fit.Cover;

  return (
    <div className={["hero-rive-layer", className].filter(Boolean).join(" ")} aria-hidden>
      <Rive
        key={resolved}
        src={resolved}
        layout={new Layout({
          fit,
          alignment: Alignment.Center,
        })}
        shouldResizeCanvasToContainer
      />
    </div>
  );
}
