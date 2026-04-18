import { type ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Desired minimum visible size for the shrinking stage */
const TARGET_MIN_SIZE_PX = 400;
/** Hard clamp to avoid shrinking too much on large screens */
const MIN_SCALE_FLOOR = 0.58;
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
  children: ReactNode;
};

/**
 * Pins the hero section while it shrinks to a viewport-aware minimum scale; then ScrollTrigger releases and
 * the next section can scroll in (pair with a sticky block below in App).
 */
export function HeroScrollShrink({ triggerRef, children }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = triggerRef.current;
    const stage = stageRef.current;
    if (!trigger || !stage) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        stage,
        { scale: 1, y: 0 },
        {
          scale: () => getScaleMin(),
          /* Keep visual center locked while shrinking (avoid drifting upward) */
          y: "3.5vh",
          transformOrigin: "50% 58%",
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger,
            start: "top top",
            end: `+=${SCROLL_SHRINK_RANGE}`,
            pin: true,
            pinSpacing: true,
            /* Lando-like: obvious shrink with steady scrub */
            scrub: 1.25,
            anticipatePin: 0,
            invalidateOnRefresh: true,
          },
        },
      );
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, [triggerRef]);

  return (
    <div className="landing-first-screen-shrink" ref={stageRef}>
      {children}
    </div>
  );
}
