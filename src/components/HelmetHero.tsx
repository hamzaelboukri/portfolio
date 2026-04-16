import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";

const VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT = `
  precision highp float;
  varying vec2 vUv;

  uniform sampler2D uBase;
  uniform sampler2D uOverlay;
  uniform vec2 uPointer;
  uniform float uMoveStrength;
  uniform float uTime;
  uniform float uScreenAspect;
  uniform float uBaseAspect;
  uniform float uOverlayAspect;
  uniform float uBaseScale;
  uniform vec2 uBaseOffset;
  uniform float uOverlayScale;
  uniform vec2 uOverlayOffset;
  uniform vec2 uOverlayTexel;
  uniform float uParallax;

  vec2 fitCover(vec2 uv, float screenAspect, float imgAspect, float scale, vec2 offset, vec2 parallax) {
    vec2 s = uv;
    if (screenAspect > imgAspect) {
      float ratio = imgAspect / screenAspect;
      s.y = (uv.y - 0.5) / (scale) + 0.5 + offset.y + parallax.y;
      s.x = (uv.x - 0.5) / (scale) + 0.5 + offset.x + parallax.x;
    } else {
      float ratio = imgAspect / screenAspect;
      s.x = (uv.x - 0.5) / (ratio * scale) + 0.5 + offset.x + parallax.x;
      s.y = (uv.y - 0.5) / scale + 0.5 + offset.y + parallax.y;
    }
    return s;
  }

  void main() {
    vec2 baseParallax = (uPointer - 0.5) * uParallax * 0.009;
    vec2 overlayParallax = (uPointer - 0.5) * uParallax * -0.006;

    vec2 baseUv = fitCover(vUv, uScreenAspect, uBaseAspect, uBaseScale, uBaseOffset, baseParallax);
    vec2 overlayUv = fitCover(vUv, uScreenAspect, uOverlayAspect, uOverlayScale, uOverlayOffset, overlayParallax);

    bool outBase = baseUv.x < 0.0 || baseUv.x > 1.0 || baseUv.y < 0.0 || baseUv.y > 1.0;
    bool outOverlay = overlayUv.x < 0.0 || overlayUv.x > 1.0 || overlayUv.y < 0.0 || overlayUv.y > 1.0;

    vec4 base = outBase ? vec4(0.0) : texture2D(uBase, baseUv);
    vec4 overlay = outOverlay ? vec4(0.0) : texture2D(uOverlay, overlayUv);

    vec2 d = vUv - uPointer;
    d.x *= uScreenAspect;
    float dist = length(d);
    float cursorMask = exp(-dist * 10.0) * uMoveStrength;
    vec2 warp = vec2(
      sin(vUv.y * 24.0 + uTime * 2.2),
      cos(vUv.x * 22.0 - uTime * 1.8)
    ) * (0.004 * cursorMask);
    vec2 overlayFxUv = clamp(overlayUv + warp, vec2(0.001), vec2(0.999));
    vec4 overlayFx = texture2D(uOverlay, overlayFxUv);

    float c = dot(overlayFx.rgb, vec3(0.299, 0.587, 0.114));
    float l = dot(texture2D(uOverlay, overlayFxUv - vec2(uOverlayTexel.x, 0.0)).rgb, vec3(0.299, 0.587, 0.114));
    float r = dot(texture2D(uOverlay, overlayFxUv + vec2(uOverlayTexel.x, 0.0)).rgb, vec3(0.299, 0.587, 0.114));
    float t = dot(texture2D(uOverlay, overlayFxUv - vec2(0.0, uOverlayTexel.y)).rgb, vec3(0.299, 0.587, 0.114));
    float b = dot(texture2D(uOverlay, overlayFxUv + vec2(0.0, uOverlayTexel.y)).rgb, vec3(0.299, 0.587, 0.114));

    float grad = abs(r - l) + abs(b - t) + abs(c - (l + r + t + b) * 0.25) * 0.6;
    float edgeMask = smoothstep(0.08, 0.24, grad) * overlayFx.a;
    float edgePulse = 1.0 + 0.07 * sin(uTime * 1.6 + grad * 2.5 + vUv.x * 4.0);
    float edgeVis = clamp(edgeMask * 0.92 * edgePulse, 0.0, 1.0);

    float spot = exp(-dist * dist / (2.0 * 0.11 * 0.11));
    float localReveal = spot * uMoveStrength * overlayFx.a;
    float mixAmount = max(edgeVis, localReveal);

    vec3 outColor = mix(base.rgb, overlayFx.rgb, mixAmount);
    float outAlpha = max(base.a, mixAmount);
    gl_FragColor = vec4(outColor, outAlpha);
  }
`;

function HeroPlane({
  baseUrl,
  overlayUrl,
  pointer,
  resetTick,
  onReady,
}: {
  baseUrl: string;
  overlayUrl: string;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  resetTick: React.MutableRefObject<number>;
  onReady?: () => void;
}) {
  const { size } = useThree();
  const matRef = useRef<THREE.ShaderMaterial | null>(null);
  const moveStrengthRef = useRef(0);
  const lastPtrRef = useRef({ x: 0.5, y: 0.5 });
  const lastResetTickRef = useRef(0);
  const timeRef = useRef(0);
  const readySentRef = useRef(false);

  const [textures, setTextures] = useState<{
    base: THREE.Texture;
    overlay: THREE.Texture;
    baseAspect: number;
    overlayAspect: number;
  } | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let disposed = false;
    let base: THREE.Texture | null = null;
    let overlay: THREE.Texture | null = null;

    const tryFinish = () => {
      if (!base || !overlay || disposed) return;
      const bImg = base.image as HTMLImageElement;
      const oImg = overlay.image as HTMLImageElement;
      setTextures({
        base,
        overlay,
        baseAspect: bImg.naturalWidth / bImg.naturalHeight,
        overlayAspect: oImg.naturalWidth / oImg.naturalHeight,
      });
    };

    loader.load(baseUrl, (tex) => {
      if (disposed) { tex.dispose(); return; }
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      base = tex;
      tryFinish();
    });

    loader.load(overlayUrl, (tex) => {
      if (disposed) { tex.dispose(); return; }
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      overlay = tex;
      tryFinish();
    });

    return () => {
      disposed = true;
      base?.dispose();
      overlay?.dispose();
    };
  }, [baseUrl, overlayUrl]);

  useEffect(() => {
    if (!textures || readySentRef.current) return;
    readySentRef.current = true;
    onReady?.();
  }, [textures, onReady]);

  useEffect(() => {
    if (!textures) return;

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uBase: { value: textures.base },
        uOverlay: { value: textures.overlay },
        uPointer: { value: new THREE.Vector2(0.5, 0.5) },
        uMoveStrength: { value: 0 },
        uTime: { value: 0 },
        uScreenAspect: { value: size.width / size.height },
        uBaseAspect: { value: textures.baseAspect },
        uOverlayAspect: { value: textures.overlayAspect },
        uBaseScale: { value: 1.0 },
        uBaseOffset: { value: new THREE.Vector2(0.0, 0.088) },
        uOverlayScale: { value: 1.0 },
        uOverlayOffset: { value: new THREE.Vector2(-0.02, 0.014) },
        uOverlayTexel: {
          value: new THREE.Vector2(
            1 / (textures.overlay.image as HTMLImageElement).naturalWidth,
            1 / (textures.overlay.image as HTMLImageElement).naturalHeight,
          ),
        },
        uParallax: { value: 0.7 },
      },
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
    });

    matRef.current = mat;
    return () => { mat.dispose(); matRef.current = null; };
  }, [textures, size.width, size.height]);

  useFrame((_state, delta) => {
    const mat = matRef.current;
    if (!mat) return;
    const u = mat.uniforms;
    timeRef.current += delta;

    if (resetTick.current !== lastResetTickRef.current) {
      lastResetTickRef.current = resetTick.current;
      moveStrengthRef.current = 0;
      lastPtrRef.current = { x: pointer.current.x, y: pointer.current.y };
    }

    const p = u.uPointer.value as THREE.Vector2;
    p.x = THREE.MathUtils.damp(p.x, pointer.current.x, 3.8, delta);
    p.y = THREE.MathUtils.damp(p.y, 1 - pointer.current.y, 3.8, delta);

    const lx = lastPtrRef.current.x;
    const ly = lastPtrRef.current.y;
    const dist = Math.hypot(pointer.current.x - lx, pointer.current.y - ly);
    lastPtrRef.current = { x: pointer.current.x, y: pointer.current.y };
    moveStrengthRef.current *= 0.86;
    moveStrengthRef.current += Math.min(dist * 48, 0.55);
    moveStrengthRef.current = Math.min(moveStrengthRef.current, 1);
    u.uMoveStrength.value = moveStrengthRef.current;

    u.uTime.value = timeRef.current;

    u.uScreenAspect.value = size.width / size.height;
  });

  if (!matRef.current) return null;

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <primitive object={matRef.current} attach="material" />
    </mesh>
  );
}

export type HelmetHeroProps = {
  baseUrl: string;
  revealUrl: string;
  portraitAlt?: string;
  onReady?: () => void;
};

export function HelmetHero({ baseUrl, revealUrl, onReady }: HelmetHeroProps) {
  const pointer = useRef({ x: 0.5, y: 0.5 });
  const resetTick = useRef(0);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    if (!r.width || !r.height) return;
    pointer.current = {
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top) / r.height,
    };
  };

  const onLeave = () => {
    pointer.current = { x: 0.5, y: 0.5 };
    resetTick.current += 1;
  };

  return (
    <div
      className="hero-canvas-wrap"
      style={{ "--rx": "0deg", "--ry": "0deg" } as React.CSSProperties}
      onPointerLeave={onLeave}
      onPointerMove={onMove}
    >
      <div className="hero-canvas-perspective">
        <Canvas
          gl={{ alpha: true, antialias: false, premultipliedAlpha: false, powerPreference: "high-performance" }}
          dpr={[1, 1.35]}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <Suspense fallback={null}>
            <HeroPlane
              baseUrl={baseUrl}
              overlayUrl={revealUrl}
              pointer={pointer}
              resetTick={resetTick}
              onReady={onReady}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
