import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { useScrollVelocity } from "../hooks/useScrollVelocity";
import type { MouseState } from "../types/particleField";
import {
  createParticleData,
  splitParticleDataByLayer,
  type ParticlePalette,
} from "../utils/createParticleData";

/** Match white studio bg (fog only; canvas clear is transparent) */
const FOG_COLOR = 0xffffff;
const FOG_DENSITY = 0.012;

const PARTICLE_RADIUS = 0.01;
const INSTANCE_COUNT = 5000;

const PALETTE: ParticlePalette = {
  dark: "#3b3c38",
  lime: "#d2ff00",
  darkRatio: 0.7,
};

const BASE_ROTATION = 0.01;
const SCROLL_ROT_SCALE = 0.85;
const DRIFT_BASE = 2.0;
const MAGNET_PX = 110;
const MAGNET_STRENGTH = 3.8;
const MOUSE_HIT_DAMP = 5.2;

const LAYER_DRIFT = [0.62, 1.0, 1.38] as const;
const LAYER_ROT = [0.52, 1.0, 1.48] as const;

const SPHERE_SEG = 5;

const _dummy = new THREE.Object3D();
const _color = new THREE.Color();
const _raycaster = new THREE.Raycaster();
const _plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const _hit = new THREE.Vector3();

function useDocumentMouse() {
  const mouse = useRef<MouseState>({ x: 0, y: 0, active: false });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      mouse.current.active = true;
    };
    const onLeave = () => {
      mouse.current.active = false;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return mouse;
}

function useTabVisibilityFrameloop() {
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");
  useEffect(() => {
    const sync = () => setFrameloop(document.hidden ? "never" : "always");
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);
  return frameloop;
}

function useWebGLFallback() {
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 768px)");
    const sync = () => {
      const lowCores = (navigator.hardwareConcurrency ?? 8) <= 4;
      setFallback(reduce.matches || narrow.matches || lowCores);
    };
    sync();
    reduce.addEventListener("change", sync);
    narrow.addEventListener("change", sync);
    return () => {
      reduce.removeEventListener("change", sync);
      narrow.removeEventListener("change", sync);
    };
  }, []);

  return fallback;
}

function ParticleScene({
  mouseRef,
  layers,
}: {
  mouseRef: React.MutableRefObject<MouseState>;
  layers: ReturnType<typeof splitParticleDataByLayer>;
}) {
  const scrollStateRef = useScrollVelocity();
  const { camera, size, viewport } = useThree();

  const meshRef0 = useRef<THREE.InstancedMesh>(null);
  const meshRef1 = useRef<THREE.InstancedMesh>(null);
  const meshRef2 = useRef<THREE.InstancedMesh>(null);
  const meshRefs = [meshRef0, meshRef1, meshRef2] as const;

  const sims = useRef([
    layers[0].positions.slice(),
    layers[1].positions.slice(),
    layers[2].positions.slice(),
  ]);
  const smoothHit = useRef(new THREE.Vector3(0, 0, 0));
  const smoothHitInit = useRef(false);

  const geom = useMemo(
    () => new THREE.SphereGeometry(PARTICLE_RADIUS, SPHERE_SEG, SPHERE_SEG),
    [],
  );
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        fog: true,
        toneMapped: false,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      geom.dispose();
      mat.dispose();
    };
  }, [geom, mat]);

  useLayoutEffect(() => {
    const apply = () => {
      for (let L = 0; L < 3; L++) {
        const mesh = meshRefs[L].current;
        const data = layers[L];
        if (!mesh) continue;
        for (let i = 0; i < data.count; i++) {
          const i3 = i * 3;
          _color.setRGB(data.colors[i3], data.colors[i3 + 1], data.colors[i3 + 2]);
          mesh.setColorAt(i, _color);
        }
        mesh.instanceColor!.needsUpdate = true;
      }
    };
    const id = requestAnimationFrame(apply);
    return () => cancelAnimationFrame(id);
  }, [layers]);

  useFrame((_, delta) => {
    const scrollVel = scrollStateRef.current.velocity;
    const mouse = mouseRef.current;

    const ndc = new THREE.Vector2(
      (mouse.x / size.width) * 2 - 1,
      -(mouse.y / size.height) * 2 + 1,
    );
    _raycaster.setFromCamera(ndc, camera);
    const hitOk = _raycaster.ray.intersectPlane(_plane, _hit);
    if (hitOk && mouse.active) {
      if (!smoothHitInit.current) {
        smoothHit.current.copy(_hit);
        smoothHitInit.current = true;
      }
      smoothHit.current.x = THREE.MathUtils.damp(smoothHit.current.x, _hit.x, MOUSE_HIT_DAMP, delta);
      smoothHit.current.y = THREE.MathUtils.damp(smoothHit.current.y, _hit.y, MOUSE_HIT_DAMP, delta);
      smoothHit.current.z = THREE.MathUtils.damp(smoothHit.current.z, _hit.z, MOUSE_HIT_DAMP, delta);
    }

    const worldR = (MAGNET_PX / size.width) * viewport.width;

    for (let L = 0; L < 3; L++) {
      const mesh = meshRefs[L].current;
      if (!mesh) continue;
      const pos = sims.current[L];
      const n = pos.length / 3;
      const drift = DRIFT_BASE * LAYER_DRIFT[L] * delta;
      const rotSpeed = (BASE_ROTATION + scrollVel * SCROLL_ROT_SCALE) * LAYER_ROT[L];

      for (let i = 0; i < n; i++) {
        const i3 = i * 3;
        let x = pos[i3];
        let y = pos[i3 + 1];
        let z = pos[i3 + 2];

        y += drift;

        const cos = Math.cos(rotSpeed * delta);
        const sin = Math.sin(rotSpeed * delta);
        const rx = x * cos - z * sin;
        const rz = x * sin + z * cos;
        x = rx;
        z = rz;

        if (mouse.active && smoothHitInit.current) {
          const hx = smoothHit.current.x;
          const hy = smoothHit.current.y;
          const dx = hx - x;
          const dy = hy - y;
          const d = Math.hypot(dx, dy);
          if (d < worldR && d > 1e-4) {
            const t = (1 - d / worldR) ** 2;
            x += (dx / d) * MAGNET_STRENGTH * t * delta;
            y += (dy / d) * MAGNET_STRENGTH * t * delta;
          }
        }

        if (y > 38) y -= 76;
        if (y < -38) y += 76;
        if (x > 48) x -= 96;
        if (x < -48) x += 96;

        pos[i3] = x;
        pos[i3 + 1] = y;
        pos[i3 + 2] = z;

        _dummy.position.set(x, y, z);
        _dummy.updateMatrix();
        mesh.setMatrixAt(i, _dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      {layers.map((layerData, L) => (
        <instancedMesh
          key={L}
          ref={meshRefs[L as 0 | 1 | 2]}
          args={[geom, mat, layerData.count]}
          frustumCulled
        />
      ))}
    </>
  );
}

function ParticleCanvas({ mouseRef }: { mouseRef: React.MutableRefObject<MouseState> }) {
  const layers = useMemo(() => splitParticleDataByLayer(createParticleData(INSTANCE_COUNT, PALETTE)), []);
  const frameloop = useTabVisibilityFrameloop();

  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: true,
        premultipliedAlpha: false,
        powerPreference: "high-performance",
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      dpr={[1, 2]}
      frameloop={frameloop}
      camera={{ position: [0, 0, 52], fov: 50, near: 0.1, far: 200 }}
      onCreated={({ scene, gl }) => {
        scene.background = null;
        scene.fog = new THREE.FogExp2(FOG_COLOR, FOG_DENSITY);
        gl.setClearColor(0x000000, 0);
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <Suspense fallback={null}>
        <ParticleScene mouseRef={mouseRef} layers={layers} />
      </Suspense>
    </Canvas>
  );
}

const fallbackStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(165deg, #ffffff 0%, #fafafa 50%, #f5f5f7 100%)",
  pointerEvents: "none",
};

export function ParticleField() {
  const fallback = useWebGLFallback();
  const mouseRef = useDocumentMouse();

  if (fallback) {
    return <div className="particle-field particle-field--fallback" style={fallbackStyle} aria-hidden />;
  }

  return (
    <div className="particle-field" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <ParticleCanvas mouseRef={mouseRef} />
    </div>
  );
}
