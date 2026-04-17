import {
  Alignment,
  Fit,
  Layout,
  useRive,
  useStateMachineInput,
} from "@rive-app/react-canvas";
import type { Event as RiveEvent, Rive as RiveInstance } from "@rive-app/canvas";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Component,
  type CSSProperties,
  type ErrorInfo,
  type MutableRefObject,
  type PointerEvent,
  type ReactNode,
  type Ref,
  type RefCallback,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { RIVE_ASSETS } from "../riveAssets";

gsap.registerPlugin(ScrollTrigger);

/** Default Rive structure — your `.riv` must define matching artboard / state machine / inputs */
export const DEFAULT_HELMET_ARTBOARD = "helmet_main";
export const DEFAULT_HELMET_STATE_MACHINE = "helmet_interaction";

export const DEFAULT_HELMET_INPUTS = {
  isHovered: "isHovered",
  scrollProgress: "scrollProgress",
  mouseX: "mouseX",
  mouseY: "mouseY",
  /** State machine trigger input name for confetti / celebration burst */
  celebration: "celebration",
} as const;

export type HelmetInputNames = typeof DEFAULT_HELMET_INPUTS;

export interface InteractiveHelmetRiveProps {
  /** Path to `.riv` — must contain `artboard` + `stateMachine` + inputs below */
  src?: string;
  artboard?: string;
  stateMachineName?: string;
  /** Map Rive input names if yours differ */
  inputNames?: Partial<HelmetInputNames>;
  onLoad?: (event: RiveEvent) => void;
  onStateChange?: (event: RiveEvent) => void;
  onLoop?: (event: RiveEvent) => void;
  onLoadError?: (event: RiveEvent) => void;
  className?: string;
  /** Extra props for the root wrapper */
  style?: CSSProperties;
}

export interface InteractiveHelmetRiveHandle {
  /** Fire the celebration trigger (confetti) on the state machine */
  fireCelebration: () => void;
  /** Latest scrubbed scroll progress (0–1) */
  getScrollProgress: () => number;
  /** Underlying Rive runtime instance */
  getRive: () => RiveInstance | null;
}

function mergeRefs<T extends HTMLElement>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else (ref as MutableRefObject<T | null>).current = node;
    }
  };
}

const pulseStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  margin: "auto",
  width: "min(40%, 120px)",
  aspectRatio: "1",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(210,255,0,0.35) 0%, rgba(210,255,0,0) 70%)",
  animation: "interactiveHelmetPulse 1.4s ease-in-out infinite",
  pointerEvents: "none",
  zIndex: 0,
};

const keyframes = `
@keyframes interactiveHelmetPulse {
  0%, 100% { transform: scale(0.92); opacity: 0.55; }
  50% { transform: scale(1.08); opacity: 1; }
}
`;

type BoundaryProps = { children: ReactNode; fallback?: ReactNode };

export class InteractiveHelmetRiveErrorBoundary extends Component<
  BoundaryProps,
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[InteractiveHelmetRive]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            role="alert"
            style={{
              width: "100%",
              maxWidth: 400,
              aspectRatio: "1",
              margin: "0 auto",
              display: "grid",
              placeItems: "center",
              background: "linear-gradient(145deg, #1e2118, #282c20)",
              color: "#d2ff00",
              fontSize: 13,
              padding: 16,
              textAlign: "center",
              borderRadius: 12,
            }}
          >
            Helmet animation could not be displayed.
          </div>
        )
      );
    }
    return this.props.children;
  }
}

const HelmetRiveInner = forwardRef<InteractiveHelmetRiveHandle, InteractiveHelmetRiveProps>(
  function HelmetRiveInner(props, forwardedRef) {
    const {
      src = RIVE_ASSETS.helmetInteractive,
      artboard = DEFAULT_HELMET_ARTBOARD,
      stateMachineName = DEFAULT_HELMET_STATE_MACHINE,
      inputNames: inputNamesProp,
      onLoad,
      onStateChange,
      onLoop,
      onLoadError,
      className,
      style,
    } = props;

    const names = useMemo(
      () => ({ ...DEFAULT_HELMET_INPUTS, ...inputNamesProp }),
      [inputNamesProp],
    );

    const [loaded, setLoaded] = useState(false);
    const scrollProgressRef = useRef(0);

    const { RiveComponent, rive, setContainerRef } = useRive(
      {
        src,
        autoplay: true,
        artboard,
        stateMachines: stateMachineName,
        layout: new Layout({
          fit: Fit.Contain,
          alignment: Alignment.Center,
        }),
        onLoad: (e) => {
          setLoaded(true);
          onLoad?.(e);
        },
        onStateChange,
        onLoop,
        onLoadError: (e) => {
          onLoadError?.(e);
        },
      },
      {
        useDevicePixelRatio: true,
        shouldResizeCanvasToContainer: true,
      },
    );

    const hoverInput = useStateMachineInput(rive, stateMachineName, names.isHovered, false);
    const scrollInput = useStateMachineInput(rive, stateMachineName, names.scrollProgress, 0);
    const mouseXInput = useStateMachineInput(rive, stateMachineName, names.mouseX, 0);
    const mouseYInput = useStateMachineInput(rive, stateMachineName, names.mouseY, 0);
    const celebrationInput = useStateMachineInput(rive, stateMachineName, names.celebration);

    const fireCelebration = useCallback(() => {
      celebrationInput?.fire();
    }, [celebrationInput]);

    useImperativeHandle(
      forwardedRef,
      () => ({
        fireCelebration,
        getScrollProgress: () => scrollProgressRef.current,
        getRive: () => rive,
      }),
      [fireCelebration, rive],
    );

    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const el = rootRef.current;
      if (!el || !rive) return;

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          scrollProgressRef.current = p;
          if (scrollInput) scrollInput.value = p;
        },
        onToggle: (self) => {
          if (self.isActive) rive.play();
          else rive.pause();
        },
      });

      queueMicrotask(() => {
        ScrollTrigger.refresh();
        if (!ScrollTrigger.isInViewport(el)) {
          rive.pause();
        } else {
          rive.play();
        }
      });

      return () => {
        st.kill();
      };
    }, [rive, scrollInput]);

    const onPointerMove = useCallback(
      (e: PointerEvent<HTMLDivElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
        const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
        if (mouseXInput) mouseXInput.value = Math.max(-1, Math.min(1, nx));
        if (mouseYInput) mouseYInput.value = Math.max(-1, Math.min(1, ny));
      },
      [mouseXInput, mouseYInput],
    );

    const onPointerEnter = useCallback(() => {
      if (hoverInput) hoverInput.value = true;
    }, [hoverInput]);

    const onPointerLeave = useCallback(() => {
      if (hoverInput) hoverInput.value = false;
    }, [hoverInput]);

    const onClick = useCallback(() => {
      fireCelebration();
    }, [fireCelebration]);

    const setRootRef = mergeRefs(setContainerRef, rootRef);

    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: keyframes }} />
        <div
          ref={setRootRef}
          className={className}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 400,
            aspectRatio: "1",
            margin: "0 auto",
            touchAction: "none",
            ...style,
          }}
          onPointerMove={onPointerMove}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          onClick={onClick}
        >
          {!loaded && <div style={pulseStyle} aria-hidden />}
          <RiveComponent
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              position: "relative",
              zIndex: 1,
            }}
            aria-label="Interactive helmet animation"
          />
        </div>
      </>
    );
  },
);

/**
 * Interactive helmet: hover (visor / glow), scroll-driven rotation via `scrollProgress`,
 * mouse tilt (`mouseX` / `mouseY`), click fires `celebration` trigger.
 * ScrollTrigger scrubs `scrollProgress` and pauses the Rive instance when the block is out of view.
 */
export const InteractiveHelmetRive = forwardRef<InteractiveHelmetRiveHandle, InteractiveHelmetRiveProps>(
  function InteractiveHelmetRive(props, ref) {
    return (
      <InteractiveHelmetRiveErrorBoundary>
        <HelmetRiveInner {...props} ref={ref} />
      </InteractiveHelmetRiveErrorBoundary>
    );
  },
);
