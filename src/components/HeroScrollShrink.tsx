import { type ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Desired minimum visible size for the shrinking stage */
const TARGET_MIN_SIZE_PX = 300;
/** Hard clamp to avoid shrinking too much on large screens */
const MIN_SCALE_FLOOR = 0.4;
/** Hard clamp so the stage still shrinks on very small screens */
const MIN_SCALE_CEIL = 0.9;
/** Scroll distance while hero is pinned + shrinking */
const SCROLL_SHRINK_RANGE = "150vh";

function getScaleMin() {
  const viewportWidth = Math.max(window.innerWidth, 1);
  const viewportHeight = Math.max(window.innerHeight, 1);
  const neededScale = Math.max(
    TARGET_MIN_SIZE_PX / viewportWidth,
    TARGET_MIN_SIZE_PX / viewportHeight,
  );

  return gsap.utils.clamp(MIN_SCALE_FLOOR, MIN_SCALE_CEIL, neededScale);
}

type Props = {
  /** Parent `<section className="landing-first-screen">` — wraps this scaled layer */
  triggerRef: React.RefObject<HTMLElement | null>;
  /** Root `.landing` — topo CSS variables tween dark → light with scroll (lines on white + on green) */
  themeSurfaceRef?: React.RefObject<HTMLElement | null>;
  children: ReactNode;
};

/**
 * Pins the hero section while it shrinks to a viewport-aware minimum scale; then ScrollTrigger releases and
 * the next section can scroll in (pair with a sticky block below in App).
 */
export function HeroScrollShrink({ triggerRef, themeSurfaceRef, children }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = triggerRef.current;
    const stage = stageRef.current;
    const paper = paperRef.current;
    const surface = themeSurfaceRef?.current ?? null;
    if (!trigger || !stage || !paper) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const scrollTrigger = {
        trigger,
        start: "top top",
        end: `+=${SCROLL_SHRINK_RANGE}`,
        pin: true,
        pinSpacing: true,
        scrub: 1.25,
        anticipatePin: 0,
        invalidateOnRefresh: true,
      };

      const tl = gsap.timeline({ scrollTrigger });

      tl.fromTo(
        stage,
        { scale: 1, y: 0 },
        {
          scale: () => getScaleMin(),
          y: 0,
          transformOrigin: "50% 50%",
          ease: "none",
          force3D: true,
          duration: 1,
        },
        0,
      ).fromTo(
        paper,
        /* Slight translucency so topo / wave lines read on the white hero */
        { opacity: 0.86 },
        { opacity: 0, ease: "none", duration: 1 },
        0,
      );

      if (surface) {
        tl.fromTo(
          surface,
          {
            "--topo-stroke": "rgba(0, 0, 0, 0.12)",
            "--topo-stroke-mid": "rgba(0, 0, 0, 0.082)",
            "--topo-stroke-soft": "rgba(0, 0, 0, 0.056)",
            "--topo-blob-fill": "rgba(0, 0, 0, 0.042)",
            "--topo-mist-opacity": "0.7",
          },
          {
            "--topo-stroke": "rgba(255, 255, 255, 0.16)",
            "--topo-stroke-mid": "rgba(255, 255, 255, 0.11)",
            "--topo-stroke-soft": "rgba(255, 255, 255, 0.075)",
            "--topo-blob-fill": "rgba(255, 255, 255, 0.055)",
            "--topo-mist-opacity": "0.5",
            ease: "none",
            duration: 1,
          },
          0,
        );
      }
    }, stage);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, [triggerRef, themeSurfaceRef]);

  return (
    <div className="landing-first-screen-shrink" ref={stageRef}>
      <div className="landing-hero-paper" ref={paperRef} aria-hidden />
      {children}
    </div>
  );
}
