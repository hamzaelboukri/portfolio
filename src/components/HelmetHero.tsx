import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
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
  uniform float uReveal;
  uniform float uScreenAspect;
  uniform float uBaseAspect;
  uniform float uOverlayAspect;
  uniform float uBaseScale;
  uniform vec2 uBaseOffset;
  uniform float uOverlayScale;
  uniform vec2 uOverlayOffset;

  vec2 fitHeight(vec2 uv, float screenAspect, float imgAspect) {
    vec2 s = uv;
    float ratio = imgAspect / screenAspect;
    s.x = (uv.x - 0.5) / ratio + 0.5;
    return s;
  }

  vec2 fitHeightScaled(vec2 uv, float screenAspect, float imgAspect, float scale, vec2 offset) {
    vec2 s = uv;
    float ratio = imgAspect / screenAspect;
    s.x = (uv.x - 0.5) / (ratio * scale) + 0.5 + offset.x;
    s.y = (uv.y - 0.5) / scale + 0.5 + offset.y;
    return s;
  }

  void main() {
    vec2 baseUv = fitHeightScaled(vUv, uScreenAspect, uBaseAspect, uBaseScale, uBaseOffset);
    vec2 overlayUv = fitHeightScaled(vUv, uScreenAspect, uOverlayAspect, uOverlayScale, uOverlayOffset);

    bool outBase = baseUv.x < 0.0 || baseUv.x > 1.0 || baseUv.y < 0.0 || baseUv.y > 1.0;
    bool outOverlay = overlayUv.x < 0.0 || overlayUv.x > 1.0 || overlayUv.y < 0.0 || overlayUv.y > 1.0;

    vec4 base = outBase ? vec4(0.0) : texture2D(uBase, baseUv);
    vec4 overlay = outOverlay ? vec4(0.0) : texture2D(uOverlay, overlayUv);

    float fade = uReveal;

    float overlayVis = overlay.a * fade;
    float baseVis = base.a * (1.0 - overlayVis);
    float outAlpha = overlayVis + baseVis;

    vec3 outColor = outAlpha > 0.001
      ? (overlay.rgb * overlayVis + base.rgb * baseVis) / outAlpha
      : vec3(0.0);

    gl_FragColor = vec4(outColor, outAlpha);
  }
`;

function HeroPlane({
  baseUrl,
  overlayUrl,
  hovered,
  pointer,
}: {
  baseUrl: string;
  overlayUrl: string;
  hovered: boolean;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const { size } = useThree();
  const matRef = useRef<THREE.ShaderMaterial | null>(null);
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
    if (!textures) return;

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uBase: { value: textures.base },
        uOverlay: { value: textures.overlay },
        uPointer: { value: new THREE.Vector2(0.5, 0.5) },
        uReveal: { value: 0 },
        uScreenAspect: { value: size.width / size.height },
        uBaseAspect: { value: textures.baseAspect },
        uOverlayAspect: { value: textures.overlayAspect },
        uBaseScale: { value: 1.0 },
        uBaseOffset: { value: new THREE.Vector2(0.0, 0.088) },
        uOverlayScale: { value: 1.0 },
        uOverlayOffset: { value: new THREE.Vector2(-0.02, -0.04) },
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
    const p = u.uPointer.value as THREE.Vector2;

    p.x = THREE.MathUtils.damp(p.x, pointer.current.x, 4, delta);
    p.y = THREE.MathUtils.damp(p.y, 1 - pointer.current.y, 4, delta);

    u.uReveal.value = THREE.MathUtils.damp(
      u.uReveal.value,
      hovered ? 1 : 0,
      hovered ? 3 : 2,
      delta
    );

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
};

export function HelmetHero({ baseUrl, revealUrl }: HelmetHeroProps) {
  const [hovered, setHovered] = useState(false);
  const pointer = useRef({ x: 0.5, y: 0.5 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const cur = useRef({ x: 0.5, y: 0.5 });
  const tgt = useRef({ x: 0.5, y: 0.5 });

  const tick = useCallback(() => {
    const s = 0.04;
    const c = cur.current;
    const t = tgt.current;
    c.x += (t.x - c.x) * s;
    c.y += (t.y - c.y) * s;
    pointer.current = { x: c.x, y: c.y };

    const el = wrapRef.current;
    if (el) {
      el.style.setProperty("--rx", `${(c.y - 0.5) * -4}deg`);
      el.style.setProperty("--ry", `${(c.x - 0.5) * 5}deg`);
    }

    if (Math.abs(t.x - c.x) > 0.0002 || Math.abs(t.y - c.y) > 0.0002) {
      raf.current = requestAnimationFrame(tick);
    } else {
      raf.current = 0;
    }
  }, []);

  const go = useCallback(() => {
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  }, [tick]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    if (!r.width || !r.height) return;
    tgt.current = {
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top) / r.height,
    };
    go();
  };

  return (
    <div
      ref={wrapRef}
      className="hero-canvas-wrap"
      style={{ "--rx": "0deg", "--ry": "0deg" } as React.CSSProperties}
      onPointerEnter={() => { setHovered(true); go(); }}
      onPointerLeave={() => { setHovered(false); tgt.current = { x: 0.5, y: 0.5 }; go(); }}
      onPointerMove={onMove}
    >
      <div className="hero-canvas-perspective">
        <Canvas
          gl={{ alpha: true, antialias: true, premultipliedAlpha: false }}
          dpr={[1, 2]}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <Suspense fallback={null}>
            <HeroPlane
              baseUrl={baseUrl}
              overlayUrl={revealUrl}
              hovered={hovered}
              pointer={pointer}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
