import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState, useCallback } from "react";
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
  uniform float uHover;
  uniform float uScreenAspect;
  uniform float uBaseAspect;
  uniform float uOverlayAspect;
  uniform float uBaseScale;
  uniform vec2 uBaseOffset;
  uniform float uOverlayScale;
  uniform vec2 uOverlayOffset;
  uniform float uParallax;
  uniform float uSpotRadius;
  uniform float uRevealStrength;

  float nhash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float nnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(nhash(i), nhash(i + vec2(1.0, 0.0)), u.x),
      mix(nhash(i + vec2(0.0, 1.0)), nhash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float nfbm(vec2 p) {
    float v = 0.0;
    v += 0.5 * nnoise(p); p *= 2.02;
    v += 0.25 * nnoise(p); p *= 2.03;
    v += 0.125 * nnoise(p); p *= 2.01;
    v += 0.0625 * nnoise(p);
    return v;
  }

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
    float hoverAct = smoothstep(0.02, 0.98, uHover);

    // Base (hamza): stable — no parallax / hover tilt on base image
    vec2 baseUv = fitCover(vUv, uScreenAspect, uBaseAspect, uBaseScale, uBaseOffset, vec2(0.0, 0.0));

    // hero-3 (overlay): parallax + micro-zoom only while pointer is on canvas
    vec2 overlayParallax = (uPointer - 0.5) * uParallax * 0.016 * hoverAct;
    vec2 overlayUv0 = fitCover(vUv, uScreenAspect, uOverlayAspect, uOverlayScale, uOverlayOffset, overlayParallax);
    vec2 oc = overlayUv0 - 0.5;
    oc *= 1.0 + 0.035 * hoverAct * hoverAct;
    vec2 overlayUv = clamp(oc + 0.5, vec2(0.001), vec2(0.999));

    bool outBase = baseUv.x < 0.0 || baseUv.x > 1.0 || baseUv.y < 0.0 || baseUv.y > 1.0;
    bool outOverlay = overlayUv0.x < 0.0 || overlayUv0.x > 1.0 || overlayUv0.y < 0.0 || overlayUv0.y > 1.0;

    vec4 base = outBase ? vec4(0.0) : texture2D(uBase, baseUv);
    vec4 overlayCol = outOverlay ? vec4(0.0) : texture2D(uOverlay, overlayUv);

    // Organic reveal mask (same for both layers' blend)
    // Ellipse biased toward a horizontal "torn strip" (reference-style reveal), not a round spotlight
    vec2 d = vUv - uPointer;
    d.x *= uScreenAspect;
    d.y *= 2.45;
    float dist = length(d);
    float ang = atan(d.y, d.x);
    vec2 nq = vUv * 19.0 + uPointer * 31.0;
    float n = nfbm(nq) + 0.48 * nfbm(nq * 1.85 + vec2(4.2, 9.1));
    n += 0.12 * sin(ang * 5.0 + uPointer.x * 14.7 + uPointer.y * 9.3);
    n += 0.06 * sin(vUv.x * 38.0 * uScreenAspect + n * 9.2);
    float wobble = (n - 0.5) * 0.42;
    float sigma = 0.22 * uSpotRadius;
    float distW = dist + wobble * sigma;
    float spot = exp(-distW * distW / (2.0 * sigma * sigma));
    float spotCore = pow(spot, 0.82);
    float alphaIn = outOverlay ? 0.0 : max(overlayCol.a, 0.88);
    float mixAmount = clamp(hoverAct * spotCore * alphaIn * uRevealStrength, 0.0, 1.0);

    // Hover styling only on hero-3 (chroma + lift + rim) — skip if UV outside overlay
    float oin = outOverlay ? 0.0 : 1.0;
    vec2 dir = (uPointer - vec2(0.5, 0.5)) * 2.0;
    float dl = length(dir);
    vec2 dirn = dl > 0.001 ? dir / dl : vec2(1.0, 0.0);
    float chroma = hoverAct * 0.0042 * oin;
    vec2 uvc = overlayUv;
    float r = texture2D(uOverlay, clamp(uvc + dirn * chroma, vec2(0.001), vec2(0.999))).r;
    float g = texture2D(uOverlay, uvc).g;
    float b = texture2D(uOverlay, clamp(uvc - dirn * chroma * 0.92, vec2(0.001), vec2(0.999))).b;
    vec3 overlayFx = vec3(r, g, b);
    overlayFx *= 1.0 + 0.14 * hoverAct * oin;
    overlayFx += vec3(0.03, 0.045, 0.07) * hoverAct * oin;
    vec3 overlayRgb = mix(overlayCol.rgb, overlayFx, hoverAct * oin);

    vec3 outColor = mix(base.rgb, overlayRgb, mixAmount);
    float outAlpha = max(base.a, mixAmount * overlayCol.a);
    gl_FragColor = vec4(outColor, outAlpha);
  }
`;

function HeroPlane({
  baseUrl,
  overlayUrl,
  pointer,
  hoverRef,
  resetTick,
  onReady,
}: {
  baseUrl: string;
  overlayUrl: string;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  hoverRef: React.MutableRefObject<boolean>;
  resetTick: React.MutableRefObject<number>;
  onReady?: () => void;
}) {
  const { size } = useThree();
  const matRef = useRef<THREE.ShaderMaterial | null>(null);
  const lastResetTickRef = useRef(0);
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
      toneMapped: false,
      uniforms: {
        uBase: { value: textures.base },
        uOverlay: { value: textures.overlay },
        uPointer: { value: new THREE.Vector2(0.5, 0.5) },
        uHover: { value: 0 },
        uScreenAspect: { value: size.width / size.height },
        uBaseAspect: { value: textures.baseAspect },
        uOverlayAspect: { value: textures.overlayAspect },
        uBaseScale: { value: 1.0 },
        uBaseOffset: { value: new THREE.Vector2(0.0, 0.088) },
        uOverlayScale: { value: 1.0 },
        uOverlayOffset: { value: new THREE.Vector2(-0.02, 0.014) },
        uParallax: { value: 0.7 },
        uSpotRadius: { value: 1.0 },
        uRevealStrength: { value: 1.22 },
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

    if (resetTick.current !== lastResetTickRef.current) {
      lastResetTickRef.current = resetTick.current;
    }

    const p = u.uPointer.value as THREE.Vector2;
    p.x = THREE.MathUtils.damp(p.x, pointer.current.x, 5.5, delta);
    p.y = THREE.MathUtils.damp(p.y, 1 - pointer.current.y, 5.5, delta);

    const targetHover = hoverRef.current ? 1 : 0;
    u.uHover.value = THREE.MathUtils.damp(u.uHover.value, targetHover, 5.5, delta);

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
  const hoverRef = useRef(false);
  const resetTick = useRef(0);
  const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement | null>(null);

  const updatePointer = useCallback((e: PointerEvent, target: HTMLCanvasElement) => {
    const r = target.getBoundingClientRect();
    if (!r.width || !r.height) return;
    pointer.current = {
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top) / r.height,
    };
  }, []);

  useEffect(() => {
    if (!canvasEl) return;

    const onMove = (e: PointerEvent) => updatePointer(e, canvasEl);
    const onEnter = () => {
      hoverRef.current = true;
    };
    const onLeave = () => {
      hoverRef.current = false;
      pointer.current = { x: 0.5, y: 0.5 };
      resetTick.current += 1;
    };

    canvasEl.addEventListener("pointermove", onMove, { passive: true });
    canvasEl.addEventListener("pointerenter", onEnter);
    canvasEl.addEventListener("pointerleave", onLeave);
    canvasEl.style.touchAction = "none";

    return () => {
      canvasEl.removeEventListener("pointermove", onMove);
      canvasEl.removeEventListener("pointerenter", onEnter);
      canvasEl.removeEventListener("pointerleave", onLeave);
    };
  }, [canvasEl, updatePointer]);

  return (
    <div
      className="hero-canvas-wrap"
      style={{ "--rx": "0deg", "--ry": "0deg" } as React.CSSProperties}
    >
      <div className="hero-canvas-perspective">
        <Canvas
          gl={{
            alpha: true,
            antialias: true,
            premultipliedAlpha: false,
            powerPreference: "high-performance",
            outputColorSpace: THREE.SRGBColorSpace,
          }}
          dpr={[1, 1.35]}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.toneMapping = THREE.NoToneMapping;
            gl.toneMappingExposure = 1;
            setCanvasEl(gl.domElement);
          }}
        >
          <Suspense fallback={null}>
            <HeroPlane
              baseUrl={baseUrl}
              overlayUrl={revealUrl}
              pointer={pointer}
              hoverRef={hoverRef}
              resetTick={resetTick}
              onReady={onReady}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
