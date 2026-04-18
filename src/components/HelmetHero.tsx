import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState, useCallback } from "react";
import * as THREE from "three";

/** كل اللي يخص hover ديال كانفاس الـ hero — بدّل هنا أو مرّر `hover` من `App` */
export type HeroCanvasHoverSettings = {
  /** تتبع الـ pointer (كلما كبر = أسرع) */
  pointerDamp?: number;
  /** دخول/خروج تأثير الـ hover */
  hoverFadeDamp?: number;
  /** قوة ظهور hero-3 داخل الماسك */
  revealStrength?: number;
  /** حجم البقعة (~1) */
  spotRadius?: number;
  /** بارالاكس على UV ديال hero-3 */
  parallax?: number;
  /** زوم بسيط على hero-3 وقت الـ hover */
  overlayHoverZoom?: number;
  /** يمدّ الماسك أفقياً (كلما صغر الرقم = شريط أعرض) */
  maskEllipseY?: number;
  /** مضاعف حركة البارالاكس فـ UV */
  parallaxUvScale?: number;

  /** ألوان صورة hero-3 (الـ overlay) فقط — ضرب RGB (1,1,1) = بدون تغيير */
  overlayMul?: [number, number, number];
  /** إضافة على RGB بعد الضرب (مثلاً [0.02,0,0] لإحمرار خفيف) */
  overlayAdd?: [number, number, number];
  /** تشبع: 1 = أصلي، 0 = رمادي، قيم أعلى = ألوان أقوى */
  overlaySaturation?: number;
  /** شفافية صورة hero-3 داخل الـ reveal: 1 = كامل، أقل = أخف (0–1) */
  overlayOpacity?: number;
};

const HOVER_DEFAULTS: Required<HeroCanvasHoverSettings> = {
  pointerDamp: 5.5,
  hoverFadeDamp: 5.5,
  revealStrength: 1.22,
  spotRadius: 1.0,
  parallax: 0.42,
  overlayHoverZoom: 0.028,
  maskEllipseY: 2.45,
  parallaxUvScale: 0.011,
  overlayMul: [1, 1, 1],
  overlayAdd: [0, 0, 0],
  overlaySaturation: 1,
  overlayOpacity: 1,
};

function mergeHover(h?: HeroCanvasHoverSettings): Required<HeroCanvasHoverSettings> {
  return { ...HOVER_DEFAULTS, ...h };
}

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
  uniform float uParallaxUvScale;
  uniform float uSpotRadius;
  uniform float uRevealStrength;
  uniform float uOverlayHoverZoom;
  uniform float uMaskEllipseY;
  uniform vec3 uOverlayMul;
  uniform vec3 uOverlayAdd;
  uniform float uOverlaySaturation;
  uniform float uOverlayOpacity;

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

    vec2 baseUv = fitCover(vUv, uScreenAspect, uBaseAspect, uBaseScale, uBaseOffset, vec2(0.0, 0.0));

    vec2 overlayParallax = (uPointer - 0.5) * uParallax * uParallaxUvScale * hoverAct;
    vec2 overlayUv0 = fitCover(vUv, uScreenAspect, uOverlayAspect, uOverlayScale, uOverlayOffset, overlayParallax);
    vec2 oc = overlayUv0 - 0.5;
    oc *= 1.0 + uOverlayHoverZoom * hoverAct * hoverAct;
    vec2 overlayUv = clamp(oc + 0.5, vec2(0.001), vec2(0.999));

    bool outBase = baseUv.x < 0.0 || baseUv.x > 1.0 || baseUv.y < 0.0 || baseUv.y > 1.0;
    bool outOverlay = overlayUv0.x < 0.0 || overlayUv0.x > 1.0 || overlayUv0.y < 0.0 || overlayUv0.y > 1.0;

    vec4 base = outBase ? vec4(0.0) : texture2D(uBase, baseUv);
    vec4 overlayCol = outOverlay ? vec4(0.0) : texture2D(uOverlay, overlayUv);

    vec2 d = vUv - uPointer;
    d.x *= uScreenAspect;
    d.y *= uMaskEllipseY;
    float dist = length(d);
    float ang = atan(d.y, d.x);
    vec2 nq = vUv * 19.0 + uPointer * 31.0;
    float n = nfbm(nq) + 0.32 * nfbm(nq * 1.85 + vec2(4.2, 9.1));
    n += 0.06 * sin(ang * 5.0 + uPointer.x * 14.7 + uPointer.y * 9.3);
    n += 0.03 * sin(vUv.x * 38.0 * uScreenAspect + n * 9.2);
    float wobble = (n - 0.5) * 0.27;
    float sigma = 0.22 * uSpotRadius;
    float distW = dist + wobble * sigma;
    float spot = exp(-distW * distW / (2.0 * sigma * sigma));
    float spotCore = pow(spot, 0.82);
    float alphaIn = outOverlay ? 0.0 : max(overlayCol.a, 0.88);
    float mixAmount = clamp(hoverAct * spotCore * alphaIn * uRevealStrength * uOverlayOpacity, 0.0, 1.0);

    float oin = outOverlay ? 0.0 : 1.0;
    vec2 dir = (uPointer - vec2(0.5, 0.5)) * 2.0;
    float dl = length(dir);
    vec2 dirn = dl > 0.001 ? dir / dl : vec2(1.0, 0.0);
    float chroma = hoverAct * 0.0024 * oin;
    vec2 uvc = overlayUv;
    float r = texture2D(uOverlay, clamp(uvc + dirn * chroma, vec2(0.001), vec2(0.999))).r;
    float g = texture2D(uOverlay, uvc).g;
    float b = texture2D(uOverlay, clamp(uvc - dirn * chroma * 0.92, vec2(0.001), vec2(0.999))).b;
    vec3 overlayFx = vec3(r, g, b);
    overlayFx *= 1.0 + 0.07 * hoverAct * oin;
    overlayFx += vec3(0.015, 0.022, 0.035) * hoverAct * oin;
    vec3 overlayRgb = mix(overlayCol.rgb, overlayFx, hoverAct * oin);

    vec3 ov = overlayRgb * uOverlayMul + uOverlayAdd;
    float lum = dot(ov, vec3(0.299, 0.587, 0.114));
    ov = mix(vec3(lum), ov, uOverlaySaturation);

    vec3 outColor = mix(base.rgb, ov, mixAmount);
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
  hover,
  onReady,
}: {
  baseUrl: string;
  overlayUrl: string;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  hoverRef: React.MutableRefObject<boolean>;
  resetTick: React.MutableRefObject<number>;
  hover: Required<HeroCanvasHoverSettings>;
  onReady?: () => void;
}) {
  const { size } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const [material, setMaterial] = useState<THREE.ShaderMaterial | null>(null);
  const lastResetTickRef = useRef(0);
  const readySentRef = useRef(false);
  const hoverRefSettings = useRef(hover);
  hoverRefSettings.current = hover;

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
      if (disposed) {
        tex.dispose();
        return;
      }
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      base = tex;
      tryFinish();
    });

    loader.load(overlayUrl, (tex) => {
      if (disposed) {
        tex.dispose();
        return;
      }
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
    const h = hoverRefSettings.current;

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
        uParallax: { value: h.parallax },
        uParallaxUvScale: { value: h.parallaxUvScale },
        uSpotRadius: { value: h.spotRadius },
        uRevealStrength: { value: h.revealStrength },
        uOverlayHoverZoom: { value: h.overlayHoverZoom },
        uMaskEllipseY: { value: h.maskEllipseY },
        uOverlayMul: { value: new THREE.Vector3(...h.overlayMul) },
        uOverlayAdd: { value: new THREE.Vector3(...h.overlayAdd) },
        uOverlaySaturation: { value: h.overlaySaturation },
        uOverlayOpacity: { value: h.overlayOpacity },
      },
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
    });

    materialRef.current = mat;
    setMaterial(mat);
    return () => {
      mat.dispose();
      materialRef.current = null;
      setMaterial(null);
    };
  }, [textures, size.width, size.height]);

  useFrame((_state, delta) => {
    const mat = materialRef.current;
    if (!mat) return;
    const u = mat.uniforms;
    const h = hoverRefSettings.current;

    if (resetTick.current !== lastResetTickRef.current) {
      lastResetTickRef.current = resetTick.current;
    }

    const p = u.uPointer.value as THREE.Vector2;
    p.x = THREE.MathUtils.damp(p.x, pointer.current.x, h.pointerDamp, delta);
    p.y = THREE.MathUtils.damp(p.y, 1 - pointer.current.y, h.pointerDamp, delta);

    const targetHover = hoverRef.current ? 1 : 0;
    u.uHover.value = THREE.MathUtils.damp(u.uHover.value, targetHover, h.hoverFadeDamp, delta);

    u.uScreenAspect.value = size.width / size.height;

    u.uParallax.value = h.parallax;
    u.uParallaxUvScale.value = h.parallaxUvScale;
    u.uSpotRadius.value = h.spotRadius;
    u.uRevealStrength.value = h.revealStrength;
    u.uOverlayHoverZoom.value = h.overlayHoverZoom;
    u.uMaskEllipseY.value = h.maskEllipseY;
    (u.uOverlayMul.value as THREE.Vector3).set(...h.overlayMul);
    (u.uOverlayAdd.value as THREE.Vector3).set(...h.overlayAdd);
    u.uOverlaySaturation.value = h.overlaySaturation;
    u.uOverlayOpacity.value = h.overlayOpacity;
  });

  if (!material) return null;

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export type HelmetHeroProps = {
  baseUrl: string;
  revealUrl: string;
  portraitAlt?: string;
  onReady?: () => void;
  /** تعديل سلوك الـ hover على هاد الكانفاس فقط */
  hover?: HeroCanvasHoverSettings;
};

export function HelmetHero({ baseUrl, revealUrl, portraitAlt, onReady, hover }: HelmetHeroProps) {
  const pointer = useRef({ x: 0.5, y: 0.5 });
  const hoverRef = useRef(false);
  const resetTick = useRef(0);
  const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement | null>(null);

  const hoverMerged = useMemo(
    () => mergeHover(hover),
    [
      hover?.pointerDamp,
      hover?.hoverFadeDamp,
      hover?.revealStrength,
      hover?.spotRadius,
      hover?.parallax,
      hover?.overlayHoverZoom,
      hover?.maskEllipseY,
      hover?.parallaxUvScale,
      hover?.overlayMul?.[0],
      hover?.overlayMul?.[1],
      hover?.overlayMul?.[2],
      hover?.overlayAdd?.[0],
      hover?.overlayAdd?.[1],
      hover?.overlayAdd?.[2],
      hover?.overlaySaturation,
      hover?.overlayOpacity,
    ],
  );

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
      aria-label={portraitAlt ?? undefined}
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
          dpr={[1, 1.85]}
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
              hover={hoverMerged}
              onReady={onReady}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
