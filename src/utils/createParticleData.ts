import * as THREE from "three";

import type { ParticleData } from "../types/particleField";

export type ParticlePalette = {
  dark: string;
  lime: string;
  /** Fraction of particles using `dark` (rest use `lime`). Default 0.7 */
  darkRatio?: number;
};

const LAYER_COUNT = 3;

/**
 * Builds randomized positions, per-instance colors, and z-layer indices.
 * Colors are assigned so ~`darkRatio` particles use the dark green tint.
 */
export function createParticleData(count: number, colors: ParticlePalette): ParticleData {
  const darkRatio = colors.darkRatio ?? 0.7;
  const positions = new Float32Array(count * 3);
  const colorArray = new Float32Array(count * 3);
  const layers = new Uint8Array(count);

  const cDark = new THREE.Color(colors.dark);
  const cLime = new THREE.Color(colors.lime);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 90;
    positions[i3 + 1] = (Math.random() - 0.5) * 70;
    positions[i3 + 2] = (Math.random() - 0.5) * 45;

    const useDark = Math.random() < darkRatio;
    const c = useDark ? cDark : cLime;
    colorArray[i3] = c.r;
    colorArray[i3 + 1] = c.g;
    colorArray[i3 + 2] = c.b;

    layers[i] = i % LAYER_COUNT;
  }

  return { count, positions, colors: colorArray, layers };
}

/** Splits a combined particle buffer into three layer-specific buffers (for separate InstancedMeshes). */
export function splitParticleDataByLayer(
  data: ParticleData,
): [ParticleData, ParticleData, ParticleData] {
  const buckets: number[][] = [[], [], []];
  for (let i = 0; i < data.count; i++) {
    buckets[data.layers[i]].push(i);
  }

  const build = (layer: 0 | 1 | 2): ParticleData => {
    const idx = buckets[layer];
    const n = idx.length;
    const positions = new Float32Array(n * 3);
    const colors = new Float32Array(n * 3);
    const layers = new Uint8Array(n);
    layers.fill(layer);
    for (let j = 0; j < n; j++) {
      const src = idx[j] * 3;
      const dst = j * 3;
      positions[dst] = data.positions[src];
      positions[dst + 1] = data.positions[src + 1];
      positions[dst + 2] = data.positions[src + 2];
      colors[dst] = data.colors[src];
      colors[dst + 1] = data.colors[src + 1];
      colors[dst + 2] = data.colors[src + 2];
    }
    return { count: n, positions, colors, layers };
  };

  return [build(0), build(1), build(2)];
}
