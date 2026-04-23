import { useEffect, useRef, type ReactNode, type HTMLAttributes } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenisInstance } from "./SmoothScrollProvider";

type Props = {
  id?: string;
  className?: string;
  children: ReactNode;
} & HTMLAttributes<HTMLElement>;

export function FooterScrollReveal({ id, className, children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);
  const lenis = useLenisInstance();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && !lenis) return;

    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.from(el, {
        opacity: 0,
        y: 28,
        duration: 0.65,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    }, el);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, [lenis]);

  return (
    <footer ref={ref} id={id} className={className} {...rest}>
      {children}
    </footer>
  );
}
