/** GPU instancing + simulation data for the particle field */
export type ParticleData = {
  readonly count: number;
  positions: Float32Array;
  colors: Float32Array;
  /** 0 | 1 | 2 — depth layer for parallax / drift */
  layers: Uint8Array;
};

/** Pointer in window pixel space + whether the page has focus for interaction */
export type MouseState = {
  x: number;
  y: number;
  active: boolean;
};

/** Scroll-derived motion passed into the field rotation */
export type ScrollState = {
  /** Smoothed magnitude of scroll motion (per frame blend) */
  velocity: number;
  /** Raw scroll delta since last frame */
  delta: number;
};
