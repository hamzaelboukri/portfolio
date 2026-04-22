import { useEffect, useState } from "react";
import Rive, { Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { RIVE_ASSETS, RIVE_CDN_FALLBACK, isLikelyRivFile } from "../riveAssets";

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

/**
 * Resolves a local `/…` path after verifying bytes are a real Rive file.
 * A bare HEAD check was unsafe: Vite (or a host) can return 200 + HTML for unknown paths,
 * which Rive then parses and surfaces as rive.wasm “Bad header”.
 */
function useResolvedRiveSrc(preferred: string) {
  const [resolved, setResolved] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    if (!preferred.startsWith("/")) {
      setResolved(preferred);
      return;
    }

    (async () => {
      try {
        const r = await fetch(preferred);
        if (!r.ok) {
          if (!cancelled) setResolved(RIVE_CDN_FALLBACK);
          return;
        }
        const ct = (r.headers.get("content-type") || "").toLowerCase();
        if (ct.includes("text/html") || ct.includes("application/xhtml")) {
          if (!cancelled) setResolved(RIVE_CDN_FALLBACK);
          return;
        }
        const buf = await r.arrayBuffer();
        if (!isLikelyRivFile(buf)) {
          if (!cancelled) setResolved(RIVE_CDN_FALLBACK);
          return;
        }
        if (cancelled) return;
        const blob = new Blob([buf], { type: "application/octet-stream" });
        objectUrl = URL.createObjectURL(blob);
        if (cancelled) {
          URL.revokeObjectURL(objectUrl);
          return;
        }
        setResolved(objectUrl);
      } catch {
        if (!cancelled) setResolved(RIVE_CDN_FALLBACK);
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
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
      {resolved ? (
        <Rive
          key={resolved}
          src={resolved}
          layout={new Layout({
            fit,
            alignment: Alignment.Center,
          })}
          shouldResizeCanvasToContainer
        />
      ) : null}
    </div>
  );
}
