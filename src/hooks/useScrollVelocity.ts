import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

import type { ScrollState } from "../types/particleField";

const VELOCITY_DECAY = 0.88;
const DELTA_BLEND = 0.12;

/**
 * Tracks scroll motion for use inside a `<Canvas>` (must run under React Three Fiber).
 * Updates each frame: `delta` is scrollY change, `velocity` is smoothed magnitude.
 */
export function useScrollVelocity() {
  const state = useRef<ScrollState>({ velocity: 0, delta: 0 });
  const lastY = useRef(typeof window !== "undefined" ? window.scrollY : 0);
  const initialized = useRef(false);

  useFrame(() => {
    if (typeof window === "undefined") return;
    const y = window.scrollY;
    if (!initialized.current) {
      lastY.current = y;
      initialized.current = true;
      return;
    }
    const delta = y - lastY.current;
    lastY.current = y;
    const mag = Math.abs(delta);
    const v = state.current.velocity * VELOCITY_DECAY + mag * DELTA_BLEND;
    state.current = { delta, velocity: v };
  });

  return state;
}
