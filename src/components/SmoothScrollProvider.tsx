import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<Lenis | null>(null);

export function useLenisInstance(): Lenis | null {
  return useContext(LenisContext);
}

type Props = { children: ReactNode };

export function SmoothScrollProvider({ children }: Props) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const instance = new Lenis({
      smoothWheel: true,
      anchors: true,
      /* Softer glide + less delta per wheel tick = slower, calmer scroll through hero */
      lerp: 0.075,
      wheelMultiplier: 0.78,
    });

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && typeof value === "number") {
          instance.scrollTo(value, { immediate: true });
        }
        return instance.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    setLenis(instance);

    const offScroll = instance.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop(value) {
          if (arguments.length && typeof value === "number") {
            window.scrollTo(0, value);
          }
          return window.scrollY || document.documentElement.scrollTop;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
      });
      offScroll();
      gsap.ticker.remove(onTick);
      instance.destroy();
      ScrollTrigger.refresh();
      setLenis(null);
    };
  }, []);

  const value = useMemo(() => lenis, [lenis]);

  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>;
}
